import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { CLOCK, CREATE_ID, ROUTE_DATA } from '../../core/di/tokens';
import { RemoteConfigService } from '../../core/config/remote-config';
import { TASK_STATUS, type Task } from '../../domain/task';
import { TASK_EVENT, type TaskEvent } from '../../domain/task-state';
import {
  filterTasks,
  sortTasksByDueDate,
  TASK_SORT,
} from '../../domain/task-strategy';
import { filterTasksBySection } from '../../domain/category/filter-by-section';
import { sectionContainsCategory } from '../../store/category/section';
import { CATEGORY_KIND } from '../../domain/category';
import {
  CATEGORY_SECTION,
  type CategorySection,
} from '../../domain/category/category-section';
import type { Category } from '../../domain/category';
import { TaskStore } from '../../store/task';
import { CategoryStore } from '../../store/category';
import { TaskItemComponent } from '../../shared/components/task-item/task-item.component';
import {
  noteRowState,
  pendingRowState,
  taskRowState,
} from '../../shared/components/task-item/task-item.state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ActionFeedback } from '../../shared/services/action-feedback';
import { DeletionConfirmation } from '../../shared/services/deletion-confirmation';
import { formatDayTitle, formatLongDate } from './day-title';
import { taskBelongsToSection } from './section-helpers';
import { pageCount } from '../../domain/pagination';

const DURATION_PRESETS = [15, 30, 45, 60, 75, 90, 105, 120] as const;
const VIEW_STATUSES = [
  TASK_STATUS.PENDING,
  TASK_STATUS.OVERDUE,
  TASK_STATUS.COMPLETED,
] as const;
const PENDING_STATUSES = [TASK_STATUS.PENDING, TASK_STATUS.OVERDUE] as const;
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonModal,
    FabButtonComponent,
    ReactiveFormsModule,
    NgTemplateOutlet,
    TranslatePipe,
    TaskItemComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ChipComponent,
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
  readonly taskRowState = taskRowState;
  readonly noteRowState = noteRowState;
  readonly pendingRowState = pendingRowState;
  readonly pendingSelected = computed(() => {
    const statuses = [...this.store.statuses()].sort();
    const pending = [...PENDING_STATUSES].sort();
    return (
      statuses.length === pending.length &&
      statuses.every((status, index) => status === pending[index])
    );
  });
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
    durationPreset: new FormControl<number | 'custom'>(30, {
      nonNullable: true,
    }),
    reminderMin: new FormControl('15', { nonNullable: true }),
    categoryId: new FormControl('', { nonNullable: true }),
  });
  readonly section = this.readSection();
  readonly selectedCategoryId = signal<string | null | undefined>(undefined);
  readonly tabPage = signal(1);
  readonly availableCategories = computed(() =>
    this.store
      .categories()
      .filter((category) => sectionContainsCategory(this.section, category)),
  );
  readonly filteredTasks = computed(() =>
    sortTasksByDueDate(
      filterTasksBySection(
        filterTasks(this.store.tasks(), {
          statuses: this.store.statuses(),
          categoryId: this.selectedCategoryId(),
        }),
        this.store.categories(),
        this.section,
      ),
      { kind: TASK_SORT.DUE_DATE },
    ),
  );
  readonly totalPages = computed(() =>
    pageCount(this.filteredTasks().length, this.store.pageSize()),
  );
  readonly currentPage = computed(() =>
    Math.min(Math.max(1, this.tabPage()), this.totalPages()),
  );
  readonly visibleTasks = computed(() => {
    const size = this.store.pageSize();
    return this.filteredTasks().slice(0, this.currentPage() * size);
  });
  readonly hasMore = computed(() => this.currentPage() < this.totalPages());
  readonly sectionLabel = computed(() => 'section.' + this.section);
  readonly emptyStateTitle = computed(
    () => 'todo.sections.' + this.section + '.emptyTitle',
  );
  readonly emptyStateHint = computed(
    () => 'todo.sections.' + this.section + '.emptyHint',
  );
  readonly emptyStateAction = computed(
    () => 'todo.sections.' + this.section + '.emptyAction',
  );
  readonly canCreate = computed(
    () =>
      (this.flags.categoriesEnabled() &&
        this.section === CATEGORY_SECTION.GENERAL) ||
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
  readonly notesCategory = computed(() => {
    const id = this.selectedCategoryId();
    if (!id) {
      return null;
    }
    return (
      this.availableCategories().find(
        (category) =>
          category.id === id && category.kind === CATEGORY_KIND.SHOPPING,
      ) ?? null
    );
  });
  readonly dayTitle = computed(() => formatDayTitle(this.clock.today()));
  readonly longDate = computed(() => formatLongDate(this.clock.today()));
  readonly earlierTasks = computed(() =>
    this.store.tasks().filter((task) => this.isEarlierOpenTask(task)),
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

  focusToday(): void {
    this.chooseCategory(undefined);
    this.store.setStatuses([...VIEW_STATUSES]);
    this.panelOpen.set(true);
    this.scrollListToTop();
  }

  chooseCategory(categoryId: string | null | undefined): void {
    this.selectedCategoryId.set(categoryId);
    this.tabPage.set(1);
    this.store.setCategory(categoryId);
  }

  choosePending(): void {
    this.tabPage.set(1);
    this.store.setStatuses(
      this.pendingSelected() ? [...VIEW_STATUSES] : [...PENDING_STATUSES],
    );
  }

  readonly durationPreset = computed(
    () => this.form.controls.durationPreset.value,
  );

  openSheet(): void {
    this.sheetOpen.set(true);
  }

  closeSheet(): void {
    this.sheetOpen.set(false);
    this.cancelEdit();
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
        durationMin:
          input.durationPreset === 'custom'
            ? input.durationMin
              ? Number(input.durationMin)
              : undefined
            : Number(input.durationPreset),
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
    const durationPreset =
      duration === undefined
        ? 30
        : DURATION_PRESETS.includes(
              duration as (typeof DURATION_PRESETS)[number],
            )
          ? duration
          : 'custom';
    this.form.reset({
      title: task.title,
      dueDate: task.dueDate,
      time: task.time ?? '',
      durationMin: duration?.toString() ?? '',
      durationPreset,
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

  goToPage(page: number): void {
    const target = Math.min(Math.max(1, page), this.totalPages());
    this.tabPage.set(target);
    this.store.setPage(target);
    queueMicrotask(() => this.scrollListToTop());
  }

  loadMore(event: { target: { complete: () => void } }): void {
    if (this.hasMore()) {
      const next = this.currentPage() + 1;
      this.tabPage.set(next);
      this.store.setPage(next);
    }
    void event.target.complete();
  }

  scrollListToTop(): void {
    const list = document.querySelector<HTMLElement>('app-tasks .task-list');
    if (list) {
      list.scrollTop = 0;
    }
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
    if (!taskBelongsToSection(task, this.section, this.availableCategories())) {
      return false;
    }
    if (
      this.store.categories().length === 0 &&
      (this.section !== CATEGORY_SECTION.GENERAL || task.categoryId !== null)
    ) {
      return false;
    }
    if (this.selectedCategoryId() === null && task.categoryId !== null) {
      return false;
    }
    if (
      typeof this.selectedCategoryId() === 'string' &&
      task.categoryId !== this.selectedCategoryId()
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
