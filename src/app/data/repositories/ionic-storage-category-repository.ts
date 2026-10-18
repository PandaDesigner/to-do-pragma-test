import { Injectable } from '@angular/core';
import type { Category } from '../../domain/category';
import { IonicStorageRepository } from './ionic-storage-repository';

@Injectable({ providedIn: 'root' })
export class IonicStorageCategoryRepository extends IonicStorageRepository<Category> {
  constructor() {
    super('todo-notebook.categories.v1');
  }
}
