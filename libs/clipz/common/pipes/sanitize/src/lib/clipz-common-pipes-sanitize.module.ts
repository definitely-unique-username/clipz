import { NgModule } from '@angular/core';
import { SanitizeResourceUrlPipe } from './sanitize-resource-url.pipe';

@NgModule({
  declarations: [SanitizeResourceUrlPipe],
  exports: [SanitizeResourceUrlPipe]
})
export class SanitizePipeModule { }
