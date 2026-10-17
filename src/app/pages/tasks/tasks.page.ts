import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonModal,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { CLOCK, CREATE_ID, ROUTE_DATA } from '../../core/di/tokens';
import { RemoteConfigService } from '../../core/config/remote-config';
import { TASK_STATUS, type Task } from '../../domain/task';
import { TASK_EVENT, type TaskEvent } from '../../domain/task-state';
import {
  CATEGORY_SECTION,
  type CategorySection,
} from '../../domain/category/category-section';
import type { Category } from '../../domain/category';
import { TaskStore } from '../../store/task';
import { CategoryStore } from '../../store/category';
import { TaskItemComponent } from '../../shared/components/task-item/task-item.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { NewTaskInputComponent } from '../../shared/components/new-task-input/new-task-input.component';
import { ActionFeedback } from '../../shared/services/action-feedback';
import { DeletionConfirmation } from '../../shared/services/deletion-confirmation';
import { formatDayTitle, formatLongDate } from './day-title';
import { taskBelongsToSection } from './section-helpers';

const VIRTUAL_SCROLL_THRESHOLD = 200;
const VIEW_STATUSES = [
  TASK_STATUS.PENDING,
  TASK_STATUS.OVERDUE,
  TASK_STATUS.COMPLETED,
] as const;
export const PENDING_PANEL = {
  LEFT: 62,
  TOP: 187,
  WIDTH: 300,
  HEADER_HEIGHT: 60,
  CLOSED_HEIGHT: 62,
  LIST_GAP: 83,
} as const;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss',
  imports: [
    IonContent,
    IonModal,
    IonFab,
    IonFabButton,
    ReactiveFormsModule,
    ScrollingModule,
    NgTemplateOutlet,
    TranslatePipe,
    TaskItemComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ChipComponent,
    NewTaskInputComponent,
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
  private readonly routeData = inject(ROUTE_DATA);
  readonly editingId = signal<string | null>(null);
  readonly panelOpen = signal(true);
  readonly sheetOpen = signal(false);
  readonly panel = PENDING_PANEL;
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
    time: new FormControl('', { nonNullable: true }),
    durationMin: new FormControl('', { nonNullable: true }),
    durationPreset: new FormControl<number | 'custom'>(30, { nonNullable: true }),
    reminderMin: new FormControl('15', { nonNullable: true }),
    categoryId: new FormControl('', { nonNullable: true }),
  });
  readonly section = this.readSection();
  readonly availableCategories = this.store.availableCategories;
  readonly sectionLabel = computed(() => 'section.' + this.store.section());
  readonly emptyStateTitle = computed(
    () => 'todo.sections.' + this.store.section() + '.emptyTitle',
  );
  readonly emptyStateHint = computed(
    () => 'todo.sections.' + this.store.section() + '.emptyHint',
  );
  readonly emptyStateAction = computed(
    () => 'todo.sections.' + this.store.section() + '.emptyAction',
  );
  readonly canCreate = computed(
    () =>
      (this.flags.categoriesEnabled() &&
        this.store.section() === CATEGORY_SECTION.GENERAL) ||
      !this.flags.categoriesEnabled() ||
      this.availableCategories().length > 0,
  );
  readonly categoryNames = computed(
    () =>
      new Map(
        this.availableCategories().map((category) => [
          category.id,
          category.name,
        ]),
      ),
  );
  readonly categoryIcons = computed(
    () =>
      new Map(
        this.availableCategories().map((category) => [
          category.id,
          category.icon,
        ]),
      ),
  );
  readonly categoryColors = computed(
    () =>
      new Map(
        this.availableCategories().map((category) => [
          category.id,
          category.colorToken,
        ]),
      ),
  );
  readonly dayTitle = computed(() => formatDayTitle(this.clock.today()));
  readonly longDate = computed(() => formatLongDate(this.clock.today()));
  readonly earlierTasks = computed(() =>
    this.store.tasks().filter((task) => this.isEarlierOpenTask(task)),
  );
  readonly shouldVirtualize = computed(
    () => this.store.visibleTasks().length >= VIRTUAL_SCROLL_THRESHOLD,
  );
  readonly trackById = (_index: number, task: Task): string => task.id;

  ngOnInit(): void {
    this.store.setSection(this.section);
    this.store.setStatuses(VIEW_STATUSES);
    void this.feedback.run(async () => {
      await Promise.all([this.store.refresh(), this.categories.refresh()]);
    });
  }

  togglePanel(): void {
    this.panelOpen.update((open) => !open);
  }

  readonly durationPreset = computed(() => this.form.controls.durationPreset.value);

  openSheet(): void {
    this.sheetOpen.set(true);
  }

  closeSheet(): void {
    this.sheetOpen.set(false);
    this.cancelEdit();
  }

  async addQuickTask(title: string): Promise<void> {
    if (this.store.busy() || !this.canCreate()) {
      return;
    }
    const now = this.clock.now();
    const categoryId = this.firstAvailableCategoryId();
    await this.feedback.run(() =>
      this.store.upsert({
        id: this.createId(),
        title,
        status: TASK_STATUS.PENDING,
        categoryId,
        dueDate: this.clock.today(),
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  async rescheduleEarlier(): Promise<void> {
    await this.feedback.run(async () => {
      for (const task of this.earlierTasks()) {
        await this.rescheduleOne(task);
      }
    });
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
        time: input.time || undefined,
        durationMin: input.durationMin ? Number(input.durationMin) : undefined,
        reminderMin: input.reminderMin ? Number(input.reminderMin) : undefined,
        status: existing?.status ?? TASK_STATUS.PENDING,
        categoryId: this.flags.categoriesEnabled()
          ? input.categoryId || null
          : (existing?.categoryId ?? null),
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      await this.store.upsert(task);
      this.cancelEdit();
      this.sheetOpen.set(false);
    });
  }

  openCategorySheet(): void {
    this.categories.openCategorySheet({ mode: 'create' });
  }

  editTask(task: Task): void {
    this.editingId.set(task.id);
    const duration = task.durationMin;
    this.form.reset({
      title: task.title,
      dueDate: task.dueDate,
      time: task.time ?? '',
      durationMin: duration?.toString() ?? '',
      durationPreset: duration === undefined || [15, 30, 45, 60, 75, 90, 105, 120].includes(duration) ? duration : 'custom',
      reminderMin: task.reminderMin?.toString() ?? '0',
      categoryId: task.categoryId ?? '',
    });
    this.openSheet();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({
      title: '',
      dueDate: this.clock.today(),
      time: '',
      durationMin: '',
      durationPreset: 30,
      reminderMin: '15',
      categoryId: '',
    });
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

  private firstAvailableCategoryId(): string | null {
    const available = this.availableCategories();
    if (available.length === 0) {
      return null;
    }
    return available[0].id;
  }

  private readSection(): CategorySection {
    const section = this.routeData['categorySection'];
    return (section as CategorySection | undefined) ?? CATEGORY_SECTION.GENERAL;
  }

  private isEarlierOpenTask(task: Task): boolean {
    if (task.dueDate >= this.clock.today()) {
      return false;
    }
    if (
      !taskBelongsToSection(
        task,
        this.store.section(),
        this.availableCategories(),
      )
    ) {
      return false;
    }
    if (this.store.categoryId() === null && task.categoryId !== null) {
      return false;
    }
    if (
      typeof this.store.categoryId() === 'string' &&
      task.categoryId !== this.store.categoryId()
    ) {
      return false;
    }
    return (
      task.status === TASK_STATUS.PENDING || task.status === TASK_STATUS.OVERDUE
    );
  }

  private async rescheduleOne(task: Task): Promise<void> {
    if (task.status === TASK_STATUS.PENDING) {
      await this.store.dispatch(task.id, TASK_EVENT.EXPIRE);
    }
    await this.store.dispatch(task.id, TASK_EVENT.RESCHEDULE);
  }
}
