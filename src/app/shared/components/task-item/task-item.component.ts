import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  archiveOutline,
  createOutline,
  refreshOutline,
  calendarOutline,
  trashOutline,
} from 'ionicons/icons';
import type { Task } from '../../../domain/task';
import { TASK_EVENT, type TaskEvent } from '../../../domain/task-state';
import { resolveCategoryIcon, pickValue } from '../../../domain/category-icons';

function mapColorTokenToIndex(token: string): number {
  return pickValue(
    token,
    {
      routine: 2,
      event: 3,
      my: 4,
      primary: 'filler' as unknown as number,
      todo: 'filler' as unknown as number,
      filler: 'filler' as unknown as number,
    } as const,
    5,
  );
}

const ACTION_LABEL: Record<TaskEvent, string> = {
  COMPLETE: 'task.actions.COMPLETE',
  EXPIRE: 'task.actions.EXPIRE',
  ARCHIVE: 'task.actions.ARCHIVE',
  REOPEN: 'task.actions.REOPEN',
  RESCHEDULE: 'task.actions.RESCHEDULE',
  RESTORE: 'task.actions.RESTORE',
};
const ACTION_ICON: Record<TaskEvent, string> = {
  COMPLETE: refreshOutline,
  EXPIRE: calendarOutline,
  ARCHIVE: archiveOutline,
  REOPEN: refreshOutline,
  RESCHEDULE: calendarOutline,
  RESTORE: refreshOutline,
};

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  imports: [
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  private readonly translate = inject(TranslateService);
  readonly task = input.required<Task>();
  readonly variant = input<'task' | 'note'>('task');
  readonly actions = input<readonly TaskEvent[]>([]);
  readonly categoryName = input<string>();
  readonly categoryIcon = input<string>();
  readonly categoryColorToken = input<string>();
  readonly resolvedCategoryIcon = computed(() => {
    const key = this.categoryIcon();
    if (!key) {
      return null;
    }
    return resolveCategoryIcon(key);
  });
  readonly resolvedCategoryColor = computed(() => {
    const token = this.categoryColorToken();
    if (!token) {
      return null;
    }
    return `var(--app-category-${mapColorTokenToIndex(token)})`;
  });
  readonly metaTitle = computed(() => {
    const parts: string[] = [];
    const task = this.task();
    if (task.durationMin) {
      parts.push(
        this.translate.instant('task.duration', { minutes: task.durationMin }),
      );
    }
    if (task.reminderMin) {
      parts.push(
        this.translate.instant('task.reminder', { minutes: task.reminderMin }),
      );
    }
    return parts.join(' · ');
  });
  readonly showCategories = input(true);
  readonly disabled = input(false);
  readonly taskToggle = output<string>();
  readonly edit = output<Task>();
  readonly remove = output<string>();
  readonly action = output<{ id: string; event: TaskEvent }>();
  readonly events = TASK_EVENT;
  readonly labels = ACTION_LABEL;
  readonly icons = { createOutline, trashOutline };
  readonly actionIcons = ACTION_ICON;
  readonly canToggle = computed(
    () =>
      this.actions().includes(TASK_EVENT.COMPLETE) ||
      this.actions().includes(TASK_EVENT.REOPEN),
  );
  readonly extraActions = computed(() =>
    this.actions().filter(
      (event) => event !== TASK_EVENT.COMPLETE && event !== TASK_EVENT.REOPEN,
    ),
  );
}
