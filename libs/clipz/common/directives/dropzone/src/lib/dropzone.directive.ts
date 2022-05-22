import { Directive, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { emptyFn } from '@clipz/util';

@Directive({
  selector: '[clipzDropzone]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropzoneDirective),
      multi: true
    }
  ]
})
export class DropzoneDirective implements ControlValueAccessor {
  @Input('clipzDropzone') public dragClass: string | null = null;

  @Output() public dropped: EventEmitter<File | null> = new EventEmitter<File | null>();

  private onTouch: () => void = emptyFn;
  private onChange: (value: File | null) => void = emptyFn;

  @HostBinding('class.disabled')
  private disabled: boolean = false;

  private file: File | null = null;

  constructor(
    private readonly renderer: Renderer2,
    private readonly elRef: ElementRef<Element>,
  ) { }

  @HostListener('dragenter', ['$event'])
  @HostListener('dragover', ['$event'])
  public onDragEnter(event: Event): void {
    event.preventDefault();
    if (!this.disabled) {
      this.addClasses();
    }
  }

  @HostListener('dragleave')
  @HostListener('dragend')
  @HostListener('mouseleave')
  public onDragLeave(): void {
    this.removeClasses();
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent): void {
    event.preventDefault();

    if (!this.disabled) {
      const file: File | null = event.dataTransfer?.files.item(0) ?? null;
      this.file = file;
      this.onChange(this.file);
      this.onTouch();
      this.dropped.emit(this.file);
    }

    this.removeClasses();
  }

  public writeValue(value: File | null): void {
    this.file = value;
  }

  public registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private parseClassList(classList: string | null): string[] {
    return (classList ?? '').split(' ');
  }

  private handleClasses(classList: string | null, cb: (className: string) => void): void {
    this.parseClassList(classList).forEach(cb);
  }

  private addClasses(): void {
    this.handleClasses(this.dragClass, (className: string) => {
      this.renderer.addClass(
        this.elRef.nativeElement,
        className
      );
    });
  }

  private removeClasses(): void {
    this.handleClasses(this.dragClass, (className: string) => {
      this.renderer.removeClass(
        this.elRef.nativeElement,
        className
      );
    });
  }
}
