import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipCardComponent } from './clip-card/clip-card.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ClipCardComponent
  ],
  exports: [
    ClipCardComponent
  ],
})
export class ClipCardModule {}
