import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges, ElementRef, Inject, OnInit } from '@angular/core';

let id: number = 0;

@Component({
  selector: 'clipz-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit {
  @Input() public visible: boolean | null = false;
  @Input() public closeOnBackdropClick: boolean = true;

  @Output() public readonly modalClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly backdropClick: EventEmitter<void> = new EventEmitter<void>();

  public id: string;

  constructor(private readonly elRef: ElementRef, @Inject(DOCUMENT) private readonly document: Document) {
    id++;
    this.id = `modal-${id}`;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      this.visible = coerceBooleanProperty(this.visible);
    }

    if (changes['closeOnBackdropClick']) {
      this.closeOnBackdropClick = coerceBooleanProperty(this.closeOnBackdropClick);
    }
  }

  public ngOnInit(): void {
      this.document.body.appendChild(this.elRef.nativeElement);
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
