import type { Category } from '../category';
import type { Task } from '../task';
import { CATEGORY_SECTION } from './category-section';
import { filterTasksBySection } from './filter-by-section';

const home: Category = {
  id: 'home',
  name: 'Casa',
  kind: 'list',
  colorToken: 'my',
  icon: 'list',
  section: CATEGORY_SECTION.GENERAL,
};
const gym: Category = {
  id: 'gym',
  name: 'Gym',
  kind: 'daily',
  colorToken: 'event',
  icon: 'list',
  section: CATEGORY_SECTION.ROUTINE,
};
const meeting: Category = {
  id: 'meeting',
  name: 'Reunión',
  kind: 'list',
  colorToken: 'routine',
  icon: 'list',
  section: CATEGORY_SECTION.EVENT,
};
const categories: readonly Category[] = [home, gym, meeting];

const buyBread: Task = {
  id: '1',
  title: 'Comprar pan',
  status: 'pending',
  dueDate: '2026-02-23',
  categoryId: 'home',
  createdAt: 0,
  updatedAt: 0,
};
const run: Task = {
  id: '2',
  title: 'Correr 5k',
  status: 'pending',
  dueDate: '2026-02-23',
  categoryId: 'gym',
  createdAt: 0,
  updatedAt: 0,
};
const demo: Task = {
  id: '3',
  title: 'Demo cliente',
  status: 'pending',
  dueDate: '2026-02-23',
  categoryId: 'meeting',
  createdAt: 0,
  updatedAt: 0,
};
const callMom: Task = {
  id: '4',
  title: 'Llamar a mamá',
  status: 'pending',
  dueDate: '2026-02-23',
  categoryId: null,
  createdAt: 0,
  updatedAt: 0,
};
const tasks: readonly Task[] = [buyBread, run, demo, callMom];

describe('filterTasksBySection', () => {
  it('[CAT-SEC-01.1] treats a category without section as general', () => {
    const legacy: Category = {
      id: 'legacy',
      name: 'Vieja',
      kind: 'list',
      colorToken: 'my',
      icon: 'list',
    };
    const visible = filterTasksBySection(
      [{ ...buyBread, categoryId: 'legacy' }],
      [legacy],
      CATEGORY_SECTION.GENERAL,
    );
    expect(visible).toHaveLength(1);
  });

  it('[NAV-SEC-01.1] general shows general categories and uncategorized tasks', () => {
    expect(
      filterTasksBySection(tasks, categories, CATEGORY_SECTION.GENERAL).map(
        (task) => task.id,
      ),
    ).toEqual(['1', '4']);
  });

  it('[NAV-SEC-01.2] routine keeps only routine tasks', () => {
    expect(
      filterTasksBySection(tasks, categories, CATEGORY_SECTION.ROUTINE).map(
        (task) => task.id,
      ),
    ).toEqual(['2']);
  });

  it('[NAV-SEC-01.3] event keeps only event tasks', () => {
    expect(
      filterTasksBySection(tasks, categories, CATEGORY_SECTION.EVENT).map(
        (task) => task.id,
      ),
    ).toEqual(['3']);
  });

  it('[CAT-SEC-02.1] moving a category moves its tasks between sections', () => {
    const movedGym: Category = { ...gym, section: CATEGORY_SECTION.EVENT };
    const visible = filterTasksBySection(
      tasks,
      [home, movedGym, meeting],
      CATEGORY_SECTION.EVENT,
    );
    expect(visible.map((task) => task.id)).toEqual(['2', '3']);
    expect(
      filterTasksBySection(
        tasks,
        [home, movedGym, meeting],
        CATEGORY_SECTION.ROUTINE,
      ),
    ).toEqual([]);
  });

  it('[NAV-SEC-02.1] returns an empty list when a section has no categories', () => {
    expect(filterTasksBySection(tasks, [home], CATEGORY_SECTION.EVENT)).toEqual(
      [],
    );
  });

  it('returns every task when the catalog is empty', () => {
    const loose: Task = { ...buyBread, id: 'loose', categoryId: null };
    const assigned: Task = { ...buyBread, id: 'assigned', categoryId: 'home' };
    const stored = [loose, assigned];
    expect(
      filterTasksBySection(stored, [], CATEGORY_SECTION.GENERAL).map(
        (task) => task.id,
      ),
    ).toEqual(['loose', 'assigned']);
    expect(
      filterTasksBySection(stored, [], CATEGORY_SECTION.ROUTINE).map(
        (task) => task.id,
      ),
    ).toEqual(['loose', 'assigned']);
    expect(
      filterTasksBySection(stored, [], CATEGORY_SECTION.EVENT).map(
        (task) => task.id,
      ),
    ).toEqual(['loose', 'assigned']);
  });

  it('ignores a category id that no longer exists in the catalog', () => {
    const stale: Task = { ...run, categoryId: 'deleted' };
    expect(
      filterTasksBySection([stale], categories, CATEGORY_SECTION.ROUTINE),
    ).toEqual([]);
  });
});
