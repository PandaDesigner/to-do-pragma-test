import { TASK_STATUS, type TaskStatus } from './task';
import {
  TASK_EVENT,
  updateTaskStatus,
  InvalidTransitionError,
  type Clock,
  type TaskEvent,
  type TaskState,
} from './task-state';
import { ArchivedState } from '../data/states/archived.state';
import { CompletedState } from '../data/states/completed.state';
import { OverdueState } from '../data/states/overdue.state';
import { PendingState } from '../data/states/pending.state';
import { taskFixture } from '../testing/task.fixture';

const clock: Clock = { today: () => '2026-01-02', now: () => 100 };

interface TransitionCase {
  event: TaskEvent;
  status: TaskStatus;
}

interface StateCase {
  state: TaskState;
  status: TaskStatus;
  actions: readonly TaskEvent[];
  transitions: readonly TransitionCase[];
}

const states: readonly StateCase[] = [
  {
    state: new PendingState(),
    status: TASK_STATUS.PENDING,
    actions: [TASK_EVENT.COMPLETE, TASK_EVENT.ARCHIVE],
    transitions: [
      { event: TASK_EVENT.COMPLETE, status: TASK_STATUS.COMPLETED },
      { event: TASK_EVENT.EXPIRE, status: TASK_STATUS.OVERDUE },
      { event: TASK_EVENT.ARCHIVE, status: TASK_STATUS.ARCHIVED },
    ],
  },
  {
    state: new CompletedState(),
    status: TASK_STATUS.COMPLETED,
    actions: [TASK_EVENT.REOPEN, TASK_EVENT.ARCHIVE],
    transitions: [
      { event: TASK_EVENT.REOPEN, status: TASK_STATUS.PENDING },
      { event: TASK_EVENT.ARCHIVE, status: TASK_STATUS.ARCHIVED },
    ],
  },
  {
    state: new OverdueState(),
    status: TASK_STATUS.OVERDUE,
    actions: [TASK_EVENT.COMPLETE, TASK_EVENT.RESCHEDULE, TASK_EVENT.ARCHIVE],
    transitions: [
      { event: TASK_EVENT.COMPLETE, status: TASK_STATUS.COMPLETED },
      { event: TASK_EVENT.RESCHEDULE, status: TASK_STATUS.PENDING },
      { event: TASK_EVENT.ARCHIVE, status: TASK_STATUS.ARCHIVED },
    ],
  },
  {
    state: new ArchivedState(),
    status: TASK_STATUS.ARCHIVED,
    actions: [TASK_EVENT.RESTORE],
    transitions: [{ event: TASK_EVENT.RESTORE, status: TASK_STATUS.PENDING }],
  },
];

describe('C1 updateTaskStatus', () => {
  it('updates only status and updatedAt without mutating the task', () => {
    const task = Object.freeze(
      taskFixture({ time: '09:30', durationMin: 20, reminderMin: 5 }),
    );
    const updated = updateTaskStatus({
      task,
      status: TASK_STATUS.COMPLETED,
      clock,
    });
    expect(updated).not.toBe(task);
    expect(updated).toEqual({
      ...task,
      status: TASK_STATUS.COMPLETED,
      updatedAt: clock.now(),
    });
    expect(task.status).toBe(TASK_STATUS.PENDING);
    expect(task.updatedAt).toBe(1);
  });
});

describe.each(states)(
  'C1 TaskState $status',
  ({ state, status, actions, transitions }) => {
    it('declares its status and only its available user actions', () => {
      expect(state.status).toBe(status);
      expect(state.availableActions).toEqual(actions);
      expect(Object.isFrozen(state.availableActions)).toBe(true);
    });

    it.each(transitions)(
      'handles $event as $status',
      ({ event, status: nextStatus }) => {
        const task = Object.freeze(taskFixture({ status }));
        const next = state.handle({ task, event, clock });
        expect(next).not.toBe(task);
        expect(next).toEqual({
          ...task,
          status: nextStatus,
          updatedAt: clock.now(),
          dueDate:
            event === TASK_EVENT.RESCHEDULE ? clock.today() : task.dueDate,
        });
        expect(task).toEqual(taskFixture({ status }));
      },
    );

    const invalidEvents = Object.values(TASK_EVENT).filter(
      (event) => !transitions.some((transition) => transition.event === event),
    );
    it.each(invalidEvents)('rejects %s without mutating the task', (event) => {
      const task = Object.freeze(taskFixture({ status }));
      expect(() => state.handle({ task, event, clock })).toThrow(
        new InvalidTransitionError(status, event),
      );
      expect(task).toEqual(taskFixture({ status }));
    });
  },
);
