import { Storage } from '@ionic/storage-angular';
import { IonicStorageTaskRepository } from './ionic-storage-task-repository';
import { IonicStorageCategoryRepository } from './ionic-storage-category-repository';
import { taskFixture } from '../../testing/task.fixture';
import { CATEGORY_KIND, type Category } from '../../domain/category';

describe('durable Storage collections', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function storageStub() {
    const persisted = new Map<string, unknown>();
    const storage = new Storage();
    jest.spyOn(storage, 'create').mockResolvedValue(storage);
    jest
      .spyOn(storage, 'get')
      .mockImplementation(async (key) => persisted.get(key) ?? null);
    const write = jest
      .spyOn(storage, 'set')
      .mockImplementation(async (key, value: unknown) => {
        persisted.set(key, value);
      });
    return { storage, write };
  }

  it('coalesces 5,000 saves into one durable write', async () => {
    const { storage, write } = storageStub();
    const repository = new IonicStorageTaskRepository();
    await repository.init(storage);
    const writes = Array.from({ length: 5000 }, (_, index) =>
      repository.save(taskFixture({ id: String(index) })),
    );
    await jest.advanceTimersByTimeAsync(300);
    await Promise.all(writes);
    expect(write).toHaveBeenCalledTimes(1);
    expect(await repository.list()).toHaveLength(5000);
    expect(write.mock.calls[0][1]).toHaveLength(5000);
  });

  it('restores tasks and categories in new instances without mixing keys', async () => {
    const { storage, write } = storageStub();
    const tasks = new IonicStorageTaskRepository();
    const categories = new IonicStorageCategoryRepository();
    await tasks.init(storage);
    await categories.init(storage);
    const task = taskFixture();
    const category: Category = {
      id: 'c',
      name: 'Lista',
      kind: CATEGORY_KIND.LIST,
      icon: 'list',
      colorToken: 'primary',
    };
    const writes = [tasks.save(task), categories.save(category)];
    await jest.advanceTimersByTimeAsync(299);
    expect(write).not.toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(1);
    await Promise.all(writes);
    const reloadedTasks = new IonicStorageTaskRepository();
    const reloadedCategories = new IonicStorageCategoryRepository();
    await reloadedTasks.init(storage);
    await reloadedCategories.init(storage);
    expect(await reloadedTasks.list()).toEqual([task]);
    expect(await reloadedCategories.list()).toEqual([category]);
  });

  it('rejects before initialization, on corrupt storage and failed initialization', async () => {
    const repository = new IonicStorageTaskRepository();
    await expect(repository.list()).rejects.toThrow('not initialised');
    await expect(repository.save(taskFixture())).rejects.toThrow(
      'not initialised',
    );
    await expect(repository.remove('missing')).rejects.toThrow(
      'not initialised',
    );
    const { storage } = storageStub();
    jest.spyOn(storage, 'get').mockResolvedValue('invalid');
    await expect(repository.init(storage)).rejects.toThrow(
      'Invalid stored collection',
    );
    jest.spyOn(storage, 'get').mockResolvedValue([{ title: 'missing id' }]);
    await expect(repository.init(storage)).rejects.toThrow(
      'Invalid stored collection',
    );
    jest.spyOn(storage, 'create').mockRejectedValue(new Error('unavailable'));
    await expect(repository.init(storage)).rejects.toThrow('unavailable');
  });

  it('propagates failed writes and persists a manual retry', async () => {
    const { storage, write } = storageStub();
    const repository = new IonicStorageTaskRepository();
    await repository.init(storage);
    write.mockRejectedValueOnce(new Error('full'));
    const failed = expect(repository.save(taskFixture())).rejects.toThrow(
      'full',
    );
    await jest.advanceTimersByTimeAsync(300);
    await failed;
    const retry = repository.save(taskFixture());
    await jest.advanceTimersByTimeAsync(300);
    await retry;
    const removal = repository.remove(taskFixture().id);
    await jest.advanceTimersByTimeAsync(300);
    await removal;
    expect(await repository.list()).toEqual([]);
    expect(write).toHaveBeenLastCalledWith('todo-notebook.tasks.v1', []);
  });
});
