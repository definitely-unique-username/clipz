import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipComponent } from './clip/clip.component';
import { ClipzClipRoutingModule } from './clipz-clip-routing.module';
import { EqualPipeModule } from '@clipz/pipes/equal';
import { ClipzSpinnerModule } from '@clipz/components/spinner';
import { ClipsListModule } from '@clipz/components/clips-list';
import { PlayerModule } from '@clipz/directives/player';

@NgModule({
  imports: [CommonModule, ClipzClipRoutingModule, EqualPipeModule, ClipzSpinnerModule, ClipsListModule, PlayerModule],
  declarations: [
    ClipComponent
  ],
})
export class ClipzClipModule {}
