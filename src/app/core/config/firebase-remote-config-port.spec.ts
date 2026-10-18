import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TestBed } from '@angular/core/testing';
import * as appSdk from 'firebase/app';
import * as configSdk from 'firebase/remote-config';
import { environment } from '../../../environments/environment';
import {
  FirebaseRemoteConfigPort,
  FIREBASE_CONFIG_FETCH,
} from './firebase-remote-config-port';

jest.mock('../../../environments/environment', () => ({
  environment: {
    production: true,
    remoteConfigFetchIntervalMs: 60_000,
  },
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(),
}));
jest.mock('firebase/remote-config', () => ({
  isSupported: jest.fn(),
  getRemoteConfig: jest.fn(),
  fetchAndActivate: jest.fn(),
  getValue: jest.fn(),
}));

describe('FirebaseRemoteConfigPort', () => {
  const options = {
    apiKey: 'test-key',
    projectId: 'test-project',
    appId: 'test-app',
    messagingSenderId: '123',
  };
  beforeEach(() => jest.resetAllMocks());

  function setup() {
    const request = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => options });
    const app = { name: 'todo-notebook' } as appSdk.FirebaseApp;
    const config = {
      defaultConfig: {},
      settings: {},
    } as configSdk.RemoteConfig;
    jest.mocked(appSdk.getApps).mockReturnValue([]);
    jest.mocked(appSdk.initializeApp).mockReturnValue(app);
    jest.mocked(configSdk.isSupported).mockResolvedValue(true);
    jest.mocked(configSdk.getRemoteConfig).mockReturnValue(config);
    jest.mocked(configSdk.fetchAndActivate).mockResolvedValue(true);
    jest.mocked(configSdk.getValue).mockReturnValue({
      getSource: () => 'remote',
      asString: () => 'false',
      asBoolean: () => false,
      asNumber: () => 0,
    });
    TestBed.configureTestingModule({
      providers: [
        FirebaseRemoteConfigPort,
        { provide: FIREBASE_CONFIG_FETCH, useValue: request },
      ],
    });
    return {
      request,
      app,
      config,
      port: TestBed.inject(FirebaseRemoteConfigPort),
    };
  }

  it('[RC-03] defaults debug actions to false and categories to true', async () => {
    const { config, port } = setup();
    jest.mocked(configSdk.getValue).mockImplementation((_remote, key) => ({
      getSource: () => (key === 'enable_categories' ? 'remote' : 'default'),
      asString: () => (key === 'enable_categories' ? 'false' : 'false'),
      asBoolean: () => false,
      asNumber: () => 0,
    }));
    expect(await port.fetch()).toEqual({
      enable_categories: false,
      enable_debug_actions: false,
    });
    expect(config.defaultConfig).toEqual({
      enable_categories: true,
      enable_debug_actions: false,
    });
  });

  it('[RC-03] enables debug actions only for an explicit remote true', async () => {
    const { port } = setup();
    jest.mocked(configSdk.getValue).mockImplementation((_remote, key) => ({
      getSource: () => 'remote',
      asString: () => (key === 'enable_debug_actions' ? 'true' : 'true'),
      asBoolean: () => true,
      asNumber: () => 1,
    }));
    expect(await port.fetch()).toEqual({
      enable_categories: true,
      enable_debug_actions: true,
    });
  });

  it('loads local options, sets safe defaults and intervals, and reads an explicit remote false', async () => {
    const { request, app, config, port } = setup();
    expect(await port.fetch()).toEqual({
      enable_categories: false,
      enable_debug_actions: false,
    });
    expect(request).toHaveBeenCalledWith('assets/firebase-config.json');
    expect(appSdk.initializeApp).toHaveBeenCalledWith(options, 'todo-notebook');
    expect(configSdk.getRemoteConfig).toHaveBeenCalledWith(app);
    expect(config.defaultConfig).toEqual({
      enable_categories: true,
      enable_debug_actions: false,
    });
    expect(config.settings).toEqual({
      fetchTimeoutMillis: 3000,
      minimumFetchIntervalMillis: 60000,
    });
    expect(configSdk.fetchAndActivate).toHaveBeenCalledTimes(1);
    expect(configSdk.fetchAndActivate).toHaveBeenCalledWith(config);
    expect(configSdk.getValue).toHaveBeenCalledWith(
      config,
      'enable_categories',
    );
  });

  it('[ENV-01.6] reads the build mode from environment, not isDevMode', () => {
    const portSource = readFileSync(
      resolve(__dirname, 'firebase-remote-config-port.ts'),
      'utf8',
    );
    const serviceSource = readFileSync(
      resolve(__dirname, 'remote-config.ts'),
      'utf8',
    );
    expect(portSource).not.toContain('isDevMode');
    expect(serviceSource).not.toContain('isDevMode');
    expect(serviceSource).toContain('environment.production');
  });

  it('[RC-06.1] uses environment.remoteConfigFetchIntervalMs as minimumFetchIntervalMillis', async () => {
    const { config, port } = setup();
    await port.fetch();
    expect(config.settings.minimumFetchIntervalMillis).toBe(
      environment.remoteConfigFetchIntervalMs,
    );
    expect(
      readFileSync(
        resolve(__dirname, 'firebase-remote-config-port.ts'),
        'utf8',
      ),
    ).toContain('environment.remoteConfigFetchIntervalMs');
  });

  it('[RC-06.3] keeps the 3000 ms timeout and safe defaults', async () => {
    const { config, port } = setup();
    await port.fetch();
    expect(config.settings.fetchTimeoutMillis).toBe(3000);
    expect(config.defaultConfig).toEqual({
      enable_categories: true,
      enable_debug_actions: false,
    });
  });

  it('[RC-06.5] calls fetchAndActivate exactly once per fetch', async () => {
    const { port } = setup();
    await port.fetch();
    expect(configSdk.fetchAndActivate).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['remote', 'true', true],
    ['remote', 'FALSE', false],
    ['remote', '0', true],
    ['default', 'false', true],
    ['static', '', true],
  ] as const)(
    'recognizes only an explicit remote false (%s, %s)',
    async (source, value, expected) => {
      const { app, port } = setup();
      jest.mocked(appSdk.getApps).mockReturnValue([app]);
      jest.mocked(configSdk.getValue).mockReturnValue({
        getSource: () => source,
        asString: () => value,
        asBoolean: () => false,
        asNumber: () => 0,
      });
      const debug =
        source === 'remote' && value.trim().toLowerCase() === 'true';
      expect(await port.fetch()).toEqual({
        enable_categories: expected,
        enable_debug_actions: debug,
      });
      expect(appSdk.initializeApp).not.toHaveBeenCalled();
    },
  );

  it('rejects unsupported browsers and propagates SDK network failures', async () => {
    const { port } = setup();
    jest.mocked(configSdk.isSupported).mockResolvedValueOnce(false);
    await expect(port.fetch()).rejects.toThrow('no está disponible');
    jest
      .mocked(configSdk.fetchAndActivate)
      .mockRejectedValueOnce(new Error('network down'));
    await expect(port.fetch()).rejects.toThrow('network down');
  });

  it.each([null, {}, { ...options, apiKey: '' }])(
    'rejects malformed local configuration',
    async (configuration) => {
      const { request, port } = setup();
      request.mockResolvedValue({ ok: true, json: async () => configuration });
      await expect(port.fetch()).rejects.toThrow('configuración Firebase');
      expect(appSdk.initializeApp).not.toHaveBeenCalled();
    },
  );

  it('reports missing configuration and malformed JSON without creating an app', async () => {
    const { request, port } = setup();
    request.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(port.fetch()).rejects.toThrow('HTTP 404');
    request.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('invalid JSON');
      },
    });
    await expect(port.fetch()).rejects.toThrow('invalid JSON');
    expect(appSdk.initializeApp).not.toHaveBeenCalled();
  });
});
