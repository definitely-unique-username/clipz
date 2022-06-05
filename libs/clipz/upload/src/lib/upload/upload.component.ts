import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyService } from '@clipz/util';
import { Observable, takeUntil } from 'rxjs';
import { UploadService } from '../upload.service';

@Component({
  selector: 'clipz-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService, UploadService]
})
export class UploadComponent implements OnInit, OnDestroy {
  public readonly file$: Observable<File | null> = this.uploadService.file$;
  public readonly fileSelected$: Observable<boolean> = this.uploadService.fileSelected$;
  public readonly progress$: Observable<number> = this.uploadService.progress$;
  public readonly form: FormGroup = new FormGroup({
    video: new FormGroup({
      file: new FormControl(null, [Validators.required])
    }),
    summary: new FormGroup({
      image: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required, Validators.minLength(3)])
    })
  });
  public readonly screenshots$: Observable<string[]> = this.uploadService.screenshots$;
  public readonly init$: Observable<boolean> = this.uploadService.init$;
  public readonly pending$: Observable<boolean> = this.uploadService.pending$;

  constructor(
    private readonly router: Router,
    private readonly uploadService: UploadService,
    private readonly destroy$: DestroyService
  ) {
    this.uploadService.initFfmpeg();
  }

  public ngOnInit(): void {
    this.uploadService.uploaded$.pipe(takeUntil(this.destroy$)).subscribe((uuid: string) => {
      this.router.navigate(['/clip', uuid]);
    });
  }

  public ngOnDestroy(): void {
    this.uploadService.clearScreenshots();
  }

  public onSubmit(): void {
    // if (this.form.valid) {
      const title: string = this.form.value.summary.title;
      this.uploadService.uploadFile(title);
    // }
  }

  public onFileSelect(file: File | null): void {
    if (file instanceof File && file.type === 'video/mp4') {
      this.uploadService.setFile(file);
      this.form.patchValue({ summary: { title: file.name } });
      return;
    }

    this.form.patchValue({ video: { file: null } });
    this.uploadService.setFile(file);
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
}
