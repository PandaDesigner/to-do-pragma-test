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
});
