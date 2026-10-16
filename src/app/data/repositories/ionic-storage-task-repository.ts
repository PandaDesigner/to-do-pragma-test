import { Injectable } from '@angular/core';
import type { Task } from '../../domain/task';
import { IonicStorageRepository } from './ionic-storage-repository';

@Injectable({ providedIn: 'root' })
export class IonicStorageTaskRepository extends IonicStorageRepository<Task> {
  constructor() {
    super('todo-notebook.tasks.v1');
  }
}
