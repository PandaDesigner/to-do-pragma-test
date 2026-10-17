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
  sheetRequest: SheetRequest | null;
}

export type CategorySheetMode = 'create' | 'edit';

export type SheetRequest =
  | { mode: 'create' }
  | { mode: 'edit'; draft: Category };

const initialState: CategoryStoreState = {
  categories: [],
  busy: false,
  error: null,
  sheetRequest: null,
};

function mergeCategory(
  categories: readonly Category[],
  category: Category,
): readonly Category[] {
  const map = new Map(categories.map((existing) => [existing.id, existing]));
  map.set(category.id, category);
  return [...map.values()];
}

function removeCategoryById(
  categories: readonly Category[],
  id: string,
): readonly Category[] {
  return categories.filter((category) => category.id !== id);
}

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
            let nextCategories: readonly Category[] = [];
            patchState(store, ({ categories }) => {
              nextCategories = mergeCategory(categories, category);
              return { categories: nextCategories };
            });
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
            let nextCategories: readonly Category[] = [];
            patchState(store, ({ categories }) => {
              nextCategories = removeCategoryById(categories, id);
              return { categories: nextCategories };
            });
            tasks.setCategories(nextCategories);
          });
        },
        openCategorySheet(request: SheetRequest): void {
          patchState(store, { sheetRequest: request });
        },
        closeCategorySheet(): void {
          patchState(store, { sheetRequest: null });
        },
      };
    },
  ),
);
