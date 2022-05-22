import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { UploadTask } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyService } from '@clipz/util';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ClipsService } from '../clips.service';
import { UploadData, UploadSnapshot } from '../util';

@Component({
  selector: 'clipz-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class UploadComponent implements OnDestroy {
  private readonly fileSelectedSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly progressSource: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private submitting: boolean = false;
  private uploadTask: UploadTask | null = null;

  public readonly fileSelected$: Observable<boolean> = this.fileSelectedSource.asObservable();
  public readonly progress$: Observable<number> = this.progressSource.asObservable();
  public readonly form: FormGroup = new FormGroup({
    video: new FormGroup({
      file: new FormControl(null, [Validators.required])
    }),
    summary: new FormGroup({
      image: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required, Validators.minLength(3)])
    })
  });

  constructor(
    private readonly clipsService: ClipsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) { }

  public ngOnDestroy(): void {
    this.uploadTask?.cancel();
  }

  public onSubmit(): void {
    // if (this.form.valid && !this.submitting) {
    this.submitting = true;
    const fileName: string = `${uuid()}.mp4`;
    const title: string = this.form.value.summary.title;
    const timestamp: number = Date.now();
    const { uploadSnapshot$, uploadTask } = this.getUploadProgress(fileName, title, timestamp, this.form.value.video.file);
    this.uploadTask = uploadTask;
    uploadSnapshot$.pipe(finalize(() => { this.submitting = false; })).subscribe({
      next: ({ uuid }: UploadSnapshot) => { 
        if (uuid) {
          this.router.navigate(['/clip', uuid]);
        }
      },
      error: (error: any) => { alert(error); }
    });
    // }
  }

  public onFileSelect(file: File | null): void {
    if (file instanceof File && file.type === 'video/mp4') {
      this.fileSelectedSource.next(true);
      this.form.patchValue({ summary: { title: file.name } });
      return;
    }

    this.form.patchValue({ video: { file: null } });
  }

  public onFileChange(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file: File = target.files[0];
      if (file) {
        this.form.patchValue({ video: { file } });
        this.onFileSelect(file);
      }
    }
  }

  private getUploadProgress(path: string, title: string, timestamp: number, file: File): UploadData {
    const { uploadSnapshot$, uploadTask }: UploadData = this.clipsService.upload(path, title, timestamp, file);
    return {
      uploadTask,
      uploadSnapshot$: uploadSnapshot$.pipe(
        tap((snapshot: UploadSnapshot) => {
          this.progressSource.next(snapshot.progress);
          this.cdr.detectChanges();
        })
      )
    }
  }
}
