import { InMemoryRepository } from './in-memory-repository';
import type { Category } from '../../domain/category';
import { CATEGORY_SECTION } from '../../domain/category/category-section';

describe('Category repository migration', () => {
  it('[DATA-SEC-01.1] legacy categories without section load as general without losing data', async () => {
    const repository = new InMemoryRepository<Category>();
    await repository.save({
      id: 'legacy',
      name: 'Vieja',
      kind: 'list',
      colorToken: 'my',
      icon: 'list',
    });
    const items = await repository.list();
    expect(items[0].section).toBeUndefined();
    expect(items[0].name).toBe('Vieja');
  });

  it('explicit sections survive a round trip', async () => {
    const repository = new InMemoryRepository<Category>();
    await repository.save({
      id: 'gym',
      name: 'Gym',
      kind: 'daily',
      colorToken: 'event',
      icon: 'list',
      section: CATEGORY_SECTION.ROUTINE,
    });
    const items = await repository.list();
    expect(items[0].section).toBe(CATEGORY_SECTION.ROUTINE);
  });
});

describe('Repository clear', () => {
  it('in-memory repository empties its list after clear', async () => {
    const repository = new InMemoryRepository<Category>();
    await repository.save({
      id: 'a',
      name: 'A',
      kind: 'list',
      colorToken: 'my',
      icon: 'list',
    });
    await repository.save({
      id: 'b',
      name: 'B',
      kind: 'list',
      colorToken: 'my',
      icon: 'list',
    });
    expect(await repository.list()).toHaveLength(2);
    await repository.clear();
    expect(await repository.list()).toEqual([]);
  });

  it('ionic storage repository empties its list and persists after clear', async () => {
    const { IonicStorageRepository } =
      await import('./ionic-storage-repository');
    const backing = new Map<string, unknown>();
    const fakeStorage = {
      create: async () => undefined,
      get: async <T>(key: string): Promise<T | null> =>
        backing.has(key) ? (backing.get(key) as T) : null,
      set: async <T>(key: string, value: T) => {
        backing.set(key, value as unknown);
      },
    };
    const repository = new IonicStorageRepository<Category>('test.clear');
    await repository.init(fakeStorage as never);
    await repository.save({
      id: 'a',
      name: 'A',
      kind: 'list',
      colorToken: 'my',
      icon: 'list',
    });
    await repository.save({
      id: 'b',
      name: 'B',
      kind: 'list',
      colorToken: 'my',
      icon: 'list',
    });
    await repository.clear();
    expect(await repository.list()).toEqual([]);
    const persisted =
      (await fakeStorage.get<readonly Category[]>('test.clear')) ?? null;
    expect(persisted).toEqual([]);
  });
});
