import { TestBed } from '@angular/core/testing';
import { CLOCK, TASK_REPOSITORY } from '../core/di/tokens';
import { InMemoryRepository } from '../data/repositories/in-memory-repository';
import { TASK_STATUS, type Task } from '../domain/task';
import { TASK_EVENT, InvalidTransitionError } from '../domain/task-state';
import { taskFixture } from '../testing/task.fixture';
import { TaskStore } from './task';

describe('TaskStore', () => {
  function setup() {
    const repository = new InMemoryRepository<Task>();
    TestBed.configureTestingModule({
      providers: [
        TaskStore,
        { provide: TASK_REPOSITORY, useValue: repository },
        {
          provide: CLOCK,
          useValue: { today: () => '2026-01-02', now: () => 100 },
        },
      ],
    });
    return { repository, store: TestBed.inject(TaskStore) };
  }
  const future = taskFixture({ dueDate: '2026-01-03' });

  it('refreshes, expires only past pending tasks and composes default filters and sorting', async () => {
    const { repository, store } = setup();
    const overdue = taskFixture({ id: 'past', dueDate: '2026-01-01' });
    const today = taskFixture({ id: 'today', dueDate: '2026-01-02' });
    const completed = { ...future, id: 'done', status: TASK_STATUS.COMPLETED };
    await Promise.all(
      [future, overdue, today, completed].map((task) => repository.save(task)),
    );
    await store.refresh();
    expect(store.visibleTasks().map((task) => task.id)).toEqual([
      'past',
      'today',
      future.id,
    ]);
    expect(store.tasks().find((task) => task.id === 'past')).toMatchObject({
      status: TASK_STATUS.OVERDUE,
      updatedAt: 100,
    });
    expect(
      (await repository.list()).find((task) => task.id === 'past')?.status,
    ).toBe(TASK_STATUS.OVERDUE);
    expect(store.tasks().find((task) => task.id === 'today')?.status).toBe(
      TASK_STATUS.PENDING,
    );
    store.setStatuses([TASK_STATUS.COMPLETED]);
    expect(store.visibleTasks()).toEqual([completed]);
    store.setCategory('missing');
    expect(store.visibleTasks()).toEqual([]);
    store.setCategory(null);
    expect(store.visibleTasks()).toEqual([completed]);
    expect(store.busy()).toBe(false);
    await store.retry();
  });

  it('upserts in bulk, updates without duplicates, dispatches and removes', async () => {
    const { repository, store } = setup();
    await store.upsertMany([future, { ...future, id: 'second' }]);
    await store.upsert({ ...future, title: 'Updated' });
    expect(store.tasks()).toHaveLength(2);
    expect(store.tasks()[0].title).toBe('Updated');
    expect(store.actionsFor(store.tasks()[0])).toContain(TASK_EVENT.COMPLETE);
    await store.dispatch(future.id, TASK_EVENT.COMPLETE);
    expect(store.tasks()[0].status).toBe(TASK_STATUS.COMPLETED);
    await store.dispatch(future.id, TASK_EVENT.ARCHIVE);
    await expect(
      store.dispatch(future.id, TASK_EVENT.COMPLETE),
    ).rejects.toBeInstanceOf(InvalidTransitionError);
    await expect(
      store.dispatch('missing', TASK_EVENT.COMPLETE),
    ).rejects.toThrow('Unknown task');
    await store.remove('second');
    await store.remove('missing');
    expect(await repository.list()).toEqual(store.tasks());
    expect(store.tasks()).toHaveLength(1);
  });

  it('preserves the view on failure, exposes errors and retries the exact operation', async () => {
    const { repository, store } = setup();
    jest
      .spyOn(repository, 'save')
      .mockRejectedValueOnce(new Error('disk full'));
    await expect(store.upsert(future)).rejects.toThrow('disk full');
    expect(store.tasks()).toEqual([]);
    expect(store.error()).toBe('disk full');
    expect(store.busy()).toBe(false);
    await store.retry();
    expect(store.error()).toBeNull();
    expect(store.tasks()).toEqual([future]);
    jest.spyOn(repository, 'list').mockRejectedValueOnce('offline');
    await expect(store.refresh()).rejects.toBe('offline');
    expect(store.error()).toBe('offline');
    expect(store.tasks()).toEqual([future]);
    await store.retry();
    expect(store.error()).toBeNull();
  });

  it('clears only the requested category, retaining all tasks', async () => {
    const { store } = setup();
    await store.upsertMany([
      { ...future, categoryId: 'c' },
      { ...future, id: 'other', categoryId: 'other' },
    ]);
    await store.clearCategory('c');
    expect(store.tasks()[0]).toMatchObject({
      categoryId: null,
      updatedAt: 100,
    });
    expect(store.tasks()[1].categoryId).toBe('other');
    await store.clearCategory('missing');
    expect(store.tasks()).toHaveLength(2);
  });
});
