import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'clipz-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
