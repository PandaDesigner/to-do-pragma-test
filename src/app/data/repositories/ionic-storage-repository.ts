import { Storage } from '@ionic/storage-angular';
import { Debounce } from '../../core/decorators/debounce';
import type { Repository } from '../../domain/repository';

const WRITE_DELAY_MS = 300;

interface IdentifiedEntity {
  id: string;
}

function isIdentifiedEntity(value: unknown): value is IdentifiedEntity {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string'
  );
}

export class IonicStorageRepository<
  T extends IdentifiedEntity,
> implements Repository<T> {
  private storage?: Storage;
  private items = new Map<string, T>();

  constructor(private readonly storageKey: string) {}

  async init(storage: Storage): Promise<void> {
    await storage.create();
    const stored: unknown = await storage.get(this.storageKey);
    if (
      stored !== null &&
      stored !== undefined &&
      (!Array.isArray(stored) || !stored.every(isIdentifiedEntity))
    ) {
      throw new Error(`Invalid stored collection: ${this.storageKey}`);
    }
    const entities = (stored ?? []) as T[];
    this.items = new Map(entities.map((entity) => [entity.id, entity]));
    this.storage = storage;
  }

  async list(): Promise<readonly T[]> {
    this.requireStorage();
    return [...this.items.values()];
  }

  async save(item: T): Promise<void> {
    this.requireStorage();
    this.items.set(item.id, item);
    await this.persist();
  }

  async remove(id: string): Promise<void> {
    this.requireStorage();
    this.items.delete(id);
    await this.persist();
  }

  async clear(): Promise<void> {
    this.requireStorage();
    this.items.clear();
    await this.persist();
  }

  private requireStorage(): Storage {
    if (!this.storage) {
      throw new Error('IonicStorageRepository not initialised');
    }
    return this.storage;
  }

  @Debounce(WRITE_DELAY_MS)
  private async persist(): Promise<void> {
    await this.requireStorage().set(this.storageKey, [...this.items.values()]);
  }
}
