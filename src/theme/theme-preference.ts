export const THEME_PREFERENCE = {
  SYSTEM: 'system',
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export type ThemePreference =
  (typeof THEME_PREFERENCE)[keyof typeof THEME_PREFERENCE];

export const DARK_PALETTE_CLASS = 'ion-palette-dark';
export const LIGHT_PALETTE_CLASS = 'ion-palette-light';

const THEME_PREFERENCES = Object.values(THEME_PREFERENCE);

export function parseThemePreference(value: string | null): ThemePreference {
  if (value === null) {
    return THEME_PREFERENCE.SYSTEM;
  }
  if (!THEME_PREFERENCES.includes(value as ThemePreference)) {
    throw new Error(`Preferencia de tema desconocida: ${value}`);
  }
  return value as ThemePreference;
}

export function applyThemePreference(
  root: HTMLElement,
  preference: ThemePreference,
): void {
  root.classList.remove(DARK_PALETTE_CLASS, LIGHT_PALETTE_CLASS);
  if (preference === THEME_PREFERENCE.DARK) {
    root.classList.add(DARK_PALETTE_CLASS);
    return;
  }
  if (preference === THEME_PREFERENCE.LIGHT) {
    root.classList.add(LIGHT_PALETTE_CLASS);
  }
}
