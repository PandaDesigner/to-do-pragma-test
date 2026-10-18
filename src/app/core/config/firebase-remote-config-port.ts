import { Injectable, InjectionToken, inject, isDevMode } from '@angular/core';
import type { FirebaseOptions } from 'firebase/app';
import {
  FEATURE_FLAG,
  REMOTE_CONFIG_TIMEOUT_MS,
  type RemoteConfigPort,
} from './remote-config-port';

const FIREBASE_APP_NAME = 'todo-notebook';
const FIREBASE_CONFIG_PATH = 'assets/firebase-config.json';
const REQUIRED_CONFIG_FIELDS = [
  'apiKey',
  'projectId',
  'appId',
  'messagingSenderId',
] as const;
const FETCH_INTERVAL = { DEVELOPMENT: 60_000, PRODUCTION: 3_600_000 } as const;

export const FIREBASE_CONFIG_FETCH = new InjectionToken<typeof fetch>(
  'FIREBASE_CONFIG_FETCH',
  {
    factory:
      () =>
      (...args) =>
        globalThis.fetch(...args),
  },
);

async function loadFirebaseOptions(
  request: typeof fetch,
): Promise<FirebaseOptions> {
  const response = await request(FIREBASE_CONFIG_PATH);
  if (!response.ok) {
    throw new Error(
      `Falta la configuración Firebase local (HTTP ${response.status}).`,
    );
  }
  const parsed: unknown = await response.json();
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('La configuración Firebase debe ser un objeto.');
  }
  const configuration = parsed as Record<string, unknown>;
  const invalid = REQUIRED_CONFIG_FIELDS.some((field) => {
    const value = configuration[field];
    return typeof value !== 'string' || value.trim().length === 0;
  });
  if (invalid) {
    throw new Error('La configuración Firebase está incompleta.');
  }
  return configuration as FirebaseOptions;
}

@Injectable({ providedIn: 'root' })
export class FirebaseRemoteConfigPort implements RemoteConfigPort {
  private readonly request = inject(FIREBASE_CONFIG_FETCH);

  async fetch(): Promise<{
    enable_categories: boolean;
    enable_debug_actions: boolean;
  }> {
    const options = await loadFirebaseOptions(this.request);
    const [appSdk, configSdk] = await Promise.all([
      import('firebase/app'),
      import('firebase/remote-config'),
    ]);
    if (!(await configSdk.isSupported())) {
      throw new Error('Remote Config no está disponible en este navegador.');
    }
    const app =
      appSdk
        .getApps()
        .find((candidate) => candidate.name === FIREBASE_APP_NAME) ??
      appSdk.initializeApp(options, FIREBASE_APP_NAME);
    const config = configSdk.getRemoteConfig(app);
    config.defaultConfig = {
      [FEATURE_FLAG.CATEGORIES]: true,
      [FEATURE_FLAG.DEBUG_ACTIONS]: false,
    };
    config.settings = {
      fetchTimeoutMillis: REMOTE_CONFIG_TIMEOUT_MS,
      minimumFetchIntervalMillis: isDevMode()
        ? FETCH_INTERVAL.DEVELOPMENT
        : FETCH_INTERVAL.PRODUCTION,
    };
    await configSdk.fetchAndActivate(config);
    return {
      [FEATURE_FLAG.CATEGORIES]:
        remoteText(configSdk, config, FEATURE_FLAG.CATEGORIES) !== 'false',
      [FEATURE_FLAG.DEBUG_ACTIONS]:
        remoteText(configSdk, config, FEATURE_FLAG.DEBUG_ACTIONS) === 'true',
    };
  }
}

function remoteText(
  sdk: typeof import('firebase/remote-config'),
  config: ReturnType<typeof import('firebase/remote-config').getRemoteConfig>,
  key: string,
): string | null {
  const value = sdk.getValue(config, key);
  if (value.getSource() !== 'remote') {
    return null;
  }
  return value.asString().trim().toLowerCase();
}
