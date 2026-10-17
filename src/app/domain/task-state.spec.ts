import { TASK_STATUS, type Task } from './task';
import {
  TASK_EVENT,
  updateTaskStatus,
  InvalidTransitionError,
  type Clock,
} from './task-state';
import { TaskStateMachine } from '../data/states/task-state-machine';

const FIXED_CLOCK: Clock = {
  today: () => '2026-01-15',
  now: () => 1_700_000_000_000,
};

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Sample',
    status: TASK_STATUS.PENDING,
    categoryId: null,
    dueDate: '2026-01-20',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

describe('updateTaskStatus', () => {
  it('returns a new task with the requested status and updated updatedAt', () => {
    const task = makeTask();
    const updated = updateTaskStatus({
      task,
      status: TASK_STATUS.COMPLETED,
      clock: FIXED_CLOCK,
    });
    expect(updated.status).toBe(TASK_STATUS.COMPLETED);
    expect(updated.updatedAt).toBe(FIXED_CLOCK.now());
    expect(updated.id).toBe(task.id);
    expect(updated.title).toBe(task.title);
  });
});

describe('TaskStateMachine', () => {
  const machine = new TaskStateMachine();

  describe('PENDING', () => {
    const pending = makeTask();

    it('exposes COMPLETE and ARCHIVE', () => {
      expect(machine.actionsFor(pending)).toEqual([
        TASK_EVENT.COMPLETE,
        TASK_EVENT.ARCHIVE,
      ]);
    });

    it('transitions to COMPLETED on COMPLETE', () => {
      const next = machine.transition({
        task: pending,
        event: TASK_EVENT.COMPLETE,
        clock: FIXED_CLOCK,
      });
      expect(next.status).toBe(TASK_STATUS.COMPLETED);
    });

    it('transitions to ARCHIVED on ARCHIVE', () => {
      const next = machine.transition({
        task: pending,
        event: TASK_EVENT.ARCHIVE,
        clock: FIXED_CLOCK,
      });
      expect(next.status).toBe(TASK_STATUS.ARCHIVED);
    });

    it('rejects RESTORE', () => {
      expect(() =>
        machine.transition({
          task: pending,
          event: TASK_EVENT.RESTORE,
          clock: FIXED_CLOCK,
        }),
      ).toThrow(InvalidTransitionError);
    });
  });

  describe('COMPLETED', () => {
    const completed = makeTask({ status: TASK_STATUS.COMPLETED });

    it('exposes REOPEN and ARCHIVE', () => {
      expect(machine.actionsFor(completed)).toEqual([
        TASK_EVENT.REOPEN,
        TASK_EVENT.ARCHIVE,
      ]);
    });

    it('rejects COMPLETE', () => {
      expect(() =>
        machine.transition({
          task: completed,
          event: TASK_EVENT.COMPLETE,
          clock: FIXED_CLOCK,
        }),
      ).toThrow(InvalidTransitionError);
    });
  });

  describe('OVERDUE', () => {
    const overdue = makeTask({ status: TASK_STATUS.OVERDUE });

    it('exposes COMPLETE, RESCHEDULE and ARCHIVE', () => {
      expect(machine.actionsFor(overdue)).toEqual([
        TASK_EVENT.COMPLETE,
        TASK_EVENT.RESCHEDULE,
        TASK_EVENT.ARCHIVE,
      ]);
    });

    it('transitions to COMPLETED on COMPLETE', () => {
      const next = machine.transition({
        task: overdue,
        event: TASK_EVENT.COMPLETE,
        clock: FIXED_CLOCK,
      });
      expect(next.status).toBe(TASK_STATUS.COMPLETED);
    });
  });

  describe('ARCHIVED', () => {
    const archived = makeTask({ status: TASK_STATUS.ARCHIVED });

    it('exposes RESTORE only', () => {
      expect(machine.actionsFor(archived)).toEqual([TASK_EVENT.RESTORE]);
    });

    it('rejects COMPLETE and ARCHIVE', () => {
      expect(() =>
        machine.transition({
          task: archived,
          event: TASK_EVENT.COMPLETE,
          clock: FIXED_CLOCK,
        }),
      ).toThrow(InvalidTransitionError);
      expect(() =>
        machine.transition({
          task: archived,
          event: TASK_EVENT.ARCHIVE,
          clock: FIXED_CLOCK,
        }),
      ).toThrow(InvalidTransitionError);
    });
  });
});
