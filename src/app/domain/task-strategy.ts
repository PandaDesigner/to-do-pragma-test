import type { Task, TaskStatus } from './task';

export type TaskFilter = {
  statuses: readonly TaskStatus[];
  categoryId?: string;
};

export const TASK_SORT = { DUE_DATE: 'dueDate' } as const;
export type TaskSorter = { kind: (typeof TASK_SORT)[keyof typeof TASK_SORT] };

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

export function sortTasksByDueDate(
  tasks: readonly Task[],
  _sorter: TaskSorter,
): Task[] {
  return [...tasks].sort((previous, current) => {
    return previous.dueDate.localeCompare(current.dueDate);
  });
}
