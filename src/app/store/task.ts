import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { CLOCK, TASK_REPOSITORY } from '../core/di/tokens';
import { TASK_STATUS, type Task, type TaskStatus } from '../domain/task';
import { TASK_EVENT, type TaskEvent } from '../domain/task-state';
import {
  filterTasks,
  sortTasksByDueDate,
  TASK_SORT,
} from '../domain/task-strategy';
import { filterTasksBySection } from '../domain/category/filter-by-section';
import { sectionContainsCategory } from './category/section';
import {
  CATEGORY_SECTION,
  type CategorySection,
} from '../domain/category/category-section';
import type { Category } from '../domain/category';
import { TaskStateMachine } from '../data/states/task-state-machine';
import {
  createOperationRunner,
  type OperationStatus,
} from './operation-runner';

interface TaskStoreState extends OperationStatus {
  tasks: readonly Task[];
  statuses: readonly TaskStatus[];
  categoryId: string | null | undefined;
  categories: readonly Category[];
  section: CategorySection;
  pageSize: number;
  pageCount: number;
}

const TASK_PAGE_SIZE = 8;

const initialState: TaskStoreState = {
  tasks: [],
  statuses: [TASK_STATUS.PENDING, TASK_STATUS.OVERDUE, TASK_STATUS.COMPLETED],
  categoryId: undefined,
  categories: [],
  section: CATEGORY_SECTION.GENERAL,
  pageSize: TASK_PAGE_SIZE,
  pageCount: 1,
  busy: false,
  error: null,
};

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    visibleTasks: computed(() => {
      const filtered = sortTasksByDueDate(
        filterTasksBySection(
          filterTasks(store.tasks(), {
            statuses: store.statuses(),
            categoryId: store.categoryId(),
          }),
          store.categories(),
          store.section(),
        ),
        { kind: TASK_SORT.DUE_DATE },
      );
      const limit = store.pageSize() * store.pageCount();
      return filtered.slice(0, limit);
    }),
    availableCategories: computed(() =>
      store
        .categories()
        .filter((category) =>
          sectionContainsCategory(store.section(), category),
        ),
    ),
  })),
  withComputed((store) => ({
    hasMoreTasks: computed(
      () => store.visibleTasks().length < store.tasks().length,
    ),
  })),
  withMethods(
    (store, repository = inject(TASK_REPOSITORY), clock = inject(CLOCK)) => {
      const machine = new TaskStateMachine();
      const operations = createOperationRunner((status) =>
        patchState(store, status),
      );

      async function persistTasks(tasks: readonly Task[]): Promise<void> {
        await Promise.all(tasks.map((task) => repository.save(task)));
        patchState(store, ({ tasks: current }) => {
          const merged = new Map(current.map((task) => [task.id, task]));
          for (const task of tasks) {
            merged.set(task.id, task);
          }
          return { tasks: [...merged.values()] };
        });
      }

      return {
        retry: operations.retry,
        async refresh(): Promise<void> {
          await operations.run(async () => {
            const loaded = await repository.list();
            const expired = loaded.filter(
              (task) =>
                task.status === TASK_STATUS.PENDING &&
                task.dueDate < clock.today(),
            );
            const updated = expired.map((task) =>
              machine.transition({ task, event: TASK_EVENT.EXPIRE, clock }),
            );
            await Promise.all(updated.map((task) => repository.save(task)));
            const byId = new Map(updated.map((task) => [task.id, task]));
            patchState(store, {
              tasks: loaded.map((task) => byId.get(task.id) ?? task),
              pageCount: 1,
            });
          });
        },
        async upsert(task: Task): Promise<void> {
          await operations.run(() => persistTasks([task]));
        },
        async upsertMany(tasks: readonly Task[]): Promise<void> {
          await operations.run(() => persistTasks(tasks));
        },
        async remove(id: string): Promise<void> {
          await operations.run(async () => {
            await repository.remove(id);
            patchState(store, ({ tasks }) => ({
              tasks: tasks.filter((task) => task.id !== id),
            }));
          });
        },
        async removeAll(): Promise<void> {
          await operations.run(async () => {
            await repository.clear?.();
            patchState(store, { tasks: [] });
          });
        },
        async dispatch(id: string, event: TaskEvent): Promise<void> {
          const task = store.tasks().find((candidate) => candidate.id === id);
          if (!task) {
            throw new Error(`Unknown task: ${id}`);
          }
          const updated = machine.transition({ task, event, clock });
          await operations.run(() => persistTasks([updated]));
        },
        async clearCategory(categoryId: string): Promise<void> {
          const changed = store
            .tasks()
            .filter((task) => task.categoryId === categoryId)
            .map((task) => ({
              ...task,
              categoryId: null,
              updatedAt: clock.now(),
            }));
          await operations.run(() => persistTasks(changed));
        },
        actionsFor: (task: Task) => machine.actionsFor(task),
        setStatuses(statuses: readonly TaskStatus[]): void {
          patchState(store, { statuses: [...statuses] });
        },
        setCategory(categoryId: string | null | undefined): void {
          patchState(store, { categoryId, pageCount: 1 });
        },
        loadMore(): void {
          patchState(store, { pageCount: store.pageCount() + 1 });
        },
        setSection(section: CategorySection): void {
          patchState(store, { section, categoryId: undefined });
        },
        setCategories(categories: readonly Category[]): void {
          patchState(store, { categories });
        },
      };
    },
  ),
);
