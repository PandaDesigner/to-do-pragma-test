import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((module) => module.HomePage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/tasks/tasks.page').then((m) => m.TasksPage),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.page').then(
        (m) => m.CategoriesPage,
      ),
  },
];
