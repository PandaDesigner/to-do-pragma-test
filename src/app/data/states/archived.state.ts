import { TASK_STATUS, type Task } from '../../domain/task';
import {
  TASK_EVENT,
  InvalidTransitionError,
  updateTaskStatus,
  type TaskState,
  type TaskTransition,
} from '../../domain/task-state';

export class ArchivedState implements TaskState {
  readonly status = TASK_STATUS.ARCHIVED;
  readonly availableActions = Object.freeze([TASK_EVENT.RESTORE]);

  handle({ task, event, clock }: TaskTransition): Task {
    if (event !== TASK_EVENT.RESTORE) {
      throw new InvalidTransitionError(this.status, event);
    }
    return updateTaskStatus({ task, status: TASK_STATUS.PENDING, clock });
  }
}
