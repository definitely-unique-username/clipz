import { NgModule } from '@angular/core';
import { ShellComponent } from './shell/shell.component';
import { ClipzVideoFeatureShellRoutingModule } from './clipz-video-feature-shell-routing.module';

@NgModule({
  imports: [ClipzVideoFeatureShellRoutingModule],
  declarations: [ShellComponent]
})
export class ClipzVideoFeatureShellModule { }
