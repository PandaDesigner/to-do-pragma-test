import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonContent } from '@ionic/angular/standalone';
import { CLOCK, CREATE_ID } from '../../core/di/tokens';
import { RemoteConfigService } from '../../core/config/remote-config';
import { LogAction } from '../../core/decorators/log-action';
import {
  TASK_STATUS,
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from '../../domain/task';
import { TASK_EVENT, type TaskEvent } from '../../domain/task-state';
import { TaskStore } from '../../store/task';
import { CategoryStore } from '../../store/category';
import { TaskItemComponent } from '../../shared/components/task-item/task-item.component';
import { ActionFeedback } from '../../shared/services/action-feedback';
import { DeletionConfirmation } from '../../shared/services/deletion-confirmation';

const VIRTUAL_SCROLL_THRESHOLD = 200;
const DEBUG_TASK_COUNT = 5000;
const STATUS_FILTERS = [
  { label: 'Pendientes', statuses: [TASK_STATUS.PENDING, TASK_STATUS.OVERDUE] },
  { label: 'Completadas', statuses: [TASK_STATUS.COMPLETED] },
  { label: 'Archivadas', statuses: [TASK_STATUS.ARCHIVED] },
  { label: 'Todas', statuses: TASK_STATUSES },
] satisfies { label: string; statuses: readonly TaskStatus[] }[];

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss',
  imports: [
    IonContent,
    ReactiveFormsModule,
    ScrollingModule,
    NgTemplateOutlet,
    TaskItemComponent,
  ],
  providers: [ActionFeedback],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPage implements OnInit {
  readonly store = inject(TaskStore);
  readonly categories = inject(CategoryStore);
  readonly flags = inject(RemoteConfigService);
  readonly feedback = inject(ActionFeedback);
  private readonly confirmation = inject(DeletionConfirmation);
  private readonly clock = inject(CLOCK);
  private readonly createId = inject(CREATE_ID);
  readonly editingId = signal<string | null>(null);
  readonly filters = STATUS_FILTERS;
  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    dueDate: new FormControl(this.clock.today(), {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
      ],
    }),
    categoryId: new FormControl('', { nonNullable: true }),
  });
  readonly categoryNames = computed(
    () =>
      new Map(
        this.categories
          .categories()
          .map((category) => [category.id, category.name]),
      ),
  );
  readonly shouldVirtualize = computed(
    () => this.store.visibleTasks().length >= VIRTUAL_SCROLL_THRESHOLD,
  );
  readonly trackById = (_index: number, task: Task): string => task.id;

  ngOnInit(): void {
    void this.feedback.run(async () => {
      await Promise.all([this.store.refresh(), this.categories.refresh()]);
    });
  }

  @LogAction
  async generateFiveThousand(): Promise<void> {
    if (this.store.busy()) {
      return;
    }
    await this.feedback.run(async () => {
      const tasks = this.createDebugTasks();
      this.store.setCategory(undefined);
      this.store.setStatuses([TASK_STATUS.PENDING, TASK_STATUS.OVERDUE]);
      await this.store.upsertMany(tasks);
    });
  }

  private createDebugTasks(): Task[] {
    const now = this.clock.now();
    const dueDate = this.clock.today();
    return Array.from({ length: DEBUG_TASK_COUNT }, (_, index) => ({
      id: this.createId(),
      title: `Tarea de prueba ${index + 1}`,
      status: TASK_STATUS.PENDING,
      categoryId: null,
      dueDate,
      createdAt: now,
      updatedAt: now,
    }));
  }

  async saveTask(): Promise<void> {
    if (this.form.invalid || this.store.busy()) {
      this.form.markAllAsTouched();
      return;
    }
    await this.feedback.run(async () => {
      const input = this.form.getRawValue();
      const existing = this.store
        .tasks()
        .find((task) => task.id === this.editingId());
      if (this.editingId() && !existing) {
        throw new Error('La tarea ya no existe. Cancela la edición.');
      }
      const now = this.clock.now();
      const task: Task = {
        ...existing,
        id: existing?.id ?? this.createId(),
        title: input.title.trim(),
        dueDate: input.dueDate,
        status: existing?.status ?? TASK_STATUS.PENDING,
        categoryId: this.flags.categoriesEnabled()
          ? input.categoryId || null
          : (existing?.categoryId ?? null),
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      await this.store.upsert(task);
      this.cancelEdit();
    });
  }

  editTask(task: Task): void {
    this.editingId.set(task.id);
    this.form.reset({
      title: task.title,
      dueDate: task.dueDate,
      categoryId: task.categoryId ?? '',
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', dueDate: this.clock.today(), categoryId: '' });
  }

  async toggleTask(id: string): Promise<void> {
    const task = this.store.tasks().find((candidate) => candidate.id === id);
    const event =
      task?.status === TASK_STATUS.COMPLETED
        ? TASK_EVENT.REOPEN
        : TASK_EVENT.COMPLETE;
    await this.feedback.run(() => this.store.dispatch(id, event));
  }

  async dispatch(action: { id: string; event: TaskEvent }): Promise<void> {
    await this.feedback.run(() => this.store.dispatch(action.id, action.event));
  }

  async removeTask(id: string): Promise<void> {
    await this.feedback.run(async () => {
      const task = this.store.tasks().find((candidate) => candidate.id === id);
      if (!task) {
        throw new Error('La tarea ya no existe.');
      }
      if (await this.confirmation.confirm(task.title)) {
        await this.store.remove(id);
      }
    });
  }

  async retry(): Promise<void> {
    await this.feedback.run(() => this.store.retry());
  }
}
