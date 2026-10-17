import {
  applyThemePreference,
  DARK_PALETTE_CLASS,
  LIGHT_PALETTE_CLASS,
  parseThemePreference,
  THEME_PREFERENCE,
} from './theme-preference';

describe('UI-22 theme preference', () => {
  it('[UI-22.2] treats a missing stored preference as the system', () => {
    expect(parseThemePreference(null)).toBe(THEME_PREFERENCE.SYSTEM);
  });

  it('[UI-22.1] applies the dark class for a stored dark preference', () => {
    const root = document.createElement('html');
    applyThemePreference(root, parseThemePreference(THEME_PREFERENCE.DARK));
    expect(root.classList.contains(DARK_PALETTE_CLASS)).toBe(true);
    expect(root.classList.contains(LIGHT_PALETTE_CLASS)).toBe(false);
  });

  it('[UI-22.3] removes the dark class for a stored light preference', () => {
    const root = document.createElement('html');
    root.classList.add(DARK_PALETTE_CLASS);
    applyThemePreference(root, parseThemePreference(THEME_PREFERENCE.LIGHT));
    expect(root.classList.contains(DARK_PALETTE_CLASS)).toBe(false);
    expect(root.classList.contains(LIGHT_PALETTE_CLASS)).toBe(true);
  });

  it('rejects an unknown stored preference', () => {
    expect(() => parseThemePreference('sepia')).toThrow(
      'Preferencia de tema desconocida: sepia',
    );
  });
});
