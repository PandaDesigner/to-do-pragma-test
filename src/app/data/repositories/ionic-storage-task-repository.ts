import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { debounce } from '../../core/decorators/debounce';
import { Task } from '../../domain/task';
import { TaskRepository } from '../../domain/repository';

const STORAGE_KEY = 'todo-notebook.tasks.v1';
const DEBOUNCE_MS = 300;

@Injectable({ providedIn: 'root' })
export class IonicStorageTaskRepository implements TaskRepository {
  private storage?: Storage;
  private tasks: Task[] = [];

  async init(storage: Storage): Promise<void> {
    this.storage = storage;
    await this.storage.create();
    const stored = await this.storage.get(STORAGE_KEY);
    this.tasks = Array.isArray(stored) ? (stored as Task[]) : [];
  }

  async list(): Promise<readonly Task[]> {
    return [...this.tasks];
  }

  async save(task: Task): Promise<void> {
    const next = this.tasks.filter((existing) => existing.id !== task.id);
    next.push(task);
    this.tasks = next;
    await this.persist();
  }

  async remove(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    await this.persist();
  }

  @debounce(DEBOUNCE_MS)
  private async persist(): Promise<void> {
    if (!this.storage) {
      throw new Error('IonicStorageTaskRepository not initialised');
    }
    await this.storage.set(STORAGE_KEY, this.tasks);
  }
}
