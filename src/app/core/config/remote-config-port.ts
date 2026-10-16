export const FEATURE_FLAG = { CATEGORIES: 'enable_categories' } as const;
export const REMOTE_CONFIG_TIMEOUT_MS = 3000;

export interface RemoteConfigPort {
  fetch(): Promise<{ enable_categories?: unknown }>;
}
