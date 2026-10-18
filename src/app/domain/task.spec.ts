import { isTaskStatus, TASK_STATUS, TASK_STATUSES, type Task } from './task';
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

  it('preserves caller-provided ids and categories', () => {
    const task: Task = taskFixture({ id: 'work-task', categoryId: 'work' });
    expect(task.id).toBe('work-task');
    expect(task.categoryId).toBe('work');
  });

  it('defaults categoryId to null when not provided', () => {
    expect(taskFixture().categoryId).toBeNull();
  });

  it('allows scheduling fields to be omitted or supplied', () => {
    const task: Task = taskFixture();
    expect(task.time).toBeUndefined();
    expect(task.durationMin).toBeUndefined();
    expect(task.reminderMin).toBeUndefined();
    expect(
      taskFixture({ time: '09:30', durationMin: 20, reminderMin: 5 }),
    ).toEqual({ ...task, time: '09:30', durationMin: 20, reminderMin: 5 });
  });

  it('requires identity, title, status, category, date and timestamps at compile time', () => {
    type RequiredFields = {
      [Field in keyof Task]-?: object extends Pick<Task, Field> ? never : Field;
    }[keyof Task];
    const fields: Record<RequiredFields, true> = {
      id: true,
      title: true,
      status: true,
      categoryId: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    };
    expect(Object.keys(taskFixture()).sort()).toEqual(
      Object.keys(fields).sort(),
    );
  });
});
