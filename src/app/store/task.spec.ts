import { TestBed } from '@angular/core/testing';
import { CLOCK, TASK_REPOSITORY } from '../core/di/tokens';
import { InMemoryRepository } from '../data/repositories/in-memory-repository';
import { TASK_STATUS, type Task, type TaskStatus } from '../domain/task';
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

  it('TSK-1/3/7/9 creates, completes, filters by category and clears the filter', async () => {
    const { repository, store } = setup();
    const work = taskFixture({
      id: 'work-task',
      categoryId: 'work',
      dueDate: '2026-01-10',
    });
    const home = taskFixture({
      id: 'home-task',
      categoryId: 'home',
      dueDate: '2026-01-04',
    });
    await store.upsert(work);
    await store.upsert(home);
    expect(store.tasks()).toEqual([work, home]);
    expect(await repository.list()).toEqual([work, home]);

    await store.dispatch(work.id, TASK_EVENT.COMPLETE);
    const completed = {
      ...work,
      status: TASK_STATUS.COMPLETED,
      updatedAt: 100,
    };
    expect(store.tasks()).toEqual([completed, home]);
    expect(await repository.list()).toEqual([completed, home]);

    store.setStatuses([TASK_STATUS.PENDING, TASK_STATUS.COMPLETED]);
    store.setCategory('work');
    expect(store.visibleTasks()).toEqual([completed]);
    store.setCategory('home');
    expect(store.visibleTasks()).toEqual([home]);
    store.setCategory(undefined);
    expect(store.visibleTasks()).toEqual([home, completed]);
  });

  it('TSK-2 replaces the same id without duplicates and preserves supplied timestamps', async () => {
    const { repository, store } = setup();
    await store.upsert(future);
    const updated = { ...future, title: 'Updated', updatedAt: 99 };
    await store.upsert(updated);
    expect(store.tasks()).toEqual([updated]);
    expect(await repository.list()).toEqual([updated]);
    expect(new Set(store.tasks().map((task) => task.id)).size).toBe(1);
  });

  it('TSK-7 distinguishes uncategorised tasks from no category filter', async () => {
    const { store } = setup();
    const work = { ...future, id: 'work', categoryId: 'work' };
    await store.upsertMany([future, work]);
    store.setCategory('work');
    expect(store.visibleTasks()).toEqual([work]);
    store.setCategory(null);
    expect(store.visibleTasks()).toEqual([future]);
    store.setCategory(undefined);
    expect(store.visibleTasks()).toEqual([future, work]);
  });

  it('TSK-9 filters completed tasks and sorts them by dueDate ascending', async () => {
    const { store } = setup();
    const earlier = taskFixture({
      id: 'earlier',
      status: TASK_STATUS.COMPLETED,
      dueDate: '2026-01-04',
    });
    const later = { ...earlier, id: 'later', dueDate: '2026-01-10' };
    await store.upsertMany([later, future, earlier]);
    const statuses: TaskStatus[] = [TASK_STATUS.COMPLETED];
    store.setStatuses(statuses);
    statuses.push(TASK_STATUS.PENDING);
    expect(store.visibleTasks()).toEqual([earlier, later]);
    expect(store.tasks()).toEqual([later, future, earlier]);
    store.setStatuses([]);
    expect(store.visibleTasks()).toEqual([]);
  });

  it.each([
    'upsertMany',
    'dispatch',
    'clearCategory',
    'remove',
    'refresh',
  ] as const)(
    'TSK-10 preserves state and retries %s after a repository failure',
    async (operation) => {
      const { repository, store } = setup();
      const original = { ...future, categoryId: 'work' };
      await store.upsert(original);
      const before = store.tasks();
      const repositoryMethod =
        operation === 'remove'
          ? 'remove'
          : operation === 'refresh'
            ? 'list'
            : 'save';
      jest
        .spyOn(repository, repositoryMethod)
        .mockRejectedValueOnce(new Error('offline'));
      const operations = {
        upsertMany: () => store.upsertMany([{ ...original, title: 'Updated' }]),
        dispatch: () => store.dispatch(original.id, TASK_EVENT.COMPLETE),
        clearCategory: () => store.clearCategory('work'),
        remove: () => store.remove(original.id),
        refresh: () => store.refresh(),
      };
      await expect(operations[operation]()).rejects.toThrow('offline');
      expect(store.tasks()).toBe(before);
      expect(await repository.list()).toEqual([original]);
      expect(store.error()).toBe('offline');
      expect(store.busy()).toBe(false);
      await store.retry();
      const expectedTasks = {
        upsertMany: [{ ...original, title: 'Updated' }],
        dispatch: [
          { ...original, status: TASK_STATUS.COMPLETED, updatedAt: 100 },
        ],
        clearCategory: [{ ...original, categoryId: null, updatedAt: 100 }],
        remove: [],
        refresh: [original],
      };
      expect(store.tasks()).toEqual(expectedTasks[operation]);
      expect(await repository.list()).toEqual(expectedTasks[operation]);
      expect(store.error()).toBeNull();
      expect(store.busy()).toBe(false);
    },
  );

  it('TSK-8 keeps the view unchanged when saving expired tasks fails and retries refresh', async () => {
    const { repository, store } = setup();
    const past = taskFixture({ id: 'past' });
    await repository.save(past);
    jest
      .spyOn(repository, 'save')
      .mockRejectedValueOnce(new Error('disk full'));
    await expect(store.refresh()).rejects.toThrow('disk full');
    expect(store.tasks()).toEqual([]);
    expect(await repository.list()).toEqual([past]);
    expect(store.error()).toBe('disk full');
    expect(store.busy()).toBe(false);
    await store.retry();
    const expired = { ...past, status: TASK_STATUS.OVERDUE, updatedAt: 100 };
    expect(store.tasks()).toEqual([expired]);
    expect(await repository.list()).toEqual([expired]);
    expect(store.error()).toBeNull();
  });
});
