import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'clipz-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
