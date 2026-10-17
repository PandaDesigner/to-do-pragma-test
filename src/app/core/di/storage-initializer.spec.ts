import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import { StorageInitializer } from './storage-initializer';
import { IonicStorageTaskRepository } from '../../data/repositories/ionic-storage-task-repository';
import { IonicStorageCategoryRepository } from '../../data/repositories/ionic-storage-category-repository';

describe('Storage initialization', () => {
  function setup() {
    const storage = {
      create: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue(null),
      defineDriver: jest.fn().mockResolvedValue(undefined),
    };
    const ready = jest.fn().mockResolvedValue('dom');
    TestBed.configureTestingModule({
      providers: [
        StorageInitializer,
        IonicStorageTaskRepository,
        IonicStorageCategoryRepository,
        { provide: Storage, useValue: storage },
        { provide: Platform, useValue: { ready } },
      ],
    });
    return { storage, ready, initializer: TestBed.inject(StorageInitializer) };
  }

  it('waits for the platform, registers SQLite and initializes both collections', async () => {
    const { storage, ready, initializer } = setup();
    await initializer.initialize();
    expect(ready).toHaveBeenCalledTimes(1);
    expect(storage.defineDriver).toHaveBeenCalledWith(
      expect.objectContaining({ _driver: expect.any(String) }),
    );
    expect(storage.get.mock.calls).toEqual([
      ['todo-notebook.tasks.v1'],
      ['todo-notebook.categories.v1'],
    ]);
    expect(await TestBed.inject(IonicStorageTaskRepository).list()).toEqual([]);
    expect(await TestBed.inject(IonicStorageCategoryRepository).list()).toEqual(
      [],
    );
  });

  it('does not hide driver initialization failures', async () => {
    const { storage, initializer } = setup();
    storage.defineDriver.mockRejectedValueOnce(new Error('driver unavailable'));
    await expect(initializer.initialize()).rejects.toThrow(
      'driver unavailable',
    );
    expect(storage.get).not.toHaveBeenCalled();
  });
});
