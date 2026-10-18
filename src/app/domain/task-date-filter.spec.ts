import { TASK_STATUS } from './task';
import { filterTasks } from './task-strategy';
import { taskFixture } from '../testing/task.fixture';

describe('DATE-FILTER-03 Filtro por rango de fechas', () => {
  it('[DATE-FILTER-03.1] filtra por vencimiento con ambos extremos incluidos', () => {
    const tasks = [
      taskFixture({ id: 'before', dueDate: '2026-01-09' }),
      taskFixture({ id: 'from', dueDate: '2026-01-10' }),
      taskFixture({ id: 'inside', dueDate: '2026-01-12' }),
      taskFixture({ id: 'to', dueDate: '2026-01-14' }),
      taskFixture({ id: 'after', dueDate: '2026-01-15' }),
    ];
    expect(
      filterTasks(tasks, {
        statuses: [TASK_STATUS.PENDING],
        dateRange: { from: '2026-01-10', to: '2026-01-14' },
      }).map((task) => task.id),
    ).toEqual(['from', 'inside', 'to']);
  });

  it('[DATE-FILTER-03.1] un rango de un solo dia solo conserva las tareas de ese dia', () => {
    const tasks = [
      taskFixture({ id: 'previous', dueDate: '2026-01-09' }),
      taskFixture({ id: 'today', dueDate: '2026-01-10' }),
      taskFixture({ id: 'next', dueDate: '2026-01-11' }),
    ];
    expect(
      filterTasks(tasks, {
        statuses: [TASK_STATUS.PENDING],
        dateRange: { from: '2026-01-10', to: '2026-01-10' },
      }).map((task) => task.id),
    ).toEqual(['today']);
  });

  it('[DATE-FILTER-03.3] sin rango no descarta ninguna tarea por su fecha', () => {
    const tasks = [
      taskFixture({ id: 'past', dueDate: '2020-01-01' }),
      taskFixture({ id: 'future', dueDate: '2099-12-31' }),
    ];
    expect(
      filterTasks(tasks, { statuses: [TASK_STATUS.PENDING] }),
    ).toHaveLength(2);
    expect(
      filterTasks(tasks, {
        statuses: [TASK_STATUS.PENDING],
        dateRange: null,
      }),
    ).toHaveLength(2);
  });

  it('[DATE-FILTER-03.4] el rango se combina por conjuncion con estados y categoria', () => {
    const tasks = [
      taskFixture({ id: 'todo', dueDate: '2026-01-12', categoryId: 'cat-1' }),
      taskFixture({
        id: 'done',
        dueDate: '2026-01-12',
        categoryId: 'cat-1',
        status: TASK_STATUS.COMPLETED,
      }),
      taskFixture({
        id: 'other-category',
        dueDate: '2026-01-12',
        categoryId: 'cat-2',
      }),
      taskFixture({
        id: 'out-of-range',
        dueDate: '2026-01-20',
        categoryId: 'cat-1',
      }),
      taskFixture({
        id: 'complete',
        dueDate: '2026-01-12',
        categoryId: 'cat-1',
        status: TASK_STATUS.COMPLETED,
      }),
    ];
    expect(
      filterTasks(tasks, {
        statuses: [TASK_STATUS.PENDING],
        categoryId: 'cat-1',
        dateRange: { from: '2026-01-10', to: '2026-01-14' },
      }).map((task) => task.id),
    ).toEqual(['todo']);
  });
});