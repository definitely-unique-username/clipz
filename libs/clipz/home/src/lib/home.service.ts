import { Injectable } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { BaseClipState, BaseClipStoreService, Clip, ClipsService } from '@clipz/core';
import { DEFAULT_PAGE_SIZE, ModelStatus, Sort } from '@clipz/util';
import { tapResponse } from '@ngrx/component-store';
import { defer, exhaustMap, Observable, of, switchMap, withLatestFrom } from 'rxjs';

interface HomeState extends BaseClipState {
  hasMore: boolean;
  size: number;
}

@Injectable()
export class HomeService extends BaseClipStoreService<HomeState> {
  public readonly hasMore$: Observable<boolean> = this.select((state: HomeState) => state.hasMore);
  public readonly size$: Observable<number> = this.select((state: HomeState) => state.size);


  protected readonly getClips$ = this.effect((page$: Observable<void>) =>
    page$.pipe(
      withLatestFrom(this.lastClip$, this.size$, this.sort$),
      exhaustMap(([, lastClip, size, sort]: [void, Clip | null, number, Sort]) => {
        this.onGetClips();

        return defer(() => {
          return lastClip
            ? this.clipsService.getSnapshot(lastClip.id)
            : of(null)
        }).pipe(
          switchMap((lastDocSnapshot: DocumentSnapshot<Clip> | null) => {
            return this.clipsService.getClips(lastDocSnapshot, size, sort);
          }),
          tapResponse(
            (clips: Clip[]) => { this.onGetClipsSuccess(clips); },
            (e: unknown) => { 
              console.error(e);
              this.onGetClipsError(); 
            }
          )
        )
      })
    )
  )

  constructor(
    private readonly clipsService: ClipsService
  ) {
    super();
  }

  protected onGetClipsSuccess(clips: Clip[]): void {
    this.patchState((state: HomeState) => ({
      ...this.adapter.addMany(clips, state),
      status: ModelStatus.Success,
      hasMore: clips.length === state.size
    }));
  }

  public getInitialState(): HomeState{
    return this.adapter.getInitialState({
      size: DEFAULT_PAGE_SIZE,
      status: ModelStatus.Init,
      sort: Sort.DESC,
      hasMore: true
    });
  }
}
