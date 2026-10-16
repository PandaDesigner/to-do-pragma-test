import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import {
  archiveOutline,
  createOutline,
  refreshOutline,
  calendarOutline,
  trashOutline,
} from 'ionicons/icons';
import type { Task } from '../../../domain/task';
import { TASK_EVENT, type TaskEvent } from '../../../domain/task-state';

const ACTION_LABEL: Record<TaskEvent, string> = {
  COMPLETE: 'Completar',
  EXPIRE: 'Vencer',
  ARCHIVE: 'Archivar',
  REOPEN: 'Reabrir',
  RESCHEDULE: 'Reprogramar para hoy',
  RESTORE: 'Restaurar',
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
  imports: [IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly actions = input<readonly TaskEvent[]>([]);
  readonly categoryName = input<string>();
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
