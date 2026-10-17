import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { CATEGORY_REPOSITORY } from '../core/di/tokens';
import { parseCategorySection, type Category } from '../domain/category';
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
            const categories = await repository.list();
            for (const category of categories) {
              if (category.section !== undefined) {
                parseCategorySection(category.section);
              }
            }
            patchState(store, { categories });
            tasks.setCategories(categories);
          });
        },
        async upsert(category: Category): Promise<void> {
          await operations.run(async () => {
            await repository.save(category);
            const nextCategories = (() => {
              let merged: readonly Category[] = [];
              patchState(store, ({ categories }) => {
                const map = new Map(
                  categories.map((existing) => [existing.id, existing]),
                );
                map.set(category.id, category);
                merged = [...map.values()];
                return { categories: merged };
              });
              return merged;
            })();
            tasks.setCategories(nextCategories);
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
            const nextCategories = (() => {
              let remaining: readonly Category[] = [];
              patchState(store, ({ categories }) => {
                remaining = categories.filter((category) => category.id !== id);
                return { categories: remaining };
              });
              return remaining;
            })();
            tasks.setCategories(nextCategories);
          });
        },
      };
    },
  ),
);
