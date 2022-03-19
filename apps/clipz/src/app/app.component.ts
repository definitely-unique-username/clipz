import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';

@Component({
  selector: 'clipz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly authModalVisibleSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly authModalVisible$: Observable<boolean> = this.authModalVisibleSource.asObservable().pipe(distinctUntilChanged());

  public onAuthModalOpen(): void {
    this.authModalVisibleSource.next(true);
  }

  public onAuthModalClose(): void {
    this.authModalVisibleSource.next(false);
  }
}
