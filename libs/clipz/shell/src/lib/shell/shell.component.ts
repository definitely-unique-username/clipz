import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Data, Router } from '@angular/router';
import { RegisterData, LoginData } from '@clipz/auth';
import { AuthService } from '@clipz/core';
import { getData } from '@clipz/util';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { map } from 'rxjs/operators'

@Component({
  selector: 'clipz-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  private readonly authModalVisibleSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly authModalVisible$: Observable<boolean> = this.authModalVisibleSource.asObservable().pipe(distinctUntilChanged());

  public readonly auth$: Observable<boolean> = this.authService.auth$;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
  }

  public onAuthModalOpen(): void {
    this.authModalVisibleSource.next(true);
  }

  public onAuthModalClose(): void {
    this.authModalVisibleSource.next(false);
  }

  public onRegister({ email, password, age, name, phone }: RegisterData): void {
    this.authService.createUser({ age, email, name, phoneNumber: phone }, password).subscribe({
      next: () => this.onAuthModalClose(),
      error: () => alert('Error')
    });
  }

  public onLogin({ email, password }: LoginData): void {
    this.authService.login(email, password).subscribe({
      next: () => this.onAuthModalClose(),
      error: () => alert('Error')
    })
  }

  public onLogout(): void {
    this.authService.logout().pipe(
      map(() => getData(this.router.routerState))
    ).subscribe({
      next: (data: Data) => {
        if (data['authOnly']) {
          this.router.navigate(['/']);
        }
      },
      error: () => alert('Error')
    });
  }

}
