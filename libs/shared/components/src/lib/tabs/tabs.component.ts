import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output, QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabSelectedDirective } from './tab-selected.directive';
import { Tab } from './tab.interface';

@Component({
  selector: 'ia-tabs',
  standalone: true,
  imports: [CommonModule, TabSelectedDirective],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements OnChanges {
  @Input({ required: true }) tabs: Tab[] = [];
  @Input({ required: true }) selectedTab: unknown;

  @Output() selected = new EventEmitter<unknown>();

  @ViewChildren('tabs') tabsElements!: QueryList<ElementRef>;

  readonly elementRef: ElementRef<Element> = inject(ElementRef);

  selectedChipIndex = 0;

  ngOnChanges(): void {
    this.selectedChipIndex = this.tabs.findIndex(({ value }) => value === this.selectedTab);
  }

  onSelectTab(tab: Tab): void {
    if (tab.value !== this.selectedTab) {
      this.selected.emit(tab.value);
    }
  }
}
