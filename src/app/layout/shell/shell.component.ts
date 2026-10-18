import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { RemoteConfigService } from '../../core/config/remote-config';
import { APP_ROUTE } from '../../core/guards/categories-enabled-guard';
import { TaskStore } from '../../store/task';
import { CategoryStore } from '../../store/category';
import { ActionFeedback } from '../../shared/services/action-feedback';
import { CategorySheetComponent } from '../../shared/components/category-sheet/category-sheet.component';
import type { Category } from '../../domain/category';
import {
  RAIL_TAB,
  SideTabRailComponent,
  type RailTabId,
} from './side-tab-rail.component';

const TAB_ROUTE: Partial<Record<RailTabId, string>> = {
  [RAIL_TAB.TODO]: APP_ROUTE.TASKS,
  [RAIL_TAB.ROUTINE]: APP_ROUTE.ROUTINE,
  [RAIL_TAB.EVENT]: APP_ROUTE.EVENT,
  [RAIL_TAB.CATEGORY]: APP_ROUTE.CATEGORIES,
  [RAIL_TAB.MORE]: APP_ROUTE.SETTINGS,
};

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  imports: [IonRouterOutlet, SideTabRailComponent, CategorySheetComponent],
  providers: [ActionFeedback],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  readonly flags = inject(RemoteConfigService);
  readonly feedback = inject(ActionFeedback);
  private readonly toasts = inject(ToastController);
  private readonly translate = inject(TranslateService);
  private readonly tasks = inject(TaskStore);
  private readonly categories = inject(CategoryStore);
  private readonly router = inject(Router);

  async onCategorySave(draft: Category): Promise<void> {
    await this.feedback.run(async () => {
      if (!this.flags.categoriesEnabled()) {
        throw new Error('Las categorías están deshabilitadas.');
      }
      const id = draft.id || globalThis.crypto.randomUUID();
      await this.categories.upsert({ ...draft, id });
    });
  }

  async onCategoryDelete(id: string): Promise<void> {
    await this.feedback.run(async () => {
      if (!this.flags.categoriesEnabled()) {
        throw new Error('Las categorías están deshabilitadas.');
      }
      await this.categories.remove(id);
    });
  }

  activeTab(): RailTabId {
    if (this.router.url.startsWith(APP_ROUTE.ROUTINE)) {
      return RAIL_TAB.ROUTINE;
    }
    if (this.router.url.startsWith(APP_ROUTE.EVENT)) {
      return RAIL_TAB.EVENT;
    }
    if (this.router.url.startsWith(APP_ROUTE.CATEGORIES)) {
      return RAIL_TAB.CATEGORY;
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
      const remoteFailure = this.flags.error();
      const actionFailure = this.feedback.error();
      if (remoteFailure) {
        void this.presentRemoteError();
        return;
      }
      if (actionFailure) {
        void this.presentActionError(actionFailure);
      }
    });
    effect(() => {
      if (!this.flags.categoriesEnabled()) {
        this.tasks.setCategory(undefined);
        if (
          this.router.url.startsWith(APP_ROUTE.CATEGORIES) ||
          this.router.url.startsWith(APP_ROUTE.ROUTINE) ||
          this.router.url.startsWith(APP_ROUTE.EVENT)
        ) {
          void this.feedback.run(async () => {
            await this.router.navigateByUrl(APP_ROUTE.TASKS);
          });
        }
      }
    });
  }

  private async presentRemoteError(): Promise<void> {
    const toast = await this.toasts.create({
      header: this.translate.instant('remoteConfig.error.title'),
      message: this.translate.instant('remoteConfig.error.message'),
      duration: 4000,
      position: 'top',
      buttons: [
        {
          text: this.translate.instant('shell.retry'),
          handler: () => {
            void this.flags.initialize();
          },
        },
        {
          text: this.translate.instant('remoteConfig.error.dismiss'),
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  private async presentActionError(message: string): Promise<void> {
    const toast = await this.toasts.create({
      message,
      duration: 4000,
      position: 'top',
      buttons: [
        {
          text: this.translate.instant('remoteConfig.error.dismiss'),
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
