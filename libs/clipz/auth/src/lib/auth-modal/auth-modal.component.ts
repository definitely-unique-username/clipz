import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { RegisterData } from '../register-form/register-data.model';
import { LoginData } from '@clipz/auth';
import { CoerceBoolean } from '@clipz/util';

@Component({
  selector: 'clipz-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthModalComponent{
  @CoerceBoolean() @Input() public visible: boolean = false;

  @Output() public readonly modalClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly register: EventEmitter<RegisterData> = new EventEmitter<RegisterData>();
  @Output() public readonly login: EventEmitter<LoginData> = new EventEmitter<LoginData>();

  public onModalClose(): void {
    this.modalClose.emit();
  }

  public onRegister(data: RegisterData): void {
    this.register.emit(data);
  }

  public onLogin(data: LoginData): void {
    this.login.emit(data);
  }
}
