import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ClipzHomeRoutingModule } from './clipz-home-routing.module';
import { ClipzIntersactionObserverModule } from '@clipz/directives/intersaction-observer';
import { ClipsListComponent } from './clips-list/clips-list.component';
import { EqualPipeModule } from '@clipz/pipes/equal';
import { ClipzSpinnerModule } from '@clipz/components/spinner';
import { ClipCardModule } from '@clipz/components/clip-card';

@NgModule({
  imports: [CommonModule, ClipzHomeRoutingModule, ClipzIntersactionObserverModule, EqualPipeModule, ClipzSpinnerModule, ClipCardModule],
  declarations: [HomeComponent, ClipsListComponent]
})
export class ClipzHomeModule { }
