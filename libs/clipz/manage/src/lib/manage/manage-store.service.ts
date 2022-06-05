import { Injectable } from '@angular/core';
import { Clip, ClipsService, ScreenshotsService, selectQueryParam } from '@clipz/core';
import { isSort, ModelStatus, Sort } from '@clipz/util';
import { ComponentStore } from '@ngrx/component-store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { EntitySelectors, UpdateStr } from '@ngrx/entity/src/models';
import { Store, select } from '@ngrx/store';
import { catchError, distinctUntilChanged, EMPTY, exhaustMap, forkJoin, map, mergeMap, Observable, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs';
import { SORT_QUERY_PARAM } from './util/sort-query-param';


export interface ManageState extends EntityState<Clip> {
  status: ModelStatus;
  sort: Sort;
  activeId: string | null;
}

const manageAdapter = createEntityAdapter({
  selectId: (clip: Clip) => clip.id,
});

const initialState: ManageState = manageAdapter.getInitialState({
  status: ModelStatus.Init,
  sort: Sort.DESC,
  activeId: null
});

const { selectAll: selectClips }: EntitySelectors<Clip, ManageState> = manageAdapter.getSelectors();

@Injectable()
export class ManageStoreService extends ComponentStore<ManageState> {
  public readonly status$: Observable<ModelStatus> = this.select((state: ManageState) => state.status);
  public readonly init$: Observable<boolean> = this.status$.pipe(map((status: ModelStatus) => status === ModelStatus.Init));
  public readonly pending$: Observable<boolean> = this.status$.pipe(map((status: ModelStatus) => status === ModelStatus.Pending));
  public readonly clips$: Observable<Clip[]> = this.select(selectClips);
  public readonly sort$: Observable<Sort> = this.select((state: ManageState) => state.sort);
  public readonly activeClip$: Observable<Clip | null> = this.select((state: ManageState) => {
    const id = state.activeId;
    return id ? state.entities[id] ?? null : null;
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  public readonly requestClips$ = this.effect((origin$: Observable<void>) =>
  origin$.pipe(
    withLatestFrom(this.sort$),
    switchMap(([, sort]: [void, Sort]) => {
      console.log('requestClips$', sort, this.get().sort);
      this.patchState((state: ManageState) => ({
        status: state.status === ModelStatus.Init ? ModelStatus.Init : ModelStatus.Pending
      }));

      return this.clipsService.getUserClips(sort);
    }),
    tap({
      next: (clips: Clip[]) => { console.log('success', clips); this.onGetUserClipsSuccess(clips); },
      error: () => { this.onGetUserClipsError(); }
    }),
    catchError(() => EMPTY)
  ));

  public readonly sortChange$ = this.effect(() =>
    this.store.pipe(
      select(selectQueryParam(SORT_QUERY_PARAM)),
      map((sort: string | undefined) => isSort(sort) ? sort : Sort.DESC),
      distinctUntilChanged(),
      tap((sort: Sort) => {
        this.patchState({ sort });
        this.requestClips$();
      })
    )
  );

  public readonly updateClip$ = this.effect((origin$: Observable<UpdateStr<Clip>>) =>
    origin$.pipe(
      exhaustMap(({ id, changes }) => {
        this.patchState({ status: ModelStatus.Pending });
        return this.clipsService.updateClip(id, changes).pipe(
          tap({
            next: (clip: Clip) => { this.onUpdateUserClipSuccess(clip); },
            error: () => { this.onUpdateUserClipError(); }
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  public readonly deleteClip$ = this.effect((origin$: Observable<{ id: string, fileName: string, screenshotName: string }>) =>
    origin$.pipe(
      mergeMap(({ id, fileName, screenshotName }) => {
        const deletedClip: Clip = this.get().entities[id] as Clip;
        this.onDeleteClip(deletedClip.id);

        return forkJoin([
          this.clipsService.deleteClip(id, fileName),
          this.screenshotsService.delete(screenshotName)
        ]).pipe(
          tap({
            error: () => { this.onDeleteClipError(deletedClip); }
          }),
          catchError(() => EMPTY)
        );
      })
    ));

  constructor(
    private readonly store: Store,
    private readonly clipsService: ClipsService,
    private readonly screenshotsService: ScreenshotsService
  ) {
    super(initialState)
    this.state$.subscribe(console.log);
  }

  public requestClips(): void {
    this.requestClips$();
  }

  public setActive(id: string): void {
    this.patchState({ activeId: id });
  }

  public clearActive(): void {
    this.patchState({ activeId: null });
  }

  public updateClip(id: string, changes: Partial<Clip>): void {
    this.updateClip$({ id, changes });
  }

  public deleteClip(id: string, fileName: string, screenshotName: string): void {
    this.deleteClip$({ id, fileName, screenshotName });
  }

  public reset(): void {
    this.setState(initialState);
  }

  private onGetUserClipsSuccess(clips: Clip[]): void {
    this.patchState((state: ManageState) => manageAdapter.setAll(clips, { ...state, status: ModelStatus.Success }));
  }

  private onGetUserClipsError(): void {
    this.patchState({ status: ModelStatus.Error });
  }

  private onUpdateUserClipSuccess(clip: Clip): void {
    this.patchState((state: ManageState) => manageAdapter.updateOne(
      { id: clip.id, changes: clip },
      { ...state, status: ModelStatus.Success, activeId: null }
    ));
  }

  private onUpdateUserClipError(): void {
    this.patchState({ status: ModelStatus.Error });
  }

  private onDeleteClip(id: string): void {
    this.patchState((state: ManageState) => manageAdapter.removeOne(id, state));
  }

  private onDeleteClipError(deletedClip: Clip): void {
    this.patchState((state: ManageState) => manageAdapter.addOne(deletedClip, state));
  }
}
