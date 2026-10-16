import { TASK_STATUS, type TaskStatus } from '../../domain/task';
import {
  TASK_EVENT,
  InvalidTransitionError,
  type Clock,
  type TaskEvent,
} from '../../domain/task-state';
import { taskFixture } from '../../testing/task.fixture';
import { TaskStateMachine, transitionTask } from './task-state-machine';

const clock: Clock = { now: () => 42, today: () => '2026-01-02' };
const validTransitions: readonly (readonly [
  TaskStatus,
  TaskEvent,
  TaskStatus,
])[] = [
  [TASK_STATUS.PENDING, TASK_EVENT.COMPLETE, TASK_STATUS.COMPLETED],
  [TASK_STATUS.PENDING, TASK_EVENT.EXPIRE, TASK_STATUS.OVERDUE],
  [TASK_STATUS.PENDING, TASK_EVENT.ARCHIVE, TASK_STATUS.ARCHIVED],
  [TASK_STATUS.COMPLETED, TASK_EVENT.REOPEN, TASK_STATUS.PENDING],
  [TASK_STATUS.COMPLETED, TASK_EVENT.ARCHIVE, TASK_STATUS.ARCHIVED],
  [TASK_STATUS.OVERDUE, TASK_EVENT.COMPLETE, TASK_STATUS.COMPLETED],
  [TASK_STATUS.OVERDUE, TASK_EVENT.RESCHEDULE, TASK_STATUS.PENDING],
  [TASK_STATUS.OVERDUE, TASK_EVENT.ARCHIVE, TASK_STATUS.ARCHIVED],
  [TASK_STATUS.ARCHIVED, TASK_EVENT.RESTORE, TASK_STATUS.PENDING],
];

describe('APP-01 TaskStateMachine', () => {
  const machine = new TaskStateMachine();

  it.each(validTransitions)(
    '%s handles %s as %s without mutation',
    (status, event, nextStatus) => {
      const task = Object.freeze(
        taskFixture({ status, time: '09:30', durationMin: 20, reminderMin: 5 }),
      );
      const next = machine.transition({ task, event, clock });
      expect(next).not.toBe(task);
      expect(next).toEqual({
        ...task,
        status: nextStatus,
        updatedAt: 42,
        dueDate: event === TASK_EVENT.RESCHEDULE ? clock.today() : task.dueDate,
      });
      expect(task.status).toBe(status);
      expect(task.updatedAt).toBe(1);
    },
  );

  for (const status of Object.values(TASK_STATUS)) {
    for (const event of Object.values(TASK_EVENT)) {
      if (
        validTransitions.some(
          ([from, allowedEvent]) => from === status && allowedEvent === event,
        )
      ) {
        continue;
      }
      it(`rejects ${status} + ${event} without mutation`, () => {
        const task = Object.freeze(taskFixture({ status }));
        expect(() => machine.transition({ task, event, clock })).toThrow(
          InvalidTransitionError,
        );
        expect(() => machine.transition({ task, event, clock })).toThrow(
          `Invalid task transition: ${status} + ${event}`,
        );
        expect(task).toEqual(taskFixture({ status }));
      });
    }
  }

  it.each(['2026-01-02', '2026-01-03'])(
    'rejects EXPIRE when dueDate is %s',
    (dueDate) => {
      const task = Object.freeze(taskFixture({ dueDate }));
      expect(() =>
        machine.transition({ task, event: TASK_EVENT.EXPIRE, clock }),
      ).toThrow(InvalidTransitionError);
      expect(task.status).toBe(TASK_STATUS.PENDING);
    },
  );

  it.each([
    [TASK_STATUS.PENDING, [TASK_EVENT.COMPLETE, TASK_EVENT.ARCHIVE]],
    [TASK_STATUS.COMPLETED, [TASK_EVENT.REOPEN, TASK_EVENT.ARCHIVE]],
    [
      TASK_STATUS.OVERDUE,
      [TASK_EVENT.COMPLETE, TASK_EVENT.RESCHEDULE, TASK_EVENT.ARCHIVE],
    ],
    [TASK_STATUS.ARCHIVED, [TASK_EVENT.RESTORE]],
  ] as const)('exposes only user actions for %s', (status, actions) => {
    expect(machine.actionsFor(taskFixture({ status }))).toEqual(actions);
  });

  it('provides the event-based transitionTask entry point', () => {
    expect(
      transitionTask({ task: taskFixture(), event: TASK_EVENT.COMPLETE, clock })
        .status,
    ).toBe(TASK_STATUS.COMPLETED);
  });
});
