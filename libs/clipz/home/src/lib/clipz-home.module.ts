import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ClipzHomeRoutingModule } from './clipz-home-routing.module';

@NgModule({
  imports: [CommonModule, ClipzHomeRoutingModule],
  declarations: [HomeComponent]
})
export class ClipzHomeModule { }
