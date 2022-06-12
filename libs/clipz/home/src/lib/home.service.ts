import { Injectable } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { Clip, ClipsService } from '@clipz/core';
import { DEFAULT_PAGE_SIZE, ModelStatus, Sort } from '@clipz/util';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { defer, exhaustMap, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';

interface HomeState extends EntityState<Clip> {
  sort: Sort.DESC;
  size: number;
  status: ModelStatus;
  hasMore: boolean;
}

function selectId(clip: Clip): string {
  return clip.id;
}

const adapter: EntityAdapter<Clip> = createEntityAdapter({
  selectId
});

const initialState: HomeState = adapter.getInitialState({
  size: DEFAULT_PAGE_SIZE,
  status: ModelStatus.Init,
  sort: Sort.DESC,
  hasMore: true
});

const {
  selectAll: getClips
}: EntitySelectors<Clip, HomeState> = adapter.getSelectors();

@Injectable()
export class HomeService extends ComponentStore<HomeState> {
  public readonly init$: Observable<boolean> = this.select((state: HomeState) => state.status === ModelStatus.Init);
  public readonly pending$: Observable<boolean> = this.select((state: HomeState) => state.status === ModelStatus.Pending);
  public readonly clips$: Observable<Clip[]> = this.select(getClips);
  public readonly lastClip$: Observable<Clip | null> = this.clips$.pipe(map((clips: Clip[]) => clips[clips.length - 1] ?? null));
  public readonly size$: Observable<number> = this.select((state: HomeState) => state.size);
  public readonly sort$: Observable<Sort> = this.select((state: HomeState) => state.sort);
  public readonly hasMore$: Observable<boolean> = this.select((state: HomeState) => state.hasMore);

  private readonly getClips$ = this.effect((page$: Observable<void>) =>
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
    super(initialState);
    this.state$.subscribe(console.log);
  }

  public getClips(): void {
    this.getClips$();
  }

  private onGetClips(): void {
    this.patchState((state: HomeState) => ({
      status: state.status === ModelStatus.Init ? ModelStatus.Init : ModelStatus.Pending
    }));
  }

  private onGetClipsSuccess(clips: Clip[]): void {
    this.patchState((state: HomeState) => ({
      ...adapter.addMany(clips, state),
      status: ModelStatus.Success,
      hasMore: clips.length === state.size
    }));
  }

  private onGetClipsError(): void {
    this.patchState((state: HomeState) => ({
      status: ModelStatus.Error
    }));
  }
}
