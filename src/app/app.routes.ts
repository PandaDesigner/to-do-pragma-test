import { Routes } from '@angular/router';
import {
  APP_ROUTE,
  categoriesEnabledGuard,
} from './core/guards/categories-enabled-guard';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () =>
      import('./layout/shell/shell.component').then(
        (module) => module.ShellComponent,
      ),
    children: [
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks/tasks.page').then((module) => module.TasksPage),
      },
      {
        path: 'my',
        canMatch: [categoriesEnabledGuard],
        loadComponent: () =>
          import('./pages/categories/categories.page').then(
            (module) => module.CategoriesPage,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then(
            (module) => module.SettingsPage,
          ),
      },
      { path: '', redirectTo: APP_ROUTE.TASKS, pathMatch: 'full' },
    ],
  },
  { path: 'home', redirectTo: APP_ROUTE.TASKS, pathMatch: 'full' },
  { path: 'tasks', redirectTo: APP_ROUTE.TASKS, pathMatch: 'full' },
  { path: 'categories', redirectTo: APP_ROUTE.CATEGORIES, pathMatch: 'full' },
  { path: 'settings', redirectTo: APP_ROUTE.SETTINGS, pathMatch: 'full' },
  { path: '', redirectTo: APP_ROUTE.TASKS, pathMatch: 'full' },
];
