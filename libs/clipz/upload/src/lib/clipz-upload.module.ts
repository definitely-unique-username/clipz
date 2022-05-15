import { NgModule } from '@angular/core';
import { ClipzUploadRoutingModule } from './clipz-upload-routing.module';
import { UploadComponent } from './upload/upload.component';
import {ClipzDropzoneModule} from '@clipz/directives/dropzone'

@NgModule({
  imports: [ClipzUploadRoutingModule, ClipzDropzoneModule],
  declarations: [UploadComponent]
})
export class ClipzUploadModule {}
