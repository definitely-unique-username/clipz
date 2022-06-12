import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Clip } from '@clipz/core';

@Component({
  selector: 'clipz-clip-card',
  templateUrl: './clip-card.component.html',
  styleUrls: ['./clip-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClipCardComponent {
  @Input() public clip: Clip | null = null;
}
