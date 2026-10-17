export const FEATURE_FLAG = {
  CATEGORIES: 'enable_categories',
  DEBUG_ACTIONS: 'enable_debug_actions',
} as const;
export const REMOTE_CONFIG_TIMEOUT_MS = 3000;

export interface RemoteConfigPort {
  fetch(): Promise<{
    enable_categories?: unknown;
    enable_debug_actions?: unknown;
  }>;
}
