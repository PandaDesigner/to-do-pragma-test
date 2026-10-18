import type { AppEnvironment } from './app-environment';

export type { AppEnvironment };

export const environment: AppEnvironment = {
  production: true,
  remoteConfigFetchIntervalMs: 60_000,
};
