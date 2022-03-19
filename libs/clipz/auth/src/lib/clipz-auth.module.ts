import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { ModalModule } from '@clipz/components/modal';

@NgModule({
  imports: [
    CommonModule,
    ModalModule
  ],
  declarations: [
    AuthModalComponent
  ],
  exports: [AuthModalComponent]
})
export class ClipzAuthModule {}
