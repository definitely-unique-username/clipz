import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ClipzHomeRoutingModule } from './clipz-home-routing.module';
import { ClipzIntersactionObserverModule } from '@clipz/directives/intersaction-observer';
import { EqualPipeModule } from '@clipz/pipes/equal';
import { ClipzSpinnerModule } from '@clipz/components/spinner';
import { ClipCardModule } from '@clipz/components/clip-card';
import { ClipsListModule } from '@clipz/components/clips-list';

@NgModule({
  imports: [CommonModule, ClipzHomeRoutingModule, ClipzIntersactionObserverModule, EqualPipeModule, ClipzSpinnerModule, ClipCardModule, ClipsListModule],
  declarations: [HomeComponent]
})
export class ClipzHomeModule { }
