import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipsListComponent } from './clips-list/clips-list.component';
import { RouterModule } from '@angular/router';
import { ClipCardModule } from '@clipz/components/clip-card';

@NgModule({
  imports: [CommonModule, RouterModule, ClipCardModule],
  declarations: [ClipsListComponent],
  exports: [ClipsListComponent]
})
export class ClipsListModule {}
