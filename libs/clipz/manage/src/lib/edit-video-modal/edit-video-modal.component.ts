import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Clip } from '@clipz/core';
import { CoerceBoolean } from '@clipz/util';

@Component({
  selector: 'clipz-edit-video-modal',
  templateUrl: './edit-video-modal.component.html',
  styleUrls: ['./edit-video-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditVideoModalComponent implements OnChanges {
  @CoerceBoolean() @Input() public visible: boolean = false;
  @Input() public clip: Clip | null = null;

  @Output() public readonly modalClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly submitted: EventEmitter<string> = new EventEmitter<string>();

  public form: FormGroup = new FormGroup({
    title: new FormControl(this.clip?.title ?? '', [Validators.required, Validators.minLength(3)]),
  });

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['clip']) {
      this.form.patchValue({
        title: this.clip?.title ?? '',
      });
    }
  }

  public onModalClose(): void {
    this.modalClose.emit();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.value.title);
    }
  }
}
