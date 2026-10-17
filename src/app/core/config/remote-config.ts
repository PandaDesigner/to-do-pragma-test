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

async function readFlag(
  port: RemoteConfigPort,
  flag: (typeof FEATURE_FLAG)[keyof typeof FEATURE_FLAG],
  timeoutMs: number = REMOTE_CONFIG_TIMEOUT_MS,
): Promise<FlagResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve()
        .then(() => port.fetch())
        .then((flags) => ({
          enabled: flags[flag] !== false,
          error: null,
        })),
      new Promise<FlagResult>((resolve) => {
        timer = setTimeout(
          () =>
            resolve({
              enabled: true,
              error: `La configuración remota no respondió en ${timeoutMs} ms. ${flag} sigue habilitado.`,
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
  private readonly categoriesState = signal(true);
  private readonly debugActionsState = signal(true);
  private readonly errorState = signal<string | null>(null);
  private readonly loadingState = signal(false);
  readonly categoriesEnabled = this.categoriesState.asReadonly();
  readonly debugActionsEnabled = this.debugActionsState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  async isCategoriesEnabled(
    port: RemoteConfigPort,
    timeoutMs = REMOTE_CONFIG_TIMEOUT_MS,
  ): Promise<boolean> {
    const flagResult = await readFlag(port, FEATURE_FLAG.CATEGORIES, timeoutMs);
    return flagResult.enabled;
  }

  async isDebugActionsEnabled(
    port: RemoteConfigPort,
    timeoutMs = REMOTE_CONFIG_TIMEOUT_MS,
  ): Promise<boolean> {
    const flagResult = await readFlag(
      port,
      FEATURE_FLAG.DEBUG_ACTIONS,
      timeoutMs,
    );
    return flagResult.enabled;
  }

  async initialize(): Promise<void> {
    this.loadingState.set(true);
    const [categories, debugActions] = await Promise.all([
      readFlag(this.port, FEATURE_FLAG.CATEGORIES),
      readFlag(this.port, FEATURE_FLAG.DEBUG_ACTIONS),
    ]);
    this.categoriesState.set(categories.enabled);
    this.debugActionsState.set(debugActions.enabled);
    this.errorState.set(categories.error ?? debugActions.error);
    this.loadingState.set(false);
  }
}
