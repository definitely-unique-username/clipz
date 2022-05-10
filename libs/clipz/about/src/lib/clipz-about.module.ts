import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { ClipzAboutRoutingModule } from './clipz-about-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ClipzAboutRoutingModule
  ],
  declarations: [
    AboutComponent
  ],
})
export class ClipzAboutModule {}
