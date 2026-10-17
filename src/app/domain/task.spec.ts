import { isTaskStatus, TASK_STATUS, TASK_STATUSES } from './task';
import { taskFixture } from '../testing/task.fixture';

describe('APP-01 Task model', () => {
  it.each(TASK_STATUSES)('recognises %s', (status) => {
    expect(isTaskStatus(status)).toBe(true);
  });

  it.each(['done', '', 42, null, undefined, {}])(
    'rejects unsupported status %p',
    (status) => {
      expect(isTaskStatus(status)).toBe(false);
    },
  );

  it('exposes the canonical date, category and timestamp fields', () => {
    expect(taskFixture()).toEqual({
      id: 'task-1',
      title: 'Demo',
      status: TASK_STATUS.PENDING,
      dueDate: '2026-01-01',
      categoryId: null,
      createdAt: 1,
      updatedAt: 1,
    });
  });

  it('keeps ids unique across a list of tasks', () => {
    const ids = new Set([
      taskFixture({ id: 'a' }).id,
      taskFixture({ id: 'b' }).id,
      taskFixture({ id: 'c' }).id,
    ]);
    expect(ids.size).toBe(3);
  });

  it('defaults categoryId to null when not provided', () => {
    const fixture = taskFixture({ categoryId: undefined as unknown as null });
    expect(fixture.categoryId).toBeUndefined();
  });
});
