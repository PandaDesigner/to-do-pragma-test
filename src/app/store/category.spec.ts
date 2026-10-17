import { TestBed } from '@angular/core/testing';
import { CLOCK, TASK_REPOSITORY, CATEGORY_REPOSITORY } from '../core/di/tokens';
import { InMemoryRepository } from '../data/repositories/in-memory-repository';
import { CATEGORY_KIND, type Category } from '../domain/category';
import type { Task } from '../domain/task';
import { taskFixture } from '../testing/task.fixture';
import { TaskStore } from './task';
import { CategoryStore } from './category';

describe('CategoryStore', () => {
  const category: Category = {
    id: 'c',
    name: 'Lista',
    kind: CATEGORY_KIND.LIST,
    icon: 'list',
    colorToken: 'primary',
  };
  function setup() {
    const repository = new InMemoryRepository<Category>();
    const taskRepository = new InMemoryRepository<Task>();
    TestBed.configureTestingModule({
      providers: [
        TaskStore,
        CategoryStore,
        { provide: TASK_REPOSITORY, useValue: taskRepository },
        { provide: CATEGORY_REPOSITORY, useValue: repository },
        {
          provide: CLOCK,
          useValue: { today: () => '2026-01-02', now: () => 100 },
        },
      ],
    });
    return {
      repository,
      taskRepository,
      store: TestBed.inject(CategoryStore),
      tasks: TestBed.inject(TaskStore),
    };
  }

  it('refreshes and updates categories without duplicates', async () => {
    const { repository, store } = setup();
    await repository.save(category);
    await store.refresh();
    expect(store.categories()).toEqual([category]);
    await store.upsert({ ...category, name: 'Renamed' });
    await store.upsert({ ...category, id: 'other' });
    expect(store.categories()).toHaveLength(2);
    expect(store.categories()[0].name).toBe('Renamed');
    expect(await repository.list()).toEqual(store.categories());
    await store.retry();
  });

  it('persists orphan reassignment before removing a category and clears its active filter', async () => {
    const { repository, taskRepository, store, tasks } = setup();
    await store.upsert(category);
    await taskRepository.save(
      taskFixture({ categoryId: category.id, dueDate: '2026-01-03' }),
    );
    tasks.setCategory(category.id);
    const remove = jest
      .spyOn(repository, 'remove')
      .mockImplementation(async (id) => {
        expect((await taskRepository.list())[0].categoryId).toBeNull();
        expect(id).toBe(category.id);
      });
    await store.remove(category.id);
    expect(store.categories()).toEqual([]);
    expect(tasks.tasks()).toHaveLength(1);
    expect(tasks.tasks()[0].categoryId).toBeNull();
    expect(tasks.categoryId()).toBeUndefined();
    remove.mockRestore();
    await store.remove('missing');
  });

  it('stops deletion on reassignment failure, exposes the error and supports retry', async () => {
    const { repository, taskRepository, store } = setup();
    await store.upsert(category);
    await taskRepository.save(
      taskFixture({ categoryId: category.id, dueDate: '2026-01-03' }),
    );
    jest.spyOn(taskRepository, 'save').mockRejectedValueOnce(new Error('full'));
    const remove = jest.spyOn(repository, 'remove');
    await expect(store.remove(category.id)).rejects.toThrow('full');
    expect(remove).not.toHaveBeenCalled();
    expect(store.categories()).toEqual([category]);
    expect(store.error()).toBe('full');
    await store.retry();
    expect(store.categories()).toEqual([]);
    expect(store.error()).toBeNull();
    expect(await repository.list()).toEqual([]);
  });

  it('handles category read and write failures without clearing the previous view', async () => {
    const { repository, store } = setup();
    await store.upsert(category);
    jest
      .spyOn(repository, 'list')
      .mockRejectedValueOnce(new Error('read failed'));
    await expect(store.refresh()).rejects.toThrow('read failed');
    expect(store.categories()).toEqual([category]);
    await store.retry();
    jest
      .spyOn(repository, 'save')
      .mockRejectedValueOnce(new Error('write failed'));
    await expect(
      store.upsert({ ...category, name: 'Renamed' }),
    ).rejects.toThrow('write failed');
    expect(store.categories()[0].name).toBe('Lista');
    await store.retry();
    expect(store.categories()[0].name).toBe('Renamed');
  });

  it('[SHEET-06.1] opens the category sheet through a shared signal conforme a Figma 4:869', () => {
    const { store } = setup();
    expect(store.sheetRequest()).toBeNull();
    store.openCategorySheet({ mode: 'create' });
    expect(store.sheetRequest()).toEqual({ mode: 'create' });
  });

  it('[SHEET-06.2] closes the sheet and clears the signal conforme a Figma 4:869', () => {
    const { store } = setup();
    store.openCategorySheet({ mode: 'edit', draft: category });
    store.closeCategorySheet();
    expect(store.sheetRequest()).toBeNull();
  });

  it('[SHEET-06.3] rejects requests with a mode outside the closed type', () => {
    const { store } = setup();
    // @ts-expect-error -- intentional closed-type violation for the contract test
    store.openCategorySheet({ mode: 'delete' });
  });
});
