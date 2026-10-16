import { TASK_STATUS } from './task';
import { filterTasks, sortTasksByDueDate, TASK_SORT } from './task-strategy';
import { taskFixture } from '../testing/task.fixture';

describe('APP-03 Task strategies', () => {
  it('filters by status set and category together', () => {
    const tasks = [
      taskFixture({ id: 'a' }),
      taskFixture({
        id: 'b',
        status: TASK_STATUS.COMPLETED,
        categoryId: 'cat-1',
      }),
      taskFixture({ id: 'c', categoryId: 'cat-1' }),
      taskFixture({
        id: 'd',
        status: TASK_STATUS.OVERDUE,
        categoryId: 'cat-2',
      }),
    ];
    expect(
      filterTasks(tasks, {
        statuses: [TASK_STATUS.PENDING, TASK_STATUS.OVERDUE],
      }).map((task) => task.id),
    ).toEqual(['a', 'c', 'd']);
    expect(
      filterTasks(tasks, {
        statuses: [TASK_STATUS.PENDING],
        categoryId: 'cat-1',
      }).map((task) => task.id),
    ).toEqual(['c']);
  });

  it('returns a new array without mutating input', () => {
    const tasks = [
      taskFixture({ id: 'a' }),
      taskFixture({ id: 'b', status: TASK_STATUS.COMPLETED }),
    ];
    const original = tasks.map((task) => task.id);
    const filtered = filterTasks(tasks, { statuses: [TASK_STATUS.PENDING] });
    expect(filtered).not.toBe(tasks);
    expect(tasks.map((task) => task.id)).toEqual(original);
  });

  it('handles empty input and an empty status set', () => {
    expect(filterTasks([], { statuses: [TASK_STATUS.PENDING] })).toEqual([]);
    expect(filterTasks([taskFixture()], { statuses: [] })).toEqual([]);
    expect(sortTasksByDueDate([], { kind: TASK_SORT.DUE_DATE })).toEqual([]);
  });

  it('distinguishes an omitted category filter from uncategorized tasks', () => {
    const tasks = [
      taskFixture({ id: 'uncategorized' }),
      taskFixture({ id: 'categorized', categoryId: 'cat-1' }),
    ];
    expect(
      filterTasks(tasks, { statuses: [TASK_STATUS.PENDING] }),
    ).toHaveLength(2);
    expect(
      filterTasks(tasks, {
        statuses: [TASK_STATUS.PENDING],
        categoryId: null,
      }).map((task) => task.id),
    ).toEqual(['uncategorized']);
    expect(
      filterTasks(tasks, {
        statuses: [TASK_STATUS.PENDING],
        categoryId: 'missing',
      }),
    ).toEqual([]);
  });

  it('preserves the order of equal dates and never mutates frozen input', () => {
    const tasks = Object.freeze([
      Object.freeze(taskFixture({ id: 'later', dueDate: '2026-01-03' })),
      Object.freeze(taskFixture({ id: 'same-1' })),
      Object.freeze(taskFixture({ id: 'same-2' })),
    ]);
    const sorted = sortTasksByDueDate(tasks, { kind: TASK_SORT.DUE_DATE });
    expect(sorted.map((task) => task.id)).toEqual([
      'same-1',
      'same-2',
      'later',
    ]);
    expect(sorted).not.toBe(tasks);
    expect(tasks.map((task) => task.id)).toEqual(['later', 'same-1', 'same-2']);
    expect(filterTasks(tasks, { statuses: [TASK_STATUS.PENDING] })).toEqual(
      tasks,
    );
  });

  it('sorts tasks by dueDate ascending', () => {
    const tasks = [
      taskFixture({ id: 'a', dueDate: '2026-01-04' }),
      taskFixture({ id: 'b', dueDate: '2026-01-03' }),
      taskFixture({ id: 'c', dueDate: '2026-01-01' }),
    ];
    expect(
      sortTasksByDueDate(tasks, { kind: TASK_SORT.DUE_DATE }).map(
        (task) => task.id,
      ),
    ).toEqual(['c', 'b', 'a']);
  });
});
