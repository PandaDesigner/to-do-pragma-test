import { Injectable, inject, signal } from '@angular/core';
import { REMOTE_CONFIG_PORT } from '../di/tokens';
import {
  FEATURE_FLAG,
  REMOTE_CONFIG_TIMEOUT_MS,
  type RemoteConfigPort,
} from './remote-config-port';

interface FlagResult {
  enabled: boolean;
  error: string | null;
}

async function fetchFlagWithTimeout(
  port: RemoteConfigPort,
  timeoutMs: number,
): Promise<FlagResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve()
        .then(() => port.fetch())
        .then((flags) => ({
          enabled: flags[FEATURE_FLAG.CATEGORIES] !== false,
          error: null,
        })),
      new Promise<FlagResult>((resolve) => {
        timer = setTimeout(
          () =>
            resolve({
              enabled: true,
              error: `La configuración remota no respondió en ${timeoutMs} ms. Categorías sigue habilitado.`,
            }),
          timeoutMs,
        );
      }),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      enabled: true,
      error: `No se pudo consultar la configuración remota: ${message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private readonly port = inject(REMOTE_CONFIG_PORT);
  private readonly enabledState = signal(true);
  private readonly errorState = signal<string | null>(null);
  private readonly loadingState = signal(false);
  readonly categoriesEnabled = this.enabledState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  async isCategoriesEnabled(
    port: RemoteConfigPort,
    timeoutMs = REMOTE_CONFIG_TIMEOUT_MS,
  ): Promise<boolean> {
    return (await fetchFlagWithTimeout(port, timeoutMs)).enabled;
  }

  async initialize(): Promise<void> {
    this.loadingState.set(true);
    const flag = await fetchFlagWithTimeout(
      this.port,
      REMOTE_CONFIG_TIMEOUT_MS,
    );
    this.enabledState.set(flag.enabled);
    this.errorState.set(flag.error);
    this.loadingState.set(false);
  }
}
