import { Injectable, inject } from '@angular/core';
import { LogAction } from '../../core/decorators/log-action';
import { CLOCK, CREATE_ID } from '../../core/di/tokens';
import { TASK_STATUS, type Task } from '../../domain/task';
import { TaskStore } from '../../store/task';

const DEBUG_TASK_COUNT = 5000;

@Injectable({ providedIn: 'root' })
export class DebugTaskSeed {
  private readonly store = inject(TaskStore);
  private readonly clock = inject(CLOCK);
  private readonly createId = inject(CREATE_ID);

  @LogAction
  async generateFiveThousand(): Promise<void> {
    if (this.store.busy()) {
      return;
    }
    this.store.setCategory(undefined);
    this.store.setStatuses([TASK_STATUS.PENDING, TASK_STATUS.OVERDUE]);
    await this.store.upsertMany(this.createDebugTasks());
  }

  private createDebugTasks(): Task[] {
    const now = this.clock.now();
    const dueDate = this.clock.today();
    return Array.from({ length: DEBUG_TASK_COUNT }, (_, index) => ({
      id: this.createId(),
      title: `Tarea de prueba ${index + 1}`,
      status: TASK_STATUS.PENDING,
      categoryId: null,
      dueDate,
      createdAt: now,
      updatedAt: now,
    }));
  }
}
