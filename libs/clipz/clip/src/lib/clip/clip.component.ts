import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Clip } from '@clipz/core';
import { Observable } from 'rxjs';
import { ClipService } from '../clip.service';

@Component({
  selector: 'clipz-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClipComponent implements OnInit {
  public readonly init$: Observable<boolean> = this.clipService.init$;
  public readonly clips$: Observable<Clip[]> = this.clipService.moreClips$;
  public readonly currentClip$: Observable<Clip | null> = this.clipService.currentClip$;

  constructor(
    private readonly clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.clipService.watchId();
  }

}
