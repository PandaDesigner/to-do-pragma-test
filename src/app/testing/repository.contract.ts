import type { Repository } from '../domain/repository';

interface IdentifiedEntity {
  id: string;
}

interface RepositoryContract<T extends IdentifiedEntity> {
  name: string;
  createRepository: () => Promise<Repository<T>>;
  first: T;
  second: T;
  updatedFirst: T;
}

export function repositoryContract<T extends IdentifiedEntity>({
  name,
  createRepository,
  first,
  second,
  updatedFirst,
}: RepositoryContract<T>): void {
  describe(name, () => {
    it('starts empty', async () => {
      const repository = await createRepository();
      expect(await repository.list()).toEqual([]);
    });

    it('saves and lists distinct items', async () => {
      const repository = await createRepository();
      await repository.save(first);
      await repository.save(second);
      expect(await repository.list()).toEqual([first, second]);
    });

    it('upserts by id without duplicating an item', async () => {
      const repository = await createRepository();
      await repository.save(first);
      await repository.save(updatedFirst);
      expect(await repository.list()).toEqual([updatedFirst]);
    });

    it('removes only the requested item and tolerates missing ids', async () => {
      const repository = await createRepository();
      await repository.save(first);
      await repository.save(second);
      await repository.remove(first.id);
      await repository.remove(first.id);
      expect(await repository.list()).toEqual([second]);
    });

    it('returns independent collection snapshots', async () => {
      const repository = await createRepository();
      await repository.save(first);
      const snapshot = await repository.list();
      await repository.save(second);
      expect(snapshot).toEqual([first]);
      expect(await repository.list()).not.toBe(snapshot);
    });
  });
}
