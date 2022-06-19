import { Component, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { Clip } from '@clipz/core';
import { trackById } from '@clipz/util';

@Component({
  selector: 'clipz-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClipsListComponent {
  @Input() public clips: Clip[] | null = [];

  public readonly trackBy: TrackByFunction<Clip> = trackById;
}
