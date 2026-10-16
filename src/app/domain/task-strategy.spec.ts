import { Task, TaskStatus } from './task';
import {
  filterTasks,
  sortTasksByDueAt,
  TaskFilter,
  TaskSorter,
} from './task-strategy';

function makeTask(id: string, status: TaskStatus, dueAt?: string): Task {
  return { id, title: id, status, dueAt };
}

describe('Task strategies', () => {
  it('filters tasks by status set and category id', () => {
    const tasks: Task[] = [
      makeTask('a', 'pending', '2026-01-02T00:00:00Z'),
      {
        ...makeTask('b', 'completed', '2026-01-03T00:00:00Z'),
        categoryId: 'cat-1',
      },
      {
        ...makeTask('c', 'pending', '2026-01-01T00:00:00Z'),
        categoryId: 'cat-1',
      },
      {
        ...makeTask('d', 'overdue', '2026-01-04T00:00:00Z'),
        categoryId: 'cat-2',
      },
    ];

    const byStatus: TaskFilter = { statuses: ['pending', 'overdue'] };
    const byCategory: TaskFilter = {
      statuses: ['pending'],
      categoryId: 'cat-1',
    };

    expect(filterTasks(tasks, byStatus).map((task) => task.id)).toEqual([
      'a',
      'c',
      'd',
    ]);
    expect(filterTasks(tasks, byCategory).map((task) => task.id)).toEqual([
      'c',
    ]);
  });

  it('returns a new array without mutating the input', () => {
    const tasks: Task[] = [
      makeTask('a', 'pending'),
      makeTask('b', 'completed'),
    ];
    const original = tasks.map((task) => task.id);

    const filtered = filterTasks(tasks, { statuses: ['pending'] });
    expect(filtered).not.toBe(tasks);
    expect(tasks.map((task) => task.id)).toEqual(original);
  });

  it('sorts tasks by dueAt ascending, with tasks without dueAt last', () => {
    const tasks: Task[] = [
      makeTask('a', 'pending'),
      makeTask('b', 'pending', '2026-01-03T00:00:00Z'),
      makeTask('c', 'pending', '2026-01-01T00:00:00Z'),
    ];
    const sorter: TaskSorter = { kind: 'dueAt' };
    expect(sortTasksByDueAt(tasks, sorter).map((task) => task.id)).toEqual([
      'c',
      'b',
      'a',
    ]);
  });
});
