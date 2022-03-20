import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'clipz-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  @Input() public title?: string;

  private readonly activeSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly active$: Observable<boolean> = this.activeSource.asObservable();

  setActiveSate(active: boolean): void {
    this.activeSource.next(active);
  }
}
