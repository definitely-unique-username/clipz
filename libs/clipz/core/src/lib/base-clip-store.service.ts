import { ModelStatus, Sort } from "@clipz/util";
import { ComponentStore } from "@ngrx/component-store";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { EntitySelectors } from "@ngrx/entity/src/models";
import { map, Observable } from 'rxjs';
import { Clip } from "./util";

export interface BaseClipState extends EntityState<Clip> {
    sort: Sort;
    status: ModelStatus;
}

export abstract class BaseClipStoreService<T extends BaseClipState> extends ComponentStore<T> {
    public readonly adapter: EntityAdapter<Clip> = createEntityAdapter({
        selectId: this.selectId
    });
    public readonly init$: Observable<boolean> = this.select((state: T) => state.status === ModelStatus.Init);
    public readonly pending$: Observable<boolean> = this.select((state: T) => state.status === ModelStatus.Pending);
    public readonly clips$: Observable<Clip[]> = this.select(this.getSelectors().selectAll);
    public readonly lastClip$: Observable<Clip | null> = this.clips$.pipe(map((clips: Clip[]) => clips[clips.length - 1] ?? null));
    public readonly sort$: Observable<Sort> = this.select((state: T) => state.sort);

    public abstract getInitialState(): T;

    public selectId(clip: Clip): string {
        return clip.id;
    }

    public getSelectors(): EntitySelectors<Clip, T> {
        return this.adapter.getSelectors();
    }

    protected constructor() {
        super()
        this.setInitialState();
    }

    protected abstract getClips$(): void;
    protected abstract onGetClipsSuccess(clips: Clip[]): void;

    private setInitialState(): void {
        this.setState(this.getInitialState());
    }

    public getClips(): void {
        this.getClips$();
    }

    protected onGetClips(): void {
        this.patchState((state: T) => ({
            ...state,
            status: state.status === ModelStatus.Init ? ModelStatus.Init : ModelStatus.Pending
        }));
    }

    protected onGetClipsError(): void {
        this.patchState((state: T) => ({
            ...state,
            status: ModelStatus.Error
        }));
    }

}