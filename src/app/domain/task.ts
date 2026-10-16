export const TASK_STATUSES = [
  'pending',
  'completed',
  'overdue',
  'archived',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === 'string' &&
    (TASK_STATUSES as readonly string[]).includes(value)
  );
}

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  categoryId?: string;
  dueAt?: string;
};

const ALLOWED_TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
  pending: ['completed', 'overdue'],
  completed: ['pending'],
  overdue: ['pending', 'completed', 'archived'],
  archived: [],
};

export function transitionTask(task: Task, next: TaskStatus): Task {
  if (!ALLOWED_TRANSITIONS[task.status].includes(next)) {
    throw new Error(`Invalid task transition: ${task.status} -> ${next}`);
  }
  return { ...task, status: next };
}
