import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CLOCK, CREATE_ID } from '../../core/di/tokens';
import { TaskStore } from '../../store/task';
import { DebugTaskSeed } from './debug-task-seed';

describe('DebugTaskSeed', () => {
  it('removes every task before seeding debug tasks', async () => {
    const removeAll = jest.fn();
    const upsertMany = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        DebugTaskSeed,
        {
          provide: TaskStore,
          useValue: {
            busy: signal(false),
            setCategory: jest.fn(),
            setStatuses: jest.fn(),
            upsertMany,
            removeAll,
          },
        },
        {
          provide: CLOCK,
          useValue: { now: () => 1, today: () => '2026-01-02' },
        },
        { provide: CREATE_ID, useValue: () => 'id' },
      ],
    });
    const seed = TestBed.inject(DebugTaskSeed);
    seed.removeAllTasks();
    expect(removeAll).toHaveBeenCalled();
  });

  it('does not write tasks while the store is busy', async () => {
    const upsertMany = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        DebugTaskSeed,
        {
          provide: TaskStore,
          useValue: {
            busy: signal(true),
            setCategory: jest.fn(),
            setStatuses: jest.fn(),
            upsertMany,
          },
        },
        {
          provide: CLOCK,
          useValue: { now: () => 1, today: () => '2026-01-02' },
        },
        { provide: CREATE_ID, useValue: () => 'id' },
      ],
    });
    await TestBed.inject(DebugTaskSeed).generateFiveThousand();
    expect(upsertMany).not.toHaveBeenCalled();
  });
});
