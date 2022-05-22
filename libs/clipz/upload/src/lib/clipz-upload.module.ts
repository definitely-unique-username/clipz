import { NgModule } from '@angular/core';
import { ClipzUploadRoutingModule } from './clipz-upload-routing.module';
import { UploadComponent } from './upload/upload.component';
import {ClipzDropzoneModule} from '@clipz/directives/dropzone'
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule, 
    ClipzUploadRoutingModule, 
    ClipzDropzoneModule, 
    ReactiveFormsModule,
  ],
  declarations: [UploadComponent],
})
export class ClipzUploadModule {}
