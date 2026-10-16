import { Injector } from '@angular/core';
import { CATEGORY_REPOSITORY, TASK_REPOSITORY } from './tokens';
import type {
  CategoryRepository,
  TaskRepository,
} from '../../domain/repository';

const taskRepository: TaskRepository = {
  list: async () => [],
  save: async () => undefined,
  remove: async () => undefined,
};
const categoryRepository: CategoryRepository = {
  list: async () => [],
  save: async () => undefined,
  remove: async () => undefined,
};

describe('APP-04 Repository injection tokens', () => {
  it('resolves each repository independently through Angular DI', () => {
    const injector = Injector.create({
      providers: [
        { provide: TASK_REPOSITORY, useValue: taskRepository },
        { provide: CATEGORY_REPOSITORY, useValue: categoryRepository },
      ],
    });
    expect(TASK_REPOSITORY).not.toBe(CATEGORY_REPOSITORY);
    expect(injector.get(TASK_REPOSITORY)).toBe(taskRepository);
    expect(injector.get(CATEGORY_REPOSITORY)).toBe(categoryRepository);
    injector.destroy();
  });
});
