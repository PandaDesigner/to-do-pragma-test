import {
  signal,
  type Provider,
  type EnvironmentProviders,
} from '@angular/core';
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

export function configurePageTesting({
  providers = [],
}: { providers?: (Provider | EnvironmentProviders)[] } = {}) {
  const taskRepository = new InMemoryRepository<Task>();
  const categoryRepository = new InMemoryRepository<Category>();
  const enabled = signal(true);
  const remoteError = signal<string | null>(null);
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
          error: remoteError.asReadonly(),
          loading: signal(false).asReadonly(),
          initialize: jest.fn().mockResolvedValue(undefined),
        },
      },
      { provide: DeletionConfirmation, useValue: { confirm } },
      ...providers,
    ],
  });
  return {
    taskRepository,
    categoryRepository,
    enabled,
    remoteError,
    confirm,
    tasks: TestBed.inject(TaskStore),
    categories: TestBed.inject(CategoryStore),
  };
}
