import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginData, RegisterData } from '@clipz/auth';
import { AuthService } from '@clipz/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';

@Component({
  selector: 'clipz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly authModalVisibleSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly authModalVisible$: Observable<boolean> = this.authModalVisibleSource.asObservable().pipe(distinctUntilChanged());
  
  public readonly auth$: Observable<boolean> = this.authService.auth$;

  constructor(
    private readonly authService: AuthService
  ) {
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
    this.authService.logout().subscribe({
      error: () => alert('Error')
    })
  }
}
