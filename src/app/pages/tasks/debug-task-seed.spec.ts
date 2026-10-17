import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CLOCK, CREATE_ID } from '../../core/di/tokens';
import { TaskStore } from '../../store/task';
import { DebugTaskSeed } from './debug-task-seed';

describe('DebugTaskSeed', () => {
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
