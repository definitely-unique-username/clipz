import { NgModule } from '@angular/core';
import { SafeUrlPipe } from './sanitize-resource-url.pipe';

@NgModule({
  declarations: [SafeUrlPipe],
  exports: [SafeUrlPipe]
})
export class SanitizePipeModule { }
