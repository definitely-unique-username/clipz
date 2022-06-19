import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipzShellRoutingModule } from './clipz-shell-routing.module';
import { ShellComponent } from './shell/shell.component';
import { ClipzAuthModule } from '@clipz/auth';
import { HeaderComponent } from './header/header.component';
import { EqualPipeModule } from '@clipz/pipes/equal';

@NgModule({
  imports: [
    CommonModule,
    ClipzShellRoutingModule,
    ClipzAuthModule,
    EqualPipeModule
  ],
  declarations: [
    ShellComponent,
    HeaderComponent
  ],
})
export class ClipzShellModule {}
