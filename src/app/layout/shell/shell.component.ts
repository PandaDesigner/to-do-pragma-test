import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { RemoteConfigService } from '../../core/config/remote-config';
import { APP_ROUTE } from '../../core/guards/categories-enabled-guard';
import { TaskStore } from '../../store/task';
import { ActionFeedback } from '../../shared/services/action-feedback';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel],
  providers: [ActionFeedback],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  readonly flags = inject(RemoteConfigService);
  readonly feedback = inject(ActionFeedback);
  readonly links = APP_ROUTE;
  private readonly tasks = inject(TaskStore);
  private readonly router = inject(Router);

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
