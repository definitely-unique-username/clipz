import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginData } from './login-data.model';

@Component({
  selector: 'clipz-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  public readonly form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  @Output() public login: EventEmitter<LoginData> = new EventEmitter<LoginData>();


  public onSubmit(): void {
    if (this.form.valid) {
      this.login.emit(this.form.value);
    }
  }
}
