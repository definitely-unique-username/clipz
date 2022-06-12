import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[intersaction]'
})
export class IntersactionObserverDirective implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  @Output() public intersaction: EventEmitter<void> = new EventEmitter<void>();

  constructor(private elRef: ElementRef) { }

  public ngOnInit(): void {
    this.connect();
  }

  public ngOnDestroy(): void {
    this.disconnect();
  }

  public connect(): void {
    this.observer = new IntersectionObserver(this.intersect.bind(this));
    this.observer.observe(this.elRef.nativeElement);
  }

  public disconnect(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private intersect(entries: IntersectionObserverEntry[]) {
    const entry: IntersectionObserverEntry = entries[entries.length - 1];
    if (entry.isIntersecting) {
      this.intersaction.emit();
    }
  }
}
