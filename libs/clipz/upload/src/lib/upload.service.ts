import { Injectable } from '@angular/core';
import { UploadTask } from '@angular/fire/storage';
import { ClipsService, FfmpegService, ScreenshotsService, SnapshotProgress, UploadData, UploadSnapshot } from '@clipz/core';
import { ModelStatus } from '@clipz/util';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { combineLatest, exhaustMap, filter, from, Observable, of, Subject, switchMap, withLatestFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';

interface UploadState {
  file: File | null;
  progress: number;
  screenshots: string[];
  status: ModelStatus;
  clipUploadTask: UploadTask | null;
  screenshotUploadTask: UploadTask | null;
}

const initialState: UploadState = {
  file: null,
  progress: 0,
  screenshots: [],
  status: ModelStatus.Init,
  clipUploadTask: null,
  screenshotUploadTask: null
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

  private readonly uploadData$ = this.effect((data$: Observable<{ title: string; timestamp: number, screenshotUrl: string }>) =>
    data$.pipe(
      withLatestFrom(this.file$),
      filter(([, file]: [{ title: string, timestamp: number, screenshotUrl: string }, File | null]) => file instanceof File),
      exhaustMap(([{ timestamp, title, screenshotUrl }, file]: [{ title: string, timestamp: number, screenshotUrl: string }, File | null]) => {

        return this.urlToBlob(screenshotUrl).pipe(
          switchMap((screenshotBlob: Blob) => {
            const clipFileName: string = `${uuid()}.mp4`;
            const { uploadSnapshot$: clipUploadSbapshot$, uploadTask: clipUploadTask }: UploadData = this.clipsService.upload(clipFileName, file as File);
            const screenshotFileName: string = `${uuid()}.png`;
            const { uploadSnapshot$: screenshotUploadSnapshot$, uploadTask: screenshotUploadTask }: UploadData = this.screenshotsService.upload(screenshotFileName, screenshotBlob)
            this.onUploadData(clipUploadTask, screenshotUploadTask);

            return combineLatest([
              clipUploadSbapshot$,
              screenshotUploadSnapshot$
            ]).pipe(
              tapResponse(
                ([clipSnapshot, screenshotSnapshot]: [UploadSnapshot, UploadSnapshot]) => {
                  if (
                    clipSnapshot.state === SnapshotProgress.Success
                    && screenshotSnapshot.state === SnapshotProgress.Success
                    && clipSnapshot.url && screenshotSnapshot.url
                  ) {
                    this.onUploadDataSuccess({
                      fileName: clipFileName,
                      fileUrl: clipSnapshot.url,
                      title,
                      imageUrl: screenshotSnapshot.url,
                      imageName: screenshotFileName,
                      timestamp,
                    });
                  } else {
                    this.onUploadDataProgress(clipSnapshot.progress, screenshotSnapshot.progress);
                  }
                },
                () => { this.onUploadDataError(); },
              )
            );
          })
        );
      }),

    )
  );

  private readonly createClip$ = this.effect((data$: Observable<CreateClipData>) =>
    data$.pipe(
      exhaustMap(({ fileName, fileUrl, imageUrl, timestamp, title, imageName }: CreateClipData) =>
        this.clipsService.createClip(fileName, title, timestamp, fileUrl, imageName, imageUrl)
      ),
      tapResponse(
        (clipId: string) => this.onCreateClipSuccess(clipId),
        () => this.onCreateClipError()
      )
    )
  );

  constructor(
    private readonly clipsService: ClipsService,
    private readonly screenshotsService: ScreenshotsService,
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

  public createClip(title: string, screenshotUrl: string, timestamp: number = Date.now()): void {
    console.log('uploadData');
    this.uploadData$({ title, timestamp, screenshotUrl });
  }

  public clearScreenshots(): void {
    const screenshots: string[] = this.get((state: UploadState) => state.screenshots);
    this.ffmpeg.revokeUrls(screenshots);
  }

  public cancelTasks(): void {
    const { clipUploadTask, screenshotUploadTask } = this.get((state: UploadState) => ({ clipUploadTask: state.clipUploadTask, screenshotUploadTask: state.screenshotUploadTask }));
    clipUploadTask?.cancel();
    screenshotUploadTask?.cancel();
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

  private onUploadData(clipUploadTask: UploadTask, screenshotUploadTask: UploadTask): void {
    console.log('onUploadData');
    this.patchState({ clipUploadTask, screenshotUploadTask, status: ModelStatus.Uploading });
  }

  private onUploadDataProgress(clipProgress: number, screenshotProgress: number): void {
    const progress: number = Math.round((clipProgress + screenshotProgress) * 100 / 2) / 100;
    console.log('onUploadDataProgress', progress, clipProgress, screenshotProgress);
    this.patchState({ progress });
  }

  private onUploadDataSuccess(data: CreateClipData): void {
    console.log('onUploadDataSuccess');
    this.patchState({ clipUploadTask: null, screenshotUploadTask: null });
    this.onCreateClip(data);
  }

  private onUploadDataError(): void {
    debugger
    this.patchState({ status: ModelStatus.Error, clipUploadTask: null, screenshotUploadTask: null });
    alert('Failed to upload file');
  }

  private onCreateClip(data: CreateClipData): void {
    console.log('onCreateClip');
    this.createClip$(data);
  }

  private onCreateClipSuccess(clipId: string): void {
    console.log('createClipSuccess');
    this.patchState({ status: ModelStatus.Success });
    this.uploadedSource.next(clipId);
  }

  private onCreateClipError(): void {
    this.patchState({ status: ModelStatus.Error });
    alert('Failed to create clip');
  }

  private urlToBlob(url: string): Observable<Blob> {
    return from(fetch(url).then(res => res.blob()));
  }
}

interface CreateClipData {
  fileName: string;
  title: string;
  timestamp: number;
  fileUrl: string;
  imageUrl: string;
  imageName: string;
}