import { Component, ChangeDetectionStrategy, TrackByFunction, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clip } from '@clipz/core';
import { Sort, trackById } from '@clipz/util';
import { delay, Observable } from 'rxjs';
import { ManageStoreService } from './manage-store.service';

@Component({
  selector: 'clipz-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ManageStoreService]
})
export class ManageComponent implements OnInit {
  public readonly sort$: Observable<Sort> = this.manageStoreService.sort$.pipe(delay(0)); // cd fix
  public readonly clips$: Observable<Clip[]> = this.manageStoreService.clips$;
  public readonly activeClip$: Observable<Clip | null> = this.manageStoreService.activeClip$;
  public readonly Sort: typeof Sort = Sort;
  public readonly trackBy: TrackByFunction<Clip> = trackById;

  constructor(
    private readonly manageStoreService: ManageStoreService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.clips$.subscribe( x => console.log('>>>', x));
   }

  public ngOnInit(): void {
      this.manageStoreService.requestClips();
  }

  public onSortChange(e: Event): void {
    const sort: Sort = (e.target as HTMLSelectElement).value as Sort;
    this.router.navigate([], { relativeTo: this.route, queryParams: { sort } });
  }

  public onEdit(clip: Clip): void {
    this.manageStoreService.setActive(clip.id);
  }

  public onDelete(clip: Clip): void {
    const confirmed: boolean = confirm('Are you sure you want to delete this clip?');

    if (confirmed) {
      this.manageStoreService.deleteClip(clip.id, clip.fileName);
    }
  }

  public onModalClose(): void {
    this.manageStoreService.clearActive();
  }

  public onSubmit(newTitle: string, clip: Clip): void {
    if (newTitle !== clip.title) {
      this.manageStoreService.updateClip(clip.id, { title: newTitle });
    } else {
      this.manageStoreService.clearActive();
    }
  }
}
