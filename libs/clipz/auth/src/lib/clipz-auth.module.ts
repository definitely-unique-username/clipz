import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { ClipzModalModule } from '@clipz/components/modal';
import { ClipzTabsModule } from '@clipz/components/tabs';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  imports: [
    CommonModule,
    ClipzModalModule,
    ClipzTabsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    AuthModalComponent,
    LoginFormComponent,
    RegisterFormComponent
  ],
  exports: [AuthModalComponent, LoginFormComponent, RegisterFormComponent]
})
export class ClipzAuthModule { }
