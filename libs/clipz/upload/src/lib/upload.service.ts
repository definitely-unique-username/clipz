import { Injectable } from '@angular/core';
import { UploadTask } from '@angular/fire/storage';
import { ClipsService, FfmpegService, UploadData, UploadSnapshot } from '@clipz/core';
import { ModelStatus } from '@clipz/util';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, filter, from, Observable, of, Subject, switchMap, withLatestFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';

interface UploadState {
  file: File | null;
  progress: number;
  screenshots: string[];
  status: ModelStatus;
  uploadTask: UploadTask | null;
}

const initialState: UploadState = {
  file: null,
  progress: 0,
  screenshots: [],
  status: ModelStatus.Init,
  uploadTask: null
};

@Injectable()
export class UploadService extends ComponentStore<UploadState> {
  private readonly uploadedSource: Subject<string> = new Subject<string>();
  
  public readonly file$: Observable<File | null> = this.select((state: UploadState) => state.file);
  public readonly fileSelected$: Observable<boolean> = this.select((state: UploadState) => state.file instanceof File);
  public readonly progress$: Observable<number> = this.select((state: UploadState) => state.progress);
  public readonly screenshots$: Observable<string[]> = this.select((state: UploadState) => state.screenshots);
  public readonly status$: Observable<ModelStatus> = this.select((state: UploadState) => state.status);
  public readonly init$: Observable<boolean> = this.select((state: UploadState) => state.status === ModelStatus.Init);
  public readonly pending$: Observable<boolean> = this.select((state: UploadState) => state.status === ModelStatus.Pending);
  public readonly uploading$: Observable<boolean> = this.select((state: UploadState) => state.status === ModelStatus.Uploading);
  public readonly uploaded$: Observable<string> = this.uploadedSource.asObservable();

  private readonly initFfmpeg$ = this.effect((origin$: Observable<void>) =>
    origin$.pipe(
      withLatestFrom(this.init$),
      filter(([_, init]: [void, boolean]) => init),
      exhaustMap(() => from(this.ffmpeg.initFFmpeg())),
      tapResponse(
        () => this.onInitFfmpegSuccess(),
        () => this.onInitFfmpegError()
      )
    )
  );

  private readonly setFile$ = this.effect((file$: Observable<File | null>) =>
    file$.pipe(
      switchMap((file: File | null) => {
        this.onGetScreenshots();
        return file instanceof File ? this.ffmpeg.getScreenshots(file) : of([]);
      }),
      tapResponse(
        (screenshots: string[]) => this.onGetScreenshotsSuccess(screenshots),
        () => this.onGetScreenshotsError()
      )
    )
  );

  private readonly createClip$ = this.effect((data$: Observable<{ title: string; timestamp: number }>) =>
    data$.pipe(
      withLatestFrom(this.file$),
      filter(([, file]: [{ title: string, timestamp: number }, File | null]) => file instanceof File),
      exhaustMap(([{ timestamp, title }, file]: [{ title: string, timestamp: number }, File | null]) => {
        const fileName: string = `${uuid()}.mp4`;
        const { uploadSnapshot$, uploadTask }: UploadData = this.clipsService.createClip(fileName, title, timestamp, file as File);
        this.onUploadFile(uploadTask);

        return uploadSnapshot$;
      }),
      tapResponse(
        (snapshot: UploadSnapshot) => { 
          if (snapshot.uuid) {
            this.onUploadFileSuccess(snapshot.uuid);
          } else {
            this.onUploadFileProgress(snapshot.progress); 
          }
        },
        () => { this.onUploadFileError(); },
      )
    )
  )

  constructor(
    private readonly clipsService: ClipsService,
    private readonly ffmpeg: FfmpegService
  ) {
    super(initialState);
    this.state$.subscribe(console.log);
  }

  public initFfmpeg(): void {
    console.log('initFfmpeg');
    this.initFfmpeg$();
  }

  public setFile(file: File | null): void {
    this.patchState({ file });
    this.setFile$(file);
  }

  public createClip(title: string, timestamp: number = Date.now()): void {
    console.log('uploadFile');
    this.createClip$({ title, timestamp });
  }

  public clearScreenshots(): void {
    const screenshots: string[] = this.get((state: UploadState) => state.screenshots);
    this.ffmpeg.revokeUrls(screenshots);
  }

  public cancelTask(): void {
    const task: UploadTask | null = this.get((state: UploadState) => state.uploadTask);
    task?.cancel();
  }

  private onInitFfmpegSuccess(): void {
    console.log('onInitFfmpegSuccess');
    this.patchState({ status: ModelStatus.Success });
  }

  private onInitFfmpegError(): void {
    this.patchState({ status: ModelStatus.Error });
    alert('Failed to init Ffmpeg');
  }

  private onGetScreenshots(): void {
    console.log('onGetScreenshots');
    this.patchState({ status: ModelStatus.Pending });
  }

  private onGetScreenshotsSuccess(screenshots: string[]): void {
    console.log('onGetScreenshotsSuccess');
    this.clearScreenshots();
    this.patchState({ screenshots, status: ModelStatus.Success });
  }

  private onGetScreenshotsError(): void {
    this.patchState({ status: ModelStatus.Error });
    alert('Failed to get screenshots');
  }

  private onUploadFile(uploadTask: UploadTask): void {
    console.log('onUploadFile');
    this.patchState({ uploadTask, status: ModelStatus.Uploading });
  }

  private onUploadFileProgress(progress: number): void {
    console.log('onUploadFileProgress');
    this.patchState({ progress });
  }

  private onUploadFileSuccess(uuid: string): void {
    console.log('onUploadFileSuccess');
    this.patchState({ status: ModelStatus.Success, uploadTask: null });
    this.uploadedSource.next(uuid);
  }

  private onUploadFileError(): void {
    this.patchState({ status: ModelStatus.Error, uploadTask: null });
    alert('Failed to upload file');
  }
}
