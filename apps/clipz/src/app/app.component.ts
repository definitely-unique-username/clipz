import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'clipz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
