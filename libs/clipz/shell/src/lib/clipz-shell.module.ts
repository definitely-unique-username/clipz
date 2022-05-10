import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipzShellRoutingModule } from './clipz-shell-routing.module';
import { ShellComponent } from './shell/shell.component';
import { ClipzAuthModule } from '@clipz/auth';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule,
    ClipzShellRoutingModule,
    ClipzAuthModule,
  ],
  declarations: [
    ShellComponent,
    HeaderComponent
  ],
})
export class ClipzShellModule {}
