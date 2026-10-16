import { Storage } from '@ionic/storage-angular';
import { CATEGORY_KIND, type Category } from './category';
import { TASK_STATUS, type Task } from './task';
import type { TaskRepository } from './repository';
import { taskFixture } from '../testing/task.fixture';
import { repositoryContract } from '../testing/repository.contract';
import { InMemoryRepository } from '../data/repositories/in-memory-repository';
import { IonicStorageTaskRepository } from '../data/repositories/ionic-storage-task-repository';

async function storageTaskRepository(): Promise<TaskRepository> {
  const storage = new Storage();
  jest.spyOn(storage, 'create').mockResolvedValue(storage);
  jest.spyOn(storage, 'get').mockResolvedValue(null);
  jest.spyOn(storage, 'set').mockResolvedValue(undefined);
  const repository = new IonicStorageTaskRepository();
  await repository.init(storage);
  return repository;
}

describe('APP-04 Repository contracts', () => {
  afterEach(() => jest.restoreAllMocks());

  const first = taskFixture({ id: 'first' });
  const second = taskFixture({ id: 'second', status: TASK_STATUS.COMPLETED });
  const updatedFirst = { ...first, title: 'Updated' };

  repositoryContract<Task>({
    name: 'InMemory task repository',
    createRepository: async () => new InMemoryRepository<Task>(),
    first,
    second,
    updatedFirst,
  });
  repositoryContract<Task>({
    name: 'Ionic Storage task repository with mocked storage',
    createRepository: storageTaskRepository,
    first,
    second,
    updatedFirst,
  });

  const category: Category = {
    id: 'daily',
    name: 'Daily',
    kind: CATEGORY_KIND.DAILY,
    icon: 'list',
    colorToken: 'todo',
  };
  repositoryContract<Category>({
    name: 'InMemory category repository',
    createRepository: async () => new InMemoryRepository<Category>(),
    first: category,
    second: { ...category, id: 'shopping', kind: CATEGORY_KIND.SHOPPING },
    updatedFirst: { ...category, name: 'Renamed' },
  });
});
