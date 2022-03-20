import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, ChangeDetectionStrategy, ContentChildren, QueryList, TrackByFunction, Input, OnChanges, SimpleChanges, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { trackByIndex } from '@clipz/util';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'clipz-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabGroupComponent implements OnChanges, AfterContentInit {
  @Input() public selectedTabIndex: number = 0;

  @Output() public selectedTabIndexChange: EventEmitter<number> = new EventEmitter<number>();

  @ContentChildren(TabComponent) public readonly tabs: QueryList<TabComponent> = new QueryList<TabComponent>();

  public readonly trackByIndex: TrackByFunction<TabComponent> = trackByIndex;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTabIndex']) {
      this.changeSelectedTab(coerceNumberProperty(this.selectedTabIndex));
    }
  }

  public ngAfterContentInit(): void {
    this.changeSelectedTab(this.selectedTabIndex, false);
  }

  public changeSelectedTab(index: number, emit: boolean = true): void {
    this.selectedTabIndex = index;
    if (!emit) {
      this.selectedTabIndexChange.emit(this.selectedTabIndex);
    }
    const selectedTab: TabComponent = this.tabs.toArray()[index];

    this.tabs.forEach((tab: TabComponent) => {
      tab.setActiveSate(tab === selectedTab)
    });
  }
}
