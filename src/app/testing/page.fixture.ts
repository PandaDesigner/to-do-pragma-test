import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import {
  CLOCK,
  CREATE_ID,
  TASK_REPOSITORY,
  CATEGORY_REPOSITORY,
} from '../core/di/tokens';
import { RemoteConfigService } from '../core/config/remote-config';
import { InMemoryRepository } from '../data/repositories/in-memory-repository';
import type { Task } from '../domain/task';
import type { Category } from '../domain/category';
import { TaskStore } from '../store/task';
import { CategoryStore } from '../store/category';
import { DeletionConfirmation } from '../shared/services/deletion-confirmation';

export function configurePageTesting() {
  const taskRepository = new InMemoryRepository<Task>();
  const categoryRepository = new InMemoryRepository<Category>();
  const enabled = signal(true);
  const confirm = jest.fn().mockResolvedValue(true);
  let nextId = 0;
  TestBed.configureTestingModule({
    providers: [
      provideIonicAngular(),
      TaskStore,
      CategoryStore,
      { provide: TASK_REPOSITORY, useValue: taskRepository },
      { provide: CATEGORY_REPOSITORY, useValue: categoryRepository },
      {
        provide: CLOCK,
        useValue: { now: () => 100, today: () => '2026-01-02' },
      },
      { provide: CREATE_ID, useValue: () => `created-${++nextId}` },
      {
        provide: RemoteConfigService,
        useValue: {
          categoriesEnabled: enabled.asReadonly(),
          error: signal(null).asReadonly(),
          loading: signal(false).asReadonly(),
          initialize: jest.fn().mockResolvedValue(undefined),
        },
      },
      { provide: DeletionConfirmation, useValue: { confirm } },
    ],
  });
  return {
    taskRepository,
    categoryRepository,
    enabled,
    confirm,
    tasks: TestBed.inject(TaskStore),
    categories: TestBed.inject(CategoryStore),
  };
}
