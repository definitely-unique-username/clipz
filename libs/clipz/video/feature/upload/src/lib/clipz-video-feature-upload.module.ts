import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipzVideoFeatureShellRoutingModule } from './clipz-video-feature-upload-routing.module';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  imports: [CommonModule, ClipzVideoFeatureShellRoutingModule],
  declarations: [
    UploadComponent
  ],
})
export class ClipzVideoFeatureUploadModule {}
