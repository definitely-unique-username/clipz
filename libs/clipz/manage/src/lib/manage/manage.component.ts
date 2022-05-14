import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ManageStoreService } from './manage-store.service';
import { Sort } from './utils';

@Component({
  selector: 'clipz-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageComponent {
  public readonly sort$: Observable<Sort> = this.manageStoreService.sort$;
  public readonly Sort: typeof Sort = Sort;

  constructor(
    private readonly manageStoreService: ManageStoreService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  public onSortChange(e: Event): void {
    const sort: Sort = (e.target as HTMLSelectElement).value as Sort;
    this.router.navigate([], { relativeTo: this.route, queryParams: { sort } });
  }
}
