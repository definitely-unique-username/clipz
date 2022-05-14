import { NgModule } from '@angular/core';
import { ClipzUploadRoutingModule } from './clipz-upload-routing.module';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  imports: [ClipzUploadRoutingModule],
  declarations: [UploadComponent]
})
export class ClipzUploadModule {}
