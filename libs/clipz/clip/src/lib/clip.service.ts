import { Injectable } from '@angular/core';
import { BaseClipState, BaseClipStoreService, Clip, ClipsService, selectRouteParam } from '@clipz/core';
import { ModelStatus, Sort } from '@clipz/util';
import { tapResponse } from '@ngrx/component-store';
import { select, Store } from '@ngrx/store';
import { filter, forkJoin, map, shareReplay, Subject, switchMap, switchMapTo, takeUntil, tap } from 'rxjs';
import { Observable, withLatestFrom } from 'rxjs';

export interface ClipState extends BaseClipState {
  id: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ClipService extends BaseClipStoreService<ClipState> {
  private readonly resetSource: Subject<void> = new Subject<void>();
  protected readonly reset$: Observable<void> = this.resetSource.asObservable();
  public readonly id$: Observable<string | null> = this.select((state: ClipState) => state.id);
  public readonly currentClip$: Observable<Clip | null> = this.select(({ id, entities }: ClipState) => {
    const clip: Clip | undefined = entities[id as string];
    return clip ?? null;
  });
  public moreClips$: Observable<Clip[]> = this.select(
    this.clips$,
    this.id$,
    (clips: Clip[], id: string | null) => {
      const moreClips: Clip[] = clips.filter((c: Clip) => c.id !== id);
      if (moreClips.length > 3) {
        moreClips.length = 3;
      }

      return moreClips;
    }).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  private readonly watchId$ = this.effect((origin$: Observable<void>) =>
    origin$.pipe(
      switchMapTo(this.store.pipe(
        select(selectRouteParam('clipId')),
        filter(Boolean),
        takeUntil(this.reset$)
      )),
      tap((id: string) => {
        this.setId(id);
        setTimeout(() => {
          this.getClips$();
        });
      })
    )
  )

  protected readonly getClips$ = this.effect((origin$: Observable<void>) =>
    origin$.pipe(
      withLatestFrom(this.id$.pipe(filter(Boolean)), this.sort$),
      switchMap(([, clipId, sort]: [void, string, Sort]) => {
        this.onGetClips();

        return forkJoin([
          this.clipsService.getClip(clipId),
          this.clipsService.getClips(null, 4, sort)
        ]).pipe(
          map(([clip, clips]: [Clip | null, Clip[]]) => {
            return clip ? [...clips, clip] : clips
          })
        )
      }
      ),
      tapResponse(
        (clips: Clip[]) => { this.onGetClipsSuccess(clips) },
        (e: unknown) => {
          console.error(e);
          this.onGetClipsError();
        }
      )
    )
  );

  constructor(
    private readonly clipsService: ClipsService,
    private readonly store: Store
  ) {
    super()
  }

  protected onGetClipsSuccess(clips: Clip[]): void {
    this.setState((state: ClipState) => {
      return {
        ...this.adapter.setAll(clips, state),
        status: ModelStatus.Success
      }
    });
  }

  public watchId(): void {
    this.watchId$();
  }

  public reset(): void {
    this.resetSource.next();
    this.setState(this.getInitialState());
  }

  public getInitialState(): ClipState {
    return this.adapter.getInitialState({
      sort: Sort.DESC,
      status: ModelStatus.Init,
      id: null
    });
  }

  private setId(id: string): void {
    this.patchState({ id });
  }
}
