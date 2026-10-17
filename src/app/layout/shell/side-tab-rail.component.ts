import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export const RAIL_TAB = {
  TODO: 'todo',
  ROUTINE: 'routine',
  EVENT: 'event',
  MY: 'my',
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
    label: 'Todo',
    height: 185,
    disabled: false,
    fill: 'var(--app-category-1)',
  },
  {
    id: RAIL_TAB.ROUTINE,
    label: 'Routine',
    height: 126,
    disabled: false,
    fill: 'var(--app-category-2)',
  },
  {
    id: RAIL_TAB.EVENT,
    label: 'Event',
    height: 132,
    disabled: false,
    fill: 'var(--app-category-3)',
  },
  {
    id: RAIL_TAB.MY,
    label: 'My',
    height: 127,
    disabled: false,
    fill: 'var(--app-category-4)',
  },
  {
    id: RAIL_TAB.MORE,
    label: 'More',
    height: 111,
    disabled: false,
    fill: 'var(--app-category-5)',
  },
];

@Component({
  selector: 'app-side-tab-rail',
  templateUrl: './side-tab-rail.component.html',
  styleUrl: './side-tab-rail.component.scss',
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
    RAIL_TABS.filter((tab) => this.showMy() || tab.id !== RAIL_TAB.MY),
  );

  showsFillerAfter(tabId: RailTabId): boolean {
    if (this.showMy()) {
      return tabId === RAIL_TAB.MY;
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
    if (!this.sectionsEnabled() && (tab.id === RAIL_TAB.ROUTINE || tab.id === RAIL_TAB.EVENT)) {
      return true;
    }
    return false;
  }
}
