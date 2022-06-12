import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Clip } from '@clipz/core';
import { Observable } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'clipz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
  public readonly clips$: Observable<Clip[]> = this.homeService.clips$;
  public readonly init$: Observable<boolean> = this.homeService.init$;
  public readonly pending$: Observable<boolean> = this.homeService.pending$;
  public readonly hasMore$: Observable<boolean> = this.homeService.hasMore$;
  
  constructor(private readonly homeService: HomeService) {}

  public ngOnInit(): void {
  }

  public onGetClips(): void {
    this.homeService.getClips();
  }
}
