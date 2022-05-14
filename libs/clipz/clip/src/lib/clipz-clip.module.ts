import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipComponent } from './clip/clip.component';
import { ClipzClipRoutingModule } from './clipz-clip-routing.module';

@NgModule({
  imports: [CommonModule, ClipzClipRoutingModule],
  declarations: [
    ClipComponent
  ],
})
export class ClipzClipModule {}
