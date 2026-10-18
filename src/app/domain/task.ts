export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  ARCHIVED: 'archived',
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
export const TASK_STATUSES = Object.values(TASK_STATUS);

export function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === 'string' &&
    (TASK_STATUSES as readonly string[]).includes(value)
  );
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  categoryId: string | null;
  dueDate: string;
  time?: string;
  durationMin?: number;
  reminderMin?: number;
  createdAt: number;
  updatedAt: number;
}
