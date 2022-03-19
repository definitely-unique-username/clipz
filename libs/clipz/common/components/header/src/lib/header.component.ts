import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'clipz-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Output() public readonly loginClick: EventEmitter<void> = new EventEmitter<void>();

  public onLoginClick(): void {
    this.loginClick.emit();
  }
}
