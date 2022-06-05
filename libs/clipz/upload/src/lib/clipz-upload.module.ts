import { NgModule } from '@angular/core';
import { ClipzUploadRoutingModule } from './clipz-upload-routing.module';
import { UploadComponent } from './upload/upload.component';
import { ClipzDropzoneModule } from '@clipz/directives/dropzone'
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EqualPipeModule } from '@clipz/pipes/equal';
import { SanitizePipeModule } from '@clipz/pipes/sanitize';
import { ScreenshotSelectComponent } from './screenshot-select/screenshot-select.component';

@NgModule({
  imports: [
    CommonModule,
    ClipzUploadRoutingModule,
    ClipzDropzoneModule,
    ReactiveFormsModule,
    EqualPipeModule,
    SanitizePipeModule
  ],
  declarations: [UploadComponent, ScreenshotSelectComponent],
})
export class ClipzUploadModule { }
