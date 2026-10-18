import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
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
import { type TaskEvent } from '../../../domain/task-state';
import { resolveCategoryIcon, pickValue } from '../../../domain/category-icons';
import { TaskItemActionsComponent } from './task-item-actions.component';
import { TaskItemCopyComponent } from './task-item-copy.component';
import { TaskItemLeadingComponent } from './task-item-leading.component';
import {
  noteRowState,
  TASK_ITEM,
  taskRowState,
  type TaskItemContext,
  type TaskItemState,
} from './task-item.state';

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
    TaskItemLeadingComponent,
    TaskItemCopyComponent,
    TaskItemActionsComponent,
  ],
  providers: [
    { provide: TASK_ITEM, useExisting: forwardRef(() => TaskItemComponent) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent implements TaskItemContext {
  private readonly translate = inject(TranslateService);
  readonly task = input.required<Task>();
  readonly variant = input<'task' | 'note'>('task');
  readonly state = input<TaskItemState | null>(null);
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
  readonly presentation = computed(
    () =>
      this.state() ?? (this.variant() === 'note' ? noteRowState : taskRowState),
  );
  readonly taskToggle = output<string>();
  readonly edit = output<Task>();
  readonly remove = output<string>();
  readonly action = output<{ id: string; event: TaskEvent }>();
  readonly labels = ACTION_LABEL;
  readonly icons = { createOutline, trashOutline };
  readonly actionIcons = ACTION_ICON;
  readonly canToggle = computed(() =>
    this.presentation()
      .toggleEvents()
      .some((event) => this.actions().includes(event)),
  );
  readonly extraActions = computed(() => {
    if (!this.presentation().showsExtraActions()) {
      return [];
    }
    const toggle = new Set(this.presentation().toggleEvents());
    return this.actions().filter((event) => !toggle.has(event));
  });

  emitToggle(id: string): void {
    this.taskToggle.emit(id);
  }

  emitEdit(task: Task): void {
    this.edit.emit(task);
  }

  emitRemove(id: string): void {
    this.remove.emit(id);
  }

  emitAction(event: TaskEvent): void {
    this.action.emit({ id: this.task().id, event });
  }
}
