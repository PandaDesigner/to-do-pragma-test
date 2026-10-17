import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { RemoteConfigService } from '../../core/config/remote-config';
import { APP_ROUTE } from '../../core/guards/categories-enabled-guard';
import { TaskStore } from '../../store/task';
import { ActionFeedback } from '../../shared/services/action-feedback';
import {
  RAIL_TAB,
  SideTabRailComponent,
  type RailTabId,
} from './side-tab-rail.component';

const TAB_ROUTE: Partial<Record<RailTabId, string>> = {
  [RAIL_TAB.TODO]: APP_ROUTE.TASKS,
  [RAIL_TAB.MY]: APP_ROUTE.CATEGORIES,
  [RAIL_TAB.MORE]: APP_ROUTE.SETTINGS,
};

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  imports: [IonRouterOutlet, SideTabRailComponent],
  providers: [ActionFeedback],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  readonly flags = inject(RemoteConfigService);
  readonly feedback = inject(ActionFeedback);
  private readonly tasks = inject(TaskStore);
  private readonly router = inject(Router);

  activeTab(): RailTabId {
    if (this.router.url.startsWith(APP_ROUTE.CATEGORIES)) {
      return RAIL_TAB.MY;
    }
    if (this.router.url.startsWith(APP_ROUTE.SETTINGS)) {
      return RAIL_TAB.MORE;
    }
    return RAIL_TAB.TODO;
  }

  openTab(tabId: RailTabId): void {
    const route = TAB_ROUTE[tabId];
    if (!route) {
      return;
    }
    void this.router.navigateByUrl(route);
  }

  constructor() {
    effect(() => {
      if (!this.flags.categoriesEnabled()) {
        this.tasks.setCategory(undefined);
        if (this.router.url.startsWith(APP_ROUTE.CATEGORIES)) {
          void this.feedback.run(async () => {
            await this.router.navigateByUrl(APP_ROUTE.TASKS);
          });
        }
      }
    });
  }
}
