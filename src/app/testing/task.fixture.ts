import { TASK_STATUS, type Task } from '../domain/task';

export function taskFixture(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Demo',
    status: TASK_STATUS.PENDING,
    categoryId: null,
    dueDate: '2026-01-01',
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
}
