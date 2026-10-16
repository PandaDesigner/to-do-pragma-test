import { isTaskStatus, Task, TaskStatus, transitionTask } from './task';

function transition(task: Task, next: TaskStatus): Task {
  return transitionTask(task, next);
}

describe('Task model', () => {
  it('recognises the supported statuses and rejects unknown ones', () => {
    expect(isTaskStatus('pending')).toBe(true);
    expect(isTaskStatus('completed')).toBe(true);
    expect(isTaskStatus('overdue')).toBe(true);
    expect(isTaskStatus('archived')).toBe(true);
    expect(isTaskStatus('done')).toBe(false);
  });

  it('allows the documented transitions and rejects the rest', () => {
    const task: Task = { id: 't-1', title: 'Demo', status: 'pending' };
    expect(() => transition(task, 'completed')).not.toThrow();
    expect(() => transition(task, 'overdue')).not.toThrow();
    expect(() =>
      transition({ ...task, status: 'pending' }, 'archived'),
    ).toThrow(/Invalid task transition/);
    expect(() =>
      transition({ ...task, status: 'overdue' }, 'archived'),
    ).not.toThrow();
    expect(() =>
      transition({ ...task, status: 'archived' }, 'completed'),
    ).toThrow(/Invalid task transition/);
  });
});
