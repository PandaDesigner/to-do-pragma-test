import { TASK_STATUS, type Task } from '../../domain/task';
import {
  TASK_EVENT,
  InvalidTransitionError,
  updateTaskStatus,
  type TaskState,
  type TaskTransition,
} from '../../domain/task-state';

export class PendingState implements TaskState {
  readonly status = TASK_STATUS.PENDING;
  readonly availableActions = Object.freeze([
    TASK_EVENT.COMPLETE,
    TASK_EVENT.ARCHIVE,
  ]);

  handle({ task, event, clock }: TaskTransition): Task {
    switch (event) {
      case TASK_EVENT.COMPLETE:
        return updateTaskStatus({ task, status: TASK_STATUS.COMPLETED, clock });
      case TASK_EVENT.ARCHIVE:
        return updateTaskStatus({ task, status: TASK_STATUS.ARCHIVED, clock });
      case TASK_EVENT.EXPIRE:
        if (task.dueDate >= clock.today()) {
          throw new InvalidTransitionError(this.status, event);
        }
        return updateTaskStatus({ task, status: TASK_STATUS.OVERDUE, clock });
      default:
        throw new InvalidTransitionError(this.status, event);
    }
  }
}
