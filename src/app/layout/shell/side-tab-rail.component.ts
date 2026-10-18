import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export const RAIL_TAB = {
  TODO: 'todo',
  ROUTINE: 'routine',
  EVENT: 'event',
  CATEGORY: 'category',
  MORE: 'more',
} as const;

export type RailTabId = (typeof RAIL_TAB)[keyof typeof RAIL_TAB];

type RailTab = {
  id: RailTabId;
  label: string;
  height: number;
  disabled: boolean;
  fill: string;
};

const RAIL_FILLER_HEIGHT = 131;

export const RAIL_TABS: readonly RailTab[] = [
  {
    id: RAIL_TAB.TODO,
    label: 'rail.todo',
    height: 185,
    disabled: false,
    fill: 'var(--app-category-1)',
  },
  {
    id: RAIL_TAB.ROUTINE,
    label: 'rail.routine',
    height: 126,
    disabled: false,
    fill: 'var(--app-category-2)',
  },
  {
    id: RAIL_TAB.EVENT,
    label: 'rail.event',
    height: 132,
    disabled: false,
    fill: 'var(--app-category-3)',
  },
  {
    id: RAIL_TAB.CATEGORY,
    label: 'rail.category',
    height: 127,
    disabled: false,
    fill: 'var(--app-category-4)',
  },
  {
    id: RAIL_TAB.MORE,
    label: 'rail.more',
    height: 111,
    disabled: false,
    fill: 'var(--app-category-5)',
  },
];

@Component({
  selector: 'app-side-tab-rail',
  templateUrl: './side-tab-rail.component.html',
  styleUrl: './side-tab-rail.component.scss',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideTabRailComponent {
  readonly active = input<RailTabId>(RAIL_TAB.TODO);
  readonly showMy = input(true);
  readonly sectionsEnabled = input(true);
  readonly selected = output<RailTabId>();
  readonly tabs = RAIL_TABS;
  readonly fillerHeight = RAIL_FILLER_HEIGHT;
  readonly visibleTabs = computed(() =>
    RAIL_TABS.filter((tab) => this.showMy() || tab.id !== RAIL_TAB.CATEGORY),
  );

  showsFillerAfter(tabId: RailTabId): boolean {
    if (this.showMy()) {
      return tabId === RAIL_TAB.CATEGORY;
    }
    return tabId === RAIL_TAB.EVENT;
  }

  choose(tab: RailTab): void {
    if (this.isDisabled(tab)) {
      return;
    }
    this.selected.emit(tab.id);
  }

  isDisabled(tab: RailTab): boolean {
    if (tab.disabled) {
      return true;
    }
    if (
      !this.sectionsEnabled() &&
      (tab.id === RAIL_TAB.ROUTINE || tab.id === RAIL_TAB.EVENT)
    ) {
      return true;
    }
    return false;
  }
}
