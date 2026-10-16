import type { Task, TaskStatus } from './task';

export const TASK_EVENT = {
  COMPLETE: 'COMPLETE',
  EXPIRE: 'EXPIRE',
  ARCHIVE: 'ARCHIVE',
  REOPEN: 'REOPEN',
  RESCHEDULE: 'RESCHEDULE',
  RESTORE: 'RESTORE',
} as const;
export type TaskEvent = (typeof TASK_EVENT)[keyof typeof TASK_EVENT];

export interface Clock {
  now(): number;
  today(): string;
}

export interface TaskTransition {
  task: Task;
  event: TaskEvent;
  clock: Clock;
}

export interface TaskState {
  readonly status: TaskStatus;
  readonly availableActions: readonly TaskEvent[];
  handle(transition: TaskTransition): Task;
}

export class InvalidTransitionError extends Error {
  constructor(status: TaskStatus, event: TaskEvent) {
    super(`Invalid task transition: ${status} + ${event}`);
    this.name = 'InvalidTransitionError';
  }
}

interface TaskStatusUpdate {
  task: Task;
  status: TaskStatus;
  clock: Clock;
}

export function updateTaskStatus({
  task,
  status,
  clock,
}: TaskStatusUpdate): Task {
  return { ...task, status, updatedAt: clock.now() };
}
