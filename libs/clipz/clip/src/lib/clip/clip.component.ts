import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'clipz-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClipComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
