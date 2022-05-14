import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video/video.component';
import { ClipzVideoRoutingModule } from './clipz-video-routing.module';

@NgModule({
  imports: [CommonModule, ClipzVideoRoutingModule],
  declarations: [
    VideoComponent
  ],
})
export class ClipzVideoModule {}
