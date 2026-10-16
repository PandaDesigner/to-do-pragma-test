import { Category } from './category';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
  TaskRepository,
  TASK_REPOSITORY,
} from './repository';
import { Task } from './task';

function makeTaskRepository(): TaskRepository & {
  state: Map<string, Task>;
} {
  const state = new Map<string, Task>();
  return {
    state,
    async list() {
      return [...state.values()];
    },
    async save(task) {
      state.set(task.id, task);
    },
    async remove(id) {
      state.delete(id);
    },
  };
}

function makeCategoryRepository(): CategoryRepository & {
  state: Map<string, Category>;
} {
  const state = new Map<string, Category>();
  return {
    state,
    async list() {
      return [...state.values()];
    },
    async save(category) {
      state.set(category.id, category);
    },
    async remove(id) {
      state.delete(id);
    },
  };
}

describe('Repository tokens', () => {
  it('expose distinct tokens for tasks and categories', () => {
    expect(TASK_REPOSITORY).toBeDefined();
    expect(CATEGORY_REPOSITORY).toBeDefined();
    expect(TASK_REPOSITORY.toString()).not.toBe(CATEGORY_REPOSITORY.toString());
  });
});

describe('Repository contract', () => {
  it('persists tasks in insertion order, then removes them', async () => {
    const repo = makeTaskRepository();
    await repo.save({ id: 'a', title: 'A', status: 'pending' });
    await repo.save({ id: 'b', title: 'B', status: 'completed' });
    const list = await repo.list();
    expect(list.map((task) => task.id)).toEqual(['a', 'b']);
    await repo.remove('a');
    expect((await repo.list()).map((task) => task.id)).toEqual(['b']);
  });

  it('persists categories and removes them', async () => {
    const repo = makeCategoryRepository();
    await repo.save({ id: 'c-1', name: 'Errands', kind: 'daily' });
    await repo.remove('c-1');
    expect(await repo.list()).toEqual([]);
  });
});
