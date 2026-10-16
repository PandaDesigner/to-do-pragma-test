import { isTaskStatus, Task, TaskStatus, transitionTask } from './task';

describe('Task model', () => {
  it('recognises the supported statuses and rejects unknown ones', () => {
    expect(isTaskStatus('pending')).toBe(true);
    expect(isTaskStatus('completed')).toBe(true);
    expect(isTaskStatus('overdue')).toBe(true);
    expect(isTaskStatus('archived')).toBe(true);
    expect(isTaskStatus('done')).toBe(false);
  });

  it('allows documented transitions and rejects the rest', () => {
    const task: Task = { id: 't-1', title: 'Demo', status: 'pending' };
    expect(() => transitionTask(task, 'completed')).not.toThrow();
    expect(() => transitionTask(task, 'overdue')).not.toThrow();
    expect(() =>
      transitionTask({ ...task, status: 'pending' }, 'archived'),
    ).toThrow(/Invalid task transition: pending -> archived/);
    expect(() =>
      transition({ ...task, status: 'overdue' }, 'archived'),
    ).not.toThrow();
    expect(() =>
      transition({ ...task, status: 'archived' }, 'completed'),
    ).toThrow(/Invalid task transition: archived -> completed/);
  });

  it('returns a new task instance without mutating the input', () => {
    const task: Task = { id: 't-1', title: 'Demo', status: 'pending' };
    const next = transitionTask(task, 'completed');
    expect(next).not.toBe(task);
    expect(task.status).toBe('pending');
    expect(next.status).toBe('completed');
  });
});

function transition(task: Task, next: TaskStatus): Task {
  return transitionTask(task, next);
}
