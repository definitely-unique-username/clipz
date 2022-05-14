import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'clipz-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
