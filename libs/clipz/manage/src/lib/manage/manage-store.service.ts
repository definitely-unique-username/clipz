import { Injectable } from '@angular/core';
import { BaseClipState, BaseClipStoreService, Clip, ClipsService, ScreenshotsService, selectQueryParam } from '@clipz/core';
import { emptyFn, isSort, ModelStatus, Sort } from '@clipz/util';
import { tapResponse } from '@ngrx/component-store';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged, exhaustMap, forkJoin, map, mergeMap, Observable, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs';
import { SORT_QUERY_PARAM } from './util/sort-query-param';


export interface ManageState extends BaseClipState {
  activeId: string | null;
}

@Injectable()
export class ManageStoreService extends BaseClipStoreService<ManageState> {
  public readonly activeClip$: Observable<Clip | null> = this.select((state: ManageState) => {
    const id = state.activeId;
    return id ? state.entities[id] ?? null : null;
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  public readonly getClips$ = this.effect((origin$: Observable<void>) =>
    origin$.pipe(
      withLatestFrom(this.sort$),
      switchMap(([, sort]: [void, Sort]) => {
        this.patchState((state: ManageState) => ({
          status: state.status === ModelStatus.Init ? ModelStatus.Init : ModelStatus.Pending
        }));

        return this.clipsService.getUserClips(sort);
      }),
      tapResponse(
        (clips: Clip[]) => { this.onGetClipsSuccess(clips); },
        () => { this.onGetClipsError(); }
      )
    ));

  public readonly sortChange$ = this.effect(() =>
    this.store.pipe(
      select(selectQueryParam(SORT_QUERY_PARAM)),
      map((sort: string | undefined) => isSort(sort) ? sort : Sort.DESC),
      distinctUntilChanged(),
      tap((sort: Sort) => {
        this.patchState({ sort });
        this.getClips$();
      })
    )
  );

  public readonly updateClip$ = this.effect((origin$: Observable<UpdateStr<Clip>>) =>
    origin$.pipe(
      exhaustMap(({ id, changes }) => {
        this.patchState({ status: ModelStatus.Pending });
        return this.clipsService.updateClip(id, changes).pipe(
          tapResponse(
            (clip: Clip) => { this.onUpdateUserClipSuccess(clip); },
            () => { this.onUpdateUserClipError(); }
          )
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
          tapResponse(
            emptyFn,
            () => { this.onDeleteClipError(deletedClip); }
          )
        );
      })
    ));

  constructor(
    private readonly store: Store,
    private readonly clipsService: ClipsService,
    private readonly screenshotsService: ScreenshotsService
  ) {
    super()
  }

  public getInitialState(): ManageState {
    return this.adapter.getInitialState({
      status: ModelStatus.Init,
      sort: Sort.DESC,
      activeId: null
    });
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
    this.setState(this.getInitialState());
  }

  protected onGetClipsSuccess(clips: Clip[]): void {
    this.patchState((state: ManageState) => ({
      ...this.adapter.addMany(clips, state),
      status: ModelStatus.Success,
    }));
  }

  private onUpdateUserClipSuccess(clip: Clip): void {
    this.patchState((state: ManageState) => this.adapter.updateOne(
      { id: clip.id, changes: clip },
      { ...state, status: ModelStatus.Success, activeId: null }
    ));
  }

  private onUpdateUserClipError(): void {
    this.patchState({ status: ModelStatus.Error });
  }

  private onDeleteClip(id: string): void {
    this.patchState((state: ManageState) => this.adapter.removeOne(id, state));
  }

  private onDeleteClipError(deletedClip: Clip): void {
    this.patchState((state: ManageState) => this.adapter.addOne(deletedClip, state));
  }
}
