import {
  Injectable,
  importProvidersFrom,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { IonicStorageTaskRepository } from '../../data/repositories/ionic-storage-task-repository';
import { IonicStorageCategoryRepository } from '../../data/repositories/ionic-storage-category-repository';
import { SettingsPreferences } from '../settings/settings-preferences';
import { CATEGORY_REPOSITORY, TASK_REPOSITORY } from './tokens';

@Injectable({ providedIn: 'root' })
export class StorageInitializer {
  private readonly platform = inject(Platform);
  private readonly storage = inject(Storage);
  private readonly tasks = inject(IonicStorageTaskRepository);
  private readonly categories = inject(IonicStorageCategoryRepository);
  private readonly settings = inject(SettingsPreferences);

  async initialize(): Promise<void> {
    await this.platform.ready();
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.tasks.init(this.storage);
    await this.categories.init(this.storage);
    await this.settings.load();
  }
}

export function provideLocalRepositories() {
  return makeEnvironmentProviders([
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: 'todo-notebook',
        driverOrder: [
          CordovaSQLiteDriver._driver,
          Drivers.IndexedDB,
          Drivers.LocalStorage,
        ],
      }),
    ),
    { provide: TASK_REPOSITORY, useExisting: IonicStorageTaskRepository },
    {
      provide: CATEGORY_REPOSITORY,
      useExisting: IonicStorageCategoryRepository,
    },
    provideAppInitializer(() => inject(StorageInitializer).initialize()),
  ]);
}
