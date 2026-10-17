import { Routes } from '@angular/router';
import {
  APP_ROUTE,
  categoriesEnabledGuard,
} from './core/guards/categories-enabled-guard';
import { CATEGORY_SECTION } from './domain/category';
import { ROUTE_DATA } from './core/di/tokens';

const loadTasksPage = () =>
  import('./pages/tasks/tasks.page').then((module) => module.TasksPage);

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
        providers: [
          {
            provide: ROUTE_DATA,
            useValue: { categorySection: CATEGORY_SECTION.GENERAL },
          },
        ],
        loadComponent: loadTasksPage,
      },
      {
        path: 'routine',
        canMatch: [categoriesEnabledGuard],
        data: { categorySection: CATEGORY_SECTION.ROUTINE },
        providers: [
          {
            provide: ROUTE_DATA,
            useValue: { categorySection: CATEGORY_SECTION.ROUTINE },
          },
        ],
        loadComponent: loadTasksPage,
      },
      {
        path: 'event',
        canMatch: [categoriesEnabledGuard],
        data: { categorySection: CATEGORY_SECTION.EVENT },
        providers: [
          {
            provide: ROUTE_DATA,
            useValue: { categorySection: CATEGORY_SECTION.EVENT },
          },
        ],
        loadComponent: loadTasksPage,
      },
      {
        path: 'category',
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
