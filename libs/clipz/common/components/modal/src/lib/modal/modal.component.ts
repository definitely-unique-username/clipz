import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'clipz-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  @Input() public visible: boolean | null = false;
  @Input() public closeOnBackdropClick: boolean = true;

  @Output() public readonly modalClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly backdropClick: EventEmitter<void> = new EventEmitter<void>();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      this.visible = coerceBooleanProperty(this.visible);
    }

    if (changes['closeOnBackdropClick']) {
      this.closeOnBackdropClick = coerceBooleanProperty(this.closeOnBackdropClick);
    }
  }

  public onClose(): void {
    this.modalClose.emit();
    this.visible = false;
  }

  public onBackdropClick(): void {
    this.backdropClick.emit();

    if (this.closeOnBackdropClick) {
      this.onClose();
    }
  }
}
