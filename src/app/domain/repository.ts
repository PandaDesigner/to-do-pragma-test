import type { Category } from './category';
import type { Task } from './task';

export interface Repository<T> {
  list(): Promise<readonly T[]>;
  save(item: T): Promise<void>;
  remove(id: string): Promise<void>;
}

export type TaskRepository = Repository<Task>;
export type CategoryRepository = Repository<Category>;
