import { InjectionToken } from '@angular/core';
import type { Clock } from '../../domain/task-state';
import type { RemoteConfigPort } from '../config/remote-config-port';

export const REMOTE_CONFIG_PORT = new InjectionToken<RemoteConfigPort>(
  'REMOTE_CONFIG_PORT',
);
import type {
  CategoryRepository,
  TaskRepository,
} from '../../domain/repository';

export const CLOCK = new InjectionToken<Clock>('CLOCK', {
  factory: () => ({
    now: () => Date.now(),
    today: () => {
      const date = new Date();
      return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');
    },
  }),
});

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>(
  'TASK_REPOSITORY',
);
export const CATEGORY_REPOSITORY = new InjectionToken<CategoryRepository>(
  'CATEGORY_REPOSITORY',
);
