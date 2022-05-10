import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailTakenValidator implements AsyncValidator {
  public readonly validate: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return this.authService.emailTaken(control.value).pipe(
      map((taken: boolean) => taken ? { emailTaken: true } : null)
    )
  }

  constructor(
    protected readonly authService: AuthService
  ) { 
  }
}
