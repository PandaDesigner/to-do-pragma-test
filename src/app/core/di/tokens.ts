import { InjectionToken } from '@angular/core';
import type {
  CategoryRepository,
  TaskRepository,
} from '../../domain/repository';

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>(
  'TASK_REPOSITORY',
);
export const CATEGORY_REPOSITORY = new InjectionToken<CategoryRepository>(
  'CATEGORY_REPOSITORY',
);
