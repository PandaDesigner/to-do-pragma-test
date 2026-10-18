import type { Task, TaskStatus } from './task';

export type TaskFilter = {
  statuses: readonly TaskStatus[];
  categoryId?: string | null;
  dateRange?: TaskDateRange | null;
};

/**
 * Rango de fechas ISO local YYYY-MM-DD, inclusivo en ambos extremos. Se
 * compara por string porque el ancho fijo de ISO hace que el orden
 * lexicografico coincida con el cronologico, sin desfase de zona horaria.
 */
export type TaskDateRange = {
  from: string;
  to: string;
};

export const TASK_SORT = { DUE_DATE: 'dueDate' } as const;
export type TaskSorter = { kind: (typeof TASK_SORT)[keyof typeof TASK_SORT] };

export function taskInDateRange(
  dueDate: string,
  range: TaskDateRange | null | undefined,
): boolean {
  if (!range) {
    return true;
  }
  return dueDate >= range.from && dueDate <= range.to;
}

export function filterTasks(
  tasks: readonly Task[],
  { statuses, categoryId, dateRange }: TaskFilter,
): Task[] {
  return tasks.filter((task) => {
    if (!statuses.includes(task.status)) {
      return false;
    }
    if (categoryId !== undefined && task.categoryId !== categoryId) {
      return false;
    }
    if (!taskInDateRange(task.dueDate, dateRange)) {
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
