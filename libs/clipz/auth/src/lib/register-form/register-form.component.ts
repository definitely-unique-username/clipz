import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterForm } from './register-form.model';

@Component({
  selector: 'clipz-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnChanges {
  @Input() public name: string | null = null;
  @Input() public email: string | null = null;
  @Input() public age: number | null = null;
  @Input() public password: string | null = null;
  @Input() public confirmPassword: string | null = null;
  @Input() public phone: string | null = null;
  @Input() public disabled: boolean = false;

  @Output() public submit: EventEmitter<RegisterForm> = new EventEmitter<RegisterForm>();

  public nameControl: FormControl = new FormControl(this.name, [Validators.required, Validators.minLength(3)]);
  public emailControl: FormControl = new FormControl(this.email, [Validators.required, Validators.email]);
  public ageControl: FormControl = new FormControl(this.age, [Validators.required, Validators.min(18)]);
  public passwordControl: FormControl = new FormControl(this.password, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/)]);
  public confirmPasswordControl: FormControl = new FormControl(this.confirmPassword, [Validators.required]);
  public phoneControl: FormControl = new FormControl(this.phone, [Validators.required, Validators.min(10), Validators.max(10)]);

  public form: FormGroup = new FormGroup({
    name: this.nameControl,
    email: this.emailControl,
    age: this.ageControl,
    password: this.passwordControl,
    confirmPassword: this.confirmPasswordControl,
    phone: this.phoneControl
  });

  public ngOnChanges(changes: SimpleChanges): void {
    const nameChange: SimpleChange = changes['name'];
    if (nameChange) {
      this.form.patchValue({ name: nameChange.currentValue }, { emitEvent: false });
    }

    const emailChange: SimpleChange = changes['email'];
    if (emailChange) {
      this.form.patchValue({ email: emailChange.currentValue }, { emitEvent: false });
    }

    const ageChange: SimpleChange = changes['age'];
    if (ageChange) {
      this.form.patchValue({ age: ageChange.currentValue }, { emitEvent: false });
    }

    const passwordChange: SimpleChange = changes['password'];
    if (passwordChange) {
      this.form.patchValue({ password: passwordChange.currentValue }, { emitEvent: false });
    }

    const confirmPasswordChange: SimpleChange = changes['confirmPassword'];
    if (confirmPasswordChange) {
      this.form.patchValue({ confirmPassword: confirmPasswordChange.currentValue }, { emitEvent: false });
    }

    const phoneChange: SimpleChange = changes['phone'];
    if (phoneChange) {
      this.form.patchValue({ phone: phoneChange.currentValue }, { emitEvent: false });
    }

    const disabpledChange: SimpleChange = changes['disabled'];
    if (disabpledChange) {
      if (disabpledChange.currentValue) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    }
  }
}
