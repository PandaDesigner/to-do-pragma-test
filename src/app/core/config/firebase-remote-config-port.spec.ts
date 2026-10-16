import { TestBed } from '@angular/core/testing';
import * as appSdk from 'firebase/app';
import * as configSdk from 'firebase/remote-config';
import {
  FirebaseRemoteConfigPort,
  FIREBASE_CONFIG_FETCH,
} from './firebase-remote-config-port';

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

  it('loads local options, sets safe defaults and intervals, and reads an explicit remote false', async () => {
    const { request, app, config, port } = setup();
    expect(await port.fetch()).toEqual({ enable_categories: false });
    expect(request).toHaveBeenCalledWith('assets/firebase-config.json');
    expect(appSdk.initializeApp).toHaveBeenCalledWith(options, 'todo-notebook');
    expect(configSdk.getRemoteConfig).toHaveBeenCalledWith(app);
    expect(config.defaultConfig).toEqual({ enable_categories: true });
    expect(config.settings).toEqual({
      fetchTimeoutMillis: 3000,
      minimumFetchIntervalMillis: 60000,
    });
    expect(configSdk.fetchAndActivate).toHaveBeenCalledWith(config);
    expect(configSdk.getValue).toHaveBeenCalledWith(
      config,
      'enable_categories',
    );
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
      expect(await port.fetch()).toEqual({ enable_categories: expected });
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
