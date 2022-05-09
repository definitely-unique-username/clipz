import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { CoerceBoolean } from '@clipz/util';

@Component({
  selector: 'clipz-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @CoerceBoolean()
  @Input() public auth: boolean | null = false;

  @Output() public readonly login: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly logout: EventEmitter<void> = new EventEmitter<void>();

  public onLogin(): void {
    this.login.emit();
  }

  public onLogout(): void {
    this.logout.emit();
  }
}
