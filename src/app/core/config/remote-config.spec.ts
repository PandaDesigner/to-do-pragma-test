import { TestBed } from '@angular/core/testing';
import { REMOTE_CONFIG_PORT } from '../di/tokens';
import { RemoteConfigService } from './remote-config';
import type { RemoteConfigPort } from './remote-config-port';

describe('RemoteConfigService', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

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
      expect(await service.isCategoriesEnabled(port)).toBe(value !== false);
      expect(jest.getTimerCount()).toBe(0);
    },
  );

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
    const enabled = service.isCategoriesEnabled(port, 10);
    await jest.advanceTimersByTimeAsync(10);
    expect(await enabled).toBe(true);
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
      expect(fetch).toHaveBeenCalledTimes(1);
      await service.initialize();
      expect(service.categoriesEnabled()).toBe(false);
      expect(service.error()).toBeNull();
      expect(fetch).toHaveBeenCalledTimes(2);
    },
  );
});
