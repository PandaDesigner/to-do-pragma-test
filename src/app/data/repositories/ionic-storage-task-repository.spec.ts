import { IonicStorageTaskRepository } from './ionic-storage-task-repository';
import { Task } from '../../domain/task';
import { taskFixture } from '../../testing/task.fixture';

function makeStorageStub(): {
  store: Map<string, unknown>;
  api: {
    create: () => Promise<void>;
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<void>;
  };
} {
  const store = new Map<string, unknown>();
  return {
    store,
    api: {
      async create() {
        return;
      },
      async get(key: string) {
        return store.get(key);
      },
      async set(key: string, value: unknown) {
        store.set(key, value);
      },
    },
  };
}

describe('IonicStorageTaskRepository', () => {
  it('persists tasks after debounce and reads them back', async () => {
    const stub = makeStorageStub();
    const repository = new IonicStorageTaskRepository();
    await repository.init(stub.api as never);

    const task: Task = taskFixture({ id: 't-1' });
    await repository.save(task);
    expect(stub.store.get('todo-notebook.tasks.v1')).toBeUndefined();
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(stub.store.get('todo-notebook.tasks.v1')).toEqual([task]);

    const list = await repository.list();
    expect(list).toEqual([task]);
  });

  it('coalesces three save calls into a single write within 300 ms', async () => {
    const stub = makeStorageStub();
    const repository = new IonicStorageTaskRepository();
    await repository.init(stub.api as never);

    let writes = 0;
    const original = stub.api.set;
    stub.api.set = (async (key: string, value: unknown) => {
      if (key === 'todo-notebook.tasks.v1') {
        writes += 1;
      }
      await original.call(stub.api, key, value);
    }) as never;

    for (let index = 0; index < 3; index += 1) {
      await repository.save(
        taskFixture({
          id: `t-${index}`,
          title: `Task ${index}`,
        }),
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(writes).toBe(1);
    expect(await repository.list()).toHaveLength(3);
  });

  it('removes tasks and clears the stored list after debounce', async () => {
    const stub = makeStorageStub();
    const repository = new IonicStorageTaskRepository();
    await repository.init(stub.api as never);

    const task: Task = taskFixture({ id: 't-1' });
    await repository.save(task);
    await new Promise((resolve) => setTimeout(resolve, 350));

    await repository.remove('t-1');
    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(stub.store.get('todo-notebook.tasks.v1')).toEqual([]);
  });
});
