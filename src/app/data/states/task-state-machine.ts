import { TASK_STATUS, type Task, type TaskStatus } from '../../domain/task';
import type {
  TaskEvent,
  TaskState,
  TaskTransition,
} from '../../domain/task-state';
import { ArchivedState } from './archived.state';
import { CompletedState } from './completed.state';
import { OverdueState } from './overdue.state';
import { PendingState } from './pending.state';

export class TaskStateMachine {
  private readonly states: Record<TaskStatus, TaskState> = {
    [TASK_STATUS.PENDING]: new PendingState(),
    [TASK_STATUS.COMPLETED]: new CompletedState(),
    [TASK_STATUS.OVERDUE]: new OverdueState(),
    [TASK_STATUS.ARCHIVED]: new ArchivedState(),
  };

  transition(transition: TaskTransition): Task {
    return this.states[transition.task.status].handle(transition);
  }

  actionsFor(task: Task): readonly TaskEvent[] {
    return this.states[task.status].availableActions;
  }
}

export function transitionTask(transition: TaskTransition): Task {
  return new TaskStateMachine().transition(transition);
}
