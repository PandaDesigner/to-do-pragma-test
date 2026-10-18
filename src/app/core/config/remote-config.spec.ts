import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { REMOTE_CONFIG_PORT } from '../di/tokens';
import { RemoteConfigService } from './remote-config';
import type { RemoteConfigPort } from './remote-config-port';

jest.mock('../../../environments/environment', () => ({
  environment: {
    production: true,
    remoteConfigFetchIntervalMs: 60_000,
  },
}));

describe('RemoteConfigService', () => {
  beforeEach(() => {
    environment.production = true;
    jest.useFakeTimers();
  });
  afterEach(() => {
    environment.production = true;
    jest.useRealTimers();
  });

  function setup(port: RemoteConfigPort) {
    TestBed.configureTestingModule({
      providers: [
        RemoteConfigService,
        { provide: REMOTE_CONFIG_PORT, useValue: port },
      ],
    });
    return TestBed.inject(RemoteConfigService);
  }

  it.each([false, true, undefined, 'false', 0])(
    'disables categories only for boolean false (%s)',
    async (value) => {
      const port = {
        fetch: jest.fn().mockResolvedValue({ enable_categories: value }),
      };
      const service = setup(port);
      await service.initialize();
      expect(service.categoriesEnabled()).toBe(value !== false);
      expect(jest.getTimerCount()).toBe(0);
    },
  );

  it('[RC-01] reads both flags with one fetch and times out once', async () => {
    const fetch = jest.fn(
      () => new Promise<{ enable_categories: boolean }>(() => undefined),
    );
    const service = setup({ fetch });
    const pending = service.initialize();
    await jest.advanceTimersByTimeAsync(3000);
    await pending;
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(service.categoriesEnabled()).toBe(true);
    expect(service.debugActionsEnabled()).toBe(false);
    expect(service.error()).toContain('3000');
  });

  it.each([undefined, false, 'true', 1, null])(
    '[RC-02] keeps debug actions off for %s',
    async (value) => {
      const service = setup({
        fetch: async () => ({ enable_debug_actions: value }),
      });
      expect(service.debugActionsEnabled()).toBe(false);
      await service.initialize();
      expect(service.debugActionsEnabled()).toBe(false);
    },
  );

  it('enables debug actions in a development build', async () => {
    environment.production = false;
    const info = jest
      .spyOn(console, 'info')
      .mockImplementation(() => undefined);
    const service = setup({
      fetch: async () => {
        throw new Error('Falta la configuración Firebase local (HTTP 404).');
      },
    });
    expect(service.debugActionsEnabled()).toBe(true);
    await service.initialize();
    expect(service.debugActionsEnabled()).toBe(true);
    expect(service.categoriesEnabled()).toBe(true);
    info.mockRestore();
  });

  it('[RC-06.4] applies a newly published value on the next production start', async () => {
    environment.production = true;
    const fetch = jest
      .fn()
      .mockResolvedValueOnce({ enable_debug_actions: false })
      .mockResolvedValueOnce({ enable_debug_actions: true });
    const service = setup({ fetch });
    await service.initialize();
    expect(service.debugActionsEnabled()).toBe(false);
    await service.initialize();
    expect(service.debugActionsEnabled()).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('[RC-02] enables debug actions only for boolean true', async () => {
    const service = setup({
      fetch: async () => ({ enable_debug_actions: true }),
    });
    await service.initialize();
    expect(service.debugActionsEnabled()).toBe(true);
  });

  it('[RC-02] leaves debug actions off when the fetch fails', async () => {
    const service = setup({
      fetch: jest.fn().mockRejectedValue(new Error('offline')),
    });
    await service.initialize();
    expect(service.categoriesEnabled()).toBe(true);
    expect(service.debugActionsEnabled()).toBe(false);
    expect(service.error()).toContain('offline');
  });

  it('[RC-04] treats HTTP 404 as missing remote config', async () => {
    const info = jest
      .spyOn(console, 'info')
      .mockImplementation(() => undefined);
    const service = setup({
      fetch: jest
        .fn()
        .mockRejectedValue(
          new Error('Falta la configuración Firebase local (HTTP 404).'),
        ),
    });
    await service.initialize();
    expect(service.categoriesEnabled()).toBe(true);
    expect(service.debugActionsEnabled()).toBe(false);
    expect(service.error()).toBeNull();
    expect(info).toHaveBeenCalledTimes(1);
    info.mockRestore();
  });

  it('[RC-05] keeps an error when remote config responds with HTTP 500', async () => {
    const info = jest
      .spyOn(console, 'info')
      .mockImplementation(() => undefined);
    const service = setup({
      fetch: jest.fn().mockRejectedValue(new Error('HTTP 500')),
    });
    await service.initialize();
    expect(service.categoriesEnabled()).toBe(true);
    expect(service.debugActionsEnabled()).toBe(false);
    expect(service.error()).toContain('500');
    expect(info).not.toHaveBeenCalled();
    info.mockRestore();
  });

  it('defaults debug actions to false for missing keys', async () => {
    const port = { fetch: async () => ({}) };
    const service = setup(port);
    await service.initialize();
    expect(service.debugActionsEnabled()).toBe(false);
  });

  it('disables debug actions only for boolean false', async () => {
    const port = {
      fetch: jest.fn().mockResolvedValue({ enable_debug_actions: false }),
    };
    const service = setup(port);
    await service.initialize();
    expect(service.debugActionsEnabled()).toBe(false);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('defaults to true for missing keys', async () => {
    const port = { fetch: async () => ({}) };
    const service = setup(port);
    await service.initialize();
    expect(service.categoriesEnabled()).toBe(true);
    expect(service.error()).toBeNull();
    expect(service.loading()).toBe(false);
  });

  it('bounds initialization to 3 seconds, reports timeout and ignores late results', async () => {
    let respond!: (flags: { enable_categories: boolean }) => void;
    const port = {
      fetch: () =>
        new Promise<{ enable_categories: boolean }>((resolve) => {
          respond = resolve;
        }),
    };
    const service = setup(port);
    const initialization = service.initialize();
    expect(service.loading()).toBe(true);
    await jest.advanceTimersByTimeAsync(2999);
    expect(service.loading()).toBe(true);
    await jest.advanceTimersByTimeAsync(1);
    await initialization;
    expect(service.categoriesEnabled()).toBe(true);
    expect(service.error()).toContain('3000');
    expect(service.loading()).toBe(false);
    respond({ enable_categories: false });
    await Promise.resolve();
    expect(service.categoriesEnabled()).toBe(true);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('accepts a test timeout and never leaks a late rejection', async () => {
    let reject!: (reason: Error) => void;
    const port = {
      fetch: () =>
        new Promise<never>((_resolve, onFailure) => {
          reject = onFailure;
        }),
    };
    const service = setup(port);
    const pending = service.initialize(10);
    await jest.advanceTimersByTimeAsync(10);
    await pending;
    expect(service.categoriesEnabled()).toBe(true);
    reject(new Error('late network error'));
    await Promise.resolve();
  });

  it.each([new Error('offline'), 'unavailable'])(
    'reports fetch failure and supports explicit retry',
    async (failure) => {
      const fetch = jest
        .fn()
        .mockRejectedValueOnce(failure)
        .mockResolvedValue({ enable_categories: false });
      const service = setup({ fetch });
      await service.initialize();
      expect(service.categoriesEnabled()).toBe(true);
      expect(service.error()).toContain(
        failure instanceof Error ? failure.message : failure,
      );
      expect(fetch).toHaveBeenCalled();
      await service.initialize();
      expect(service.categoriesEnabled()).toBe(false);
      expect(service.error()).toBeNull();
      expect(fetch).toHaveBeenCalledTimes(2);
    },
  );
});
