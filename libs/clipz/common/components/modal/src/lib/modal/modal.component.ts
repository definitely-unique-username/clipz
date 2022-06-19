import { DOCUMENT } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges, ElementRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { CoerceBoolean } from '@clipz/util';

let id = 0;

@Component({
  selector: 'clipz-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit, OnDestroy {
  @CoerceBoolean() @Input() public visible: boolean | null = false;
  @CoerceBoolean() @Input() public closeOnBackdropClick = true;

  @Output() public readonly modalClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly backdropClick: EventEmitter<void> = new EventEmitter<void>();

  public id: string;

  constructor(private readonly elRef: ElementRef, @Inject(DOCUMENT) private readonly document: Document) {
    id++;
    this.id = `modal-${id}`;
  }

  public ngOnInit(): void {
      this.document.body.appendChild(this.elRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.document.body.removeChild(this.elRef.nativeElement);
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
