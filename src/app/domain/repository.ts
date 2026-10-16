import { InjectionToken } from '@angular/core';
import { Category } from './category';
import { Task } from './task';

export type TaskRepository = {
  list(): Promise<readonly Task[]>;
  save(task: Task): Promise<void>;
  remove(id: string): Promise<void>;
};

export type CategoryRepository = {
  list(): Promise<readonly Category[]>;
  save(category: Category): Promise<void>;
  remove(id: string): Promise<void>;
};

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>(
  'TASK_REPOSITORY',
);
export const CATEGORY_REPOSITORY = new InjectionToken<CategoryRepository>(
  'CATEGORY_REPOSITORY',
);
