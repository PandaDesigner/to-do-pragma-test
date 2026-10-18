import { InjectionToken } from '@angular/core';
import type { Task } from '../../../domain/task';
import { TASK_EVENT, type TaskEvent } from '../../../domain/task-state';

export interface TaskItemState {
  readonly kind: 'task' | 'note' | 'pending';
  leading(): 'check' | 'bullet';
  showsMeta(): boolean;
  showsEdit(): boolean;
  showsDelete(): boolean;
  showsExtraActions(): boolean;
  showsSwipe(): boolean;
  toggleEvents(): readonly TaskEvent[];
}

export class TaskRowState implements TaskItemState {
  readonly kind = 'task' as const;
  leading(): 'check' {
    return 'check';
  }
  showsMeta(): boolean {
    return true;
  }
  showsEdit(): boolean {
    return true;
  }
  showsDelete(): boolean {
    return true;
  }
  showsExtraActions(): boolean {
    return true;
  }
  showsSwipe(): boolean {
    return true;
  }
  toggleEvents(): readonly TaskEvent[] {
    return [TASK_EVENT.COMPLETE, TASK_EVENT.REOPEN];
  }
}

export class NoteRowState implements TaskItemState {
  readonly kind = 'note' as const;
  leading(): 'bullet' {
    return 'bullet';
  }
  showsMeta(): boolean {
    return false;
  }
  showsEdit(): boolean {
    return true;
  }
  showsDelete(): boolean {
    return true;
  }
  showsExtraActions(): boolean {
    return true;
  }
  showsSwipe(): boolean {
    return true;
  }
  toggleEvents(): readonly TaskEvent[] {
    return [];
  }
}

export class PendingRowState implements TaskItemState {
  readonly kind = 'pending' as const;
  leading(): 'check' {
    return 'check';
  }
  showsMeta(): boolean {
    return true;
  }
  showsEdit(): boolean {
    return false;
  }
  showsDelete(): boolean {
    return false;
  }
  showsExtraActions(): boolean {
    return false;
  }
  showsSwipe(): boolean {
    return false;
  }
  toggleEvents(): readonly TaskEvent[] {
    return [TASK_EVENT.COMPLETE, TASK_EVENT.REOPEN];
  }
}

export const taskRowState = new TaskRowState();
export const noteRowState = new NoteRowState();
export const pendingRowState = new PendingRowState();

export interface TaskItemContext {
  task(): Task;
  presentation(): TaskItemState;
  disabled(): boolean;
  canToggle(): boolean;
  extraActions(): readonly TaskEvent[];
  categoryName(): string | undefined;
  showCategories(): boolean;
  resolvedCategoryIcon(): string | null;
  resolvedCategoryColor(): string | null;
  metaTitle(): string;
  labels: Record<TaskEvent, string>;
  icons: { createOutline: string; trashOutline: string };
  actionIcons: Record<TaskEvent, string>;
  emitToggle(id: string): void;
  emitEdit(task: Task): void;
  emitRemove(id: string): void;
  emitAction(event: TaskEvent): void;
}

export const TASK_ITEM = new InjectionToken<TaskItemContext>('TASK_ITEM');
