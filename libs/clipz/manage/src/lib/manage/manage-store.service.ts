import { Injectable } from '@angular/core';
import { selectQueryParam } from '@clipz/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store, select } from '@ngrx/store';
import { delay, map, shareReplay } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { isSort, Sort, SORT_QUERY_PARAM } from './utils';


export interface ManageState {
  status: any;

}

@Injectable({
  providedIn: 'root'
})
export class ManageStoreService extends ComponentStore<{}> {
  public readonly sort$: Observable<Sort> = this.store.pipe(
    select(selectQueryParam(SORT_QUERY_PARAM)),
    map((sort: string | undefined) => isSort(sort) ? sort : Sort.DESC),
    delay(0), // trigger cd
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(
    private readonly store: Store
  ) {
    super({})
  }
}
