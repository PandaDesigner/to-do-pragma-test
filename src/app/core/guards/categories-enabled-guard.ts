import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { RemoteConfigService } from '../config/remote-config';

export const APP_ROUTE = {
  TASKS: '/tabs/tasks',
  CATEGORIES: '/tabs/category',
  SETTINGS: '/tabs/settings',
  ROUTINE: '/tabs/routine',
  EVENT: '/tabs/event',
} as const;

export const categoriesEnabledGuard = (() => {
  const flags = inject(RemoteConfigService);
  return flags.categoriesEnabled() || inject(Router).parseUrl(APP_ROUTE.TASKS);
}) satisfies CanMatchFn;
