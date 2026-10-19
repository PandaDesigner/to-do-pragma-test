import { Injectable, inject, signal } from '@angular/core';
import { REMOTE_CONFIG_PORT } from '../di/tokens';
import {
  REMOTE_CONFIG_TIMEOUT_MS,
  type RemoteConfigPort,
} from './remote-config-port';

// El flag remoto manda en todos los builds. Antes una build de desarrollo
// encendia los debug actions siempre, ignorando Remote Config.
function resolveDebugActions(remoteValue: unknown): boolean {
  return remoteValue === true;
}

interface FlagRead {
  categoriesEnabled: boolean;
  debugActionsEnabled: boolean;
  error: string | null;
}

function isMissingConfig(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b404\b/.test(message);
}

async function readFlags(
  port: RemoteConfigPort,
  timeoutMs: number,
): Promise<FlagRead> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const pending = port.fetch().then(
    (flags) => ({ ok: true as const, flags }),
    (error: unknown) => ({ ok: false as const, error }),
  );
  try {
    const outcome = await Promise.race([
      pending,
      new Promise<{ ok: false; error: Error }>((resolve) => {
        timer = setTimeout(
          () =>
            resolve({
              ok: false,
              error: new Error(
                `La configuración remota no respondió en ${timeoutMs} ms.`,
              ),
            }),
          timeoutMs,
        );
      }),
    ]);
    if (!outcome.ok) {
      throw outcome.error;
    }
    return {
      categoriesEnabled: outcome.flags.enable_categories !== false,
      debugActionsEnabled: resolveDebugActions(
        outcome.flags.enable_debug_actions,
      ),
      error: null,
    };
  } catch (error) {
    if (isMissingConfig(error)) {
      console.info(
        'Remote Config is not configured (HTTP 404). Using defaults.',
      );
      return {
        categoriesEnabled: true,
        debugActionsEnabled: resolveDebugActions(undefined),
        error: null,
      };
    }
    const message = error instanceof Error ? error.message : String(error);
    return {
      categoriesEnabled: true,
      debugActionsEnabled: resolveDebugActions(undefined),
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
  private readonly debugActionsState = signal(resolveDebugActions(undefined));
  private readonly errorState = signal<string | null>(null);
  private readonly loadingState = signal(false);
  readonly categoriesEnabled = this.categoriesState.asReadonly();
  readonly debugActionsEnabled = this.debugActionsState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  async initialize(timeoutMs = REMOTE_CONFIG_TIMEOUT_MS): Promise<void> {
    this.loadingState.set(true);
    const flags = await readFlags(this.port, timeoutMs);
    this.categoriesState.set(flags.categoriesEnabled);
    this.debugActionsState.set(flags.debugActionsEnabled);
    this.errorState.set(flags.error);
    this.loadingState.set(false);
  }
}
