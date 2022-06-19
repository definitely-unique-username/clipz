import { Component, ChangeDetectionStrategy, Output, Input, EventEmitter } from '@angular/core';
import { Clip } from '@clipz/core';

@Component({
  selector: 'clipz-edit-clip-card',
  templateUrl: './edit-clip-card.component.html',
  styleUrls: ['./edit-clip-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditClipCardComponent {
  @Input() public clip: Clip | null = null;

  @Output() public edit: EventEmitter<void> = new EventEmitter<void>();
  @Output() public delete: EventEmitter<void> = new EventEmitter<void>();
  @Output() public linkCopy: EventEmitter<void> = new EventEmitter<void>();

  public onEdit(): void {
    this.edit.emit();
  }

  public onDelete(): void {
    this.delete.emit();
  }

  public onCopy(): void {
    this.linkCopy.emit();
  }
}
