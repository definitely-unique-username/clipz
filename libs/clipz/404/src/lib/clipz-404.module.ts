import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clipz404Component } from './404/404.component';
import { Clipz404RoutingModule } from './clipz-404-routing.module';

@NgModule({
  imports: [CommonModule, Clipz404RoutingModule],
  declarations: [
    Clipz404Component
  ],
})
export class Clipz404Module {}
