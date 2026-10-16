import { TASK_STATUS, type Task } from '../../domain/task';
import {
  TASK_EVENT,
  InvalidTransitionError,
  updateTaskStatus,
  type TaskState,
  type TaskTransition,
} from '../../domain/task-state';

export class OverdueState implements TaskState {
  readonly status = TASK_STATUS.OVERDUE;
  readonly availableActions = Object.freeze([
    TASK_EVENT.COMPLETE,
    TASK_EVENT.RESCHEDULE,
    TASK_EVENT.ARCHIVE,
  ]);

  handle({ task, event, clock }: TaskTransition): Task {
    switch (event) {
      case TASK_EVENT.COMPLETE:
        return updateTaskStatus({ task, status: TASK_STATUS.COMPLETED, clock });
      case TASK_EVENT.RESCHEDULE:
        return updateTaskStatus({
          task: { ...task, dueDate: clock.today() },
          status: TASK_STATUS.PENDING,
          clock,
        });
      case TASK_EVENT.ARCHIVE:
        return updateTaskStatus({ task, status: TASK_STATUS.ARCHIVED, clock });
      default:
        throw new InvalidTransitionError(this.status, event);
    }
  }
}
