import type { Repository } from '../../domain/repository';

interface IdentifiedEntity {
  id: string;
}

export class InMemoryRepository<
  T extends IdentifiedEntity,
> implements Repository<T> {
  private readonly items = new Map<string, T>();

  async list(): Promise<readonly T[]> {
    return [...this.items.values()];
  }

  async save(item: T): Promise<void> {
    this.items.set(item.id, item);
  }

  async remove(id: string): Promise<void> {
    this.items.delete(id);
  }

  async clear(): Promise<void> {
    this.items.clear();
  }
}
