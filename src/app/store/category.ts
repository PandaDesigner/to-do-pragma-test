import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { CATEGORY_REPOSITORY } from '../core/di/tokens';
import type { Category } from '../domain/category';
import { TaskStore } from './task';
import {
  createOperationRunner,
  type OperationStatus,
} from './operation-runner';

interface CategoryStoreState extends OperationStatus {
  categories: readonly Category[];
}
const initialState: CategoryStoreState = {
  categories: [],
  busy: false,
  error: null,
};

export const CategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      repository = inject(CATEGORY_REPOSITORY),
      tasks = inject(TaskStore),
    ) => {
      const operations = createOperationRunner((status) =>
        patchState(store, status),
      );
      return {
        retry: operations.retry,
        async refresh(): Promise<void> {
          await operations.run(async () => {
            patchState(store, { categories: await repository.list() });
          });
        },
        async upsert(category: Category): Promise<void> {
          await operations.run(async () => {
            await repository.save(category);
            patchState(store, ({ categories }) => {
              const merged = new Map(
                categories.map((existing) => [existing.id, existing]),
              );
              merged.set(category.id, category);
              return { categories: [...merged.values()] };
            });
          });
        },
        async remove(id: string): Promise<void> {
          await operations.run(async () => {
            await tasks.refresh();
            await tasks.clearCategory(id);
            await repository.remove(id);
            if (tasks.categoryId() === id) {
              tasks.setCategory(undefined);
            }
            patchState(store, ({ categories }) => ({
              categories: categories.filter((category) => category.id !== id),
            }));
          });
        },
      };
    },
  ),
);
