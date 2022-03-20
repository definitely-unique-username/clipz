import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from '@clipz/components/header';
import { ClipzAuthModule } from '@clipz/auth';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HeaderModule,
    ClipzAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
