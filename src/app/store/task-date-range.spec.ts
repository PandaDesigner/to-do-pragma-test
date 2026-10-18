import { TestBed } from '@angular/core/testing';
import { CLOCK, TASK_REPOSITORY } from '../core/di/tokens';
import { InMemoryRepository } from '../data/repositories/in-memory-repository';
import { TASK_STATUS, type Task } from '../domain/task';
import { taskFixture } from '../testing/task.fixture';
import { TaskStore } from './task';

describe('DATE-FILTER-03 Rango de fechas en el store', () => {
  function setup() {
    const repository = new InMemoryRepository<Task>();
    TestBed.configureTestingModule({
      providers: [
        TaskStore,
        { provide: TASK_REPOSITORY, useValue: repository },
        {
          provide: CLOCK,
          useValue: { today: () => '2026-01-02', now: () => 100 },
        },
      ],
    });
    return { repository, store: TestBed.inject(TaskStore) };
  }

  async function seed(repository: InMemoryRepository<Task>): Promise<void> {
    await Promise.all(
      [
        taskFixture({ id: 'before', dueDate: '2026-01-01' }),
        taskFixture({ id: 'first', dueDate: '2026-01-02' }),
        taskFixture({ id: 'last', dueDate: '2026-01-04' }),
        taskFixture({ id: 'after', dueDate: '2026-01-06' }),
      ].map((task) => repository.save(task)),
    );
  }

  it('[DATE-FILTER-03.2] arranca sin rango de fechas', async () => {
    const { repository, store } = setup();
    await seed(repository);
    await store.refresh();
    expect(store.dateRange()).toBeNull();
  });

  it('[DATE-FILTER-03.1] guarda el rango y filtra visibleTasks', async () => {
    const { repository, store } = setup();
    await seed(repository);
    await store.refresh();
    store.setDateRange({ from: '2026-01-02', to: '2026-01-04' });
    expect(store.dateRange()).toEqual({
      from: '2026-01-02',
      to: '2026-01-04',
    });
    expect(store.filteredTasks().map((task) => task.id)).toEqual([
      'first',
      'last',
    ]);
  });

  it('[DATE-FILTER-03.2] el rango restablece la paginacion a la primera pagina', async () => {
    const { repository, store } = setup();
    await Promise.all(
      Array.from({ length: 8 }, (_, index) =>
        repository.save(
          taskFixture({
            id: `t${index}`,
            dueDate: `2026-02-${String(index + 1).padStart(2, '0')}`,
          }),
        ),
      ),
    );
    await store.refresh();
    store.setPage(2);
    expect(store.pageCount()).toBe(2);
    store.setDateRange({ from: '2026-02-01', to: '2026-02-02' });
    expect(store.pageCount()).toBe(1);
    expect(store.visibleTasks().map((task) => task.id)).toEqual(['t0', 't1']);
  });

  it('[DATE-FILTER-03.1] un rango de null quita el filtro de fecha', async () => {
    const { repository, store } = setup();
    await seed(repository);
    await store.refresh();
    store.setDateRange({ from: '2026-01-02', to: '2026-01-02' });
    expect(store.filteredTasks().map((task) => task.id)).toEqual(['first']);
    store.setDateRange(null);
    expect(store.dateRange()).toBeNull();
    expect(store.filteredTasks()).toHaveLength(4);
  });

  it('[DATE-FILTER-03.4] el rango se combina con el filtro de estados', async () => {
    const { repository, store } = setup();
    await Promise.all([
      repository.save(
        taskFixture({
          id: 'pending-in',
          dueDate: '2026-01-02',
          status: TASK_STATUS.PENDING,
        }),
      ),
      repository.save(
        taskFixture({
          id: 'done-in',
          dueDate: '2026-01-02',
          status: TASK_STATUS.COMPLETED,
        }),
      ),
      repository.save(
        taskFixture({
          id: 'pending-out',
          dueDate: '2026-01-08',
          status: TASK_STATUS.PENDING,
        }),
      ),
    ]);
    await store.refresh();
    store.setDateRange({ from: '2026-01-01', to: '2026-01-05' });
    store.setStatuses([TASK_STATUS.PENDING]);
    expect(store.filteredTasks().map((task) => task.id)).toEqual(['pending-in']);
  });
});