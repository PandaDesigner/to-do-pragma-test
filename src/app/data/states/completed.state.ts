import { TASK_STATUS, type Task } from '../../domain/task';
import {
  TASK_EVENT,
  InvalidTransitionError,
  updateTaskStatus,
  type TaskState,
  type TaskTransition,
} from '../../domain/task-state';

export class CompletedState implements TaskState {
  readonly status = TASK_STATUS.COMPLETED;
  readonly availableActions = Object.freeze([
    TASK_EVENT.REOPEN,
    TASK_EVENT.ARCHIVE,
  ]);

  handle({ task, event, clock }: TaskTransition): Task {
    switch (event) {
      case TASK_EVENT.REOPEN:
        return updateTaskStatus({ task, status: TASK_STATUS.PENDING, clock });
      case TASK_EVENT.ARCHIVE:
        return updateTaskStatus({ task, status: TASK_STATUS.ARCHIVED, clock });
      default:
        throw new InvalidTransitionError(this.status, event);
    }
  }
}
