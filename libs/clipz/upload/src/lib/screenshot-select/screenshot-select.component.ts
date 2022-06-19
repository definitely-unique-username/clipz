import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { emptyFn } from '@clipz/util';

@Component({
  selector: 'clipz-screenshot-select',
  templateUrl: './screenshot-select.component.html',
  styleUrls: ['./screenshot-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ScreenshotSelectComponent), multi: true }
  ],
})
export class ScreenshotSelectComponent implements ControlValueAccessor {
  @Input() public screenshoots: string[] = [];
  @Input() public disabled = false;

  @Output() public readonly selectedScreenshotChange: EventEmitter<string> = new EventEmitter();

  public selectedScreenshot: string | null = null;

  private onTouch: () => void = emptyFn;
  private onChange: (value: string | null) => void = emptyFn;

  public writeValue(screenshoot: string | null): void {
    this.selectedScreenshot = screenshoot;
  }
  public registerOnChange(fn: (screenshoot: string | null) => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onScreenshotSelect(screenshoot: string): void {
    if (!this.disabled) {
      this.selectedScreenshot = screenshoot;
      this.onChange(screenshoot);
      this.onTouch();
      this.selectedScreenshotChange.emit(screenshoot);
    }
  }
}
