import { Task, TaskStatus } from './task';

export type TaskFilter = {
  statuses: readonly TaskStatus[];
  categoryId?: string;
};

export type TaskSorter = { kind: 'dueAt' };

export function filterTasks(
  tasks: readonly Task[],
  { statuses, categoryId }: TaskFilter,
): Task[] {
  return tasks.filter((task) => {
    if (!statuses.includes(task.status)) {
      return false;
    }
    if (categoryId !== undefined && task.categoryId !== categoryId) {
      return false;
    }
    return true;
  });
}

export function sortTasksByDueAt(
  tasks: readonly Task[],
  _sorter: TaskSorter,
): Task[] {
  return [...tasks].sort((previous, current) => {
    if (!previous.dueAt && !current.dueAt) {
      return 0;
    }
    if (!previous.dueAt) {
      return 1;
    }
    if (!current.dueAt) {
      return -1;
    }
    return previous.dueAt.localeCompare(current.dueAt);
  });
}
