import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'clipz-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthModalComponent implements OnChanges {
  @Input() public visible: boolean | null = false;

  @Output() public readonly modalClose: EventEmitter<void> = new EventEmitter<void>();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      this.visible = coerceBooleanProperty(this.visible);
    }
  }

  public onModalClose(): void {
    this.modalClose.emit();
  }
}
