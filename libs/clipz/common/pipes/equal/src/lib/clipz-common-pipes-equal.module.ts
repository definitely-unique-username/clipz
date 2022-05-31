import { NgModule } from '@angular/core';
import { EqualPipe } from './equal.pipe';

@NgModule({
  declarations: [EqualPipe],
  exports: [EqualPipe]
})
export class EqualPipeModule { }
