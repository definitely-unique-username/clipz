import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from '@clipz/components/header';
import { ClipzAuthModule } from '@clipz/auth';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { ClipzCoreModule } from '@clipz/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HeaderModule,
    ClipzCoreModule,
    ClipzAuthModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
