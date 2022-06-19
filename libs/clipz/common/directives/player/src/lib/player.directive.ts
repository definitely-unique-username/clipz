import { AfterViewInit, Directive, ElementRef, Input, OnChanges } from '@angular/core';
import videojs, { VideoJsPlayer } from 'video.js';

@Directive({
  selector: 'video[clipzPlayer]',
})
export class PlayerDirective implements OnChanges, AfterViewInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('clipzPlayer') public source: string | null = null;

  public player: VideoJsPlayer | null = null;

  constructor(
    private readonly elRef: ElementRef<Element>
  ) { }

  public ngOnChanges(): void {
    this.setSrc();
  }

  public ngAfterViewInit(): void {
    this.player = videojs(this.elRef.nativeElement);    
    this.setSrc();
  }

  private setSrc(): void {
    this.player?.src({
      src: this.source ?? '',
      type: 'video/mp4'
    });
  }
}
