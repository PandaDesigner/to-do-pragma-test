import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { createOutline } from 'ionicons/icons';
import { resolveCategoryIcon } from '../../domain/category-icons';
import { RemoteConfigService } from '../../core/config/remote-config';
import { type Category } from '../../domain/category';
import { CategoryStore } from '../../store/category';
import { TaskStore } from '../../store/task';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ActionFeedback } from '../../shared/services/action-feedback';

const VIRTUAL_SCROLL_THRESHOLD = 200;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.scss',
  imports: [
    IonContent,
    IonIcon,
    FabButtonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ScrollingModule,
    NgTemplateOutlet,
  ],
  providers: [ActionFeedback],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit {
  readonly store = inject(CategoryStore);
  readonly tasks = inject(TaskStore);
  readonly flags = inject(RemoteConfigService);
  readonly feedback = inject(ActionFeedback);
  readonly icons = { createOutline };
  readonly shouldVirtualize = computed(
    () => this.store.categories().length >= VIRTUAL_SCROLL_THRESHOLD,
  );
  readonly taskCounts = computed(() => {
    const counts = new Map<string | null, number>();
    for (const task of this.tasks.tasks()) {
      counts.set(task.categoryId, (counts.get(task.categoryId) ?? 0) + 1);
    }
    return counts;
  });
  readonly trackById = (_index: number, category: Category): string =>
    category.id;

  ngOnInit(): void {
    void this.feedback.run(async () => {
      await Promise.all([this.store.refresh(), this.tasks.refresh()]);
    });
  }

  openCreateSheet(): void {
    this.store.openCategorySheet({ mode: 'create' });
  }

  openEditSheet(category: Category): void {
    this.store.openCategorySheet({ mode: 'edit', draft: category });
  }

  iconFor(category: Category): string {
    return resolveCategoryIcon(category.icon);
  }

  async retry(): Promise<void> {
    await this.feedback.run(() => this.store.retry());
  }
}
