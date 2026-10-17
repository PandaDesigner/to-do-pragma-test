import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { RemoteConfigService } from '../config/remote-config';

export const APP_ROUTE = {
  TASKS: '/tabs/tasks',
  CATEGORIES: '/tabs/my',
  SETTINGS: '/tabs/settings',
} as const;

export const categoriesEnabledGuard = (() => {
  const flags = inject(RemoteConfigService);
  return flags.categoriesEnabled() || inject(Router).parseUrl(APP_ROUTE.TASKS);
}) satisfies CanMatchFn;
