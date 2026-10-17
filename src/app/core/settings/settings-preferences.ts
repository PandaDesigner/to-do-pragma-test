import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  applyThemePreference,
  parseThemePreference,
  THEME_PREFERENCE,
  type ThemePreference,
} from '../../../theme/theme-preference';
import {
  APP_LANGUAGE,
  languageFromDevice,
  parseAppLanguage,
  type AppLanguage,
} from './app-language';

export const SETTINGS_KEY = {
  THEME: 'todo-notebook.settings.theme',
  LANGUAGE: 'todo-notebook.settings.language',
} as const;

export const DEVICE_LANGUAGE = new InjectionToken<string>('DEVICE_LANGUAGE', {
  factory: () => navigator.language,
});

export const SYSTEM_DARK = new InjectionToken<boolean>('SYSTEM_DARK', {
  factory: () => window.matchMedia('(prefers-color-scheme: dark)').matches,
});

function storedText(value: unknown, key: string): string | null {
  if (value == null) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new Error(`Ajuste inválido en ${key}`);
  }
  return value;
}

@Injectable({ providedIn: 'root' })
export class SettingsPreferences {
  private readonly storage = inject(Storage);
  private readonly translate = inject(TranslateService);
  private readonly deviceLanguage = inject(DEVICE_LANGUAGE);
  readonly theme = signal<ThemePreference>(THEME_PREFERENCE.SYSTEM);
  readonly language = signal<AppLanguage>(APP_LANGUAGE.EN);

  async load(): Promise<void> {
    const storedTheme = storedText(
      await this.storage.get(SETTINGS_KEY.THEME),
      SETTINGS_KEY.THEME,
    );
    const storedLanguage = storedText(
      await this.storage.get(SETTINGS_KEY.LANGUAGE),
      SETTINGS_KEY.LANGUAGE,
    );
    const theme = parseThemePreference(storedTheme);
    const language = storedLanguage
      ? parseAppLanguage(storedLanguage)
      : languageFromDevice(this.deviceLanguage);
    this.theme.set(theme);
    this.language.set(language);
    applyThemePreference(document.documentElement, theme);
    this.translate.setFallbackLang(APP_LANGUAGE.EN);
    await firstValueFrom(this.translate.use(language));
  }

  async setTheme(preference: ThemePreference): Promise<void> {
    await this.storage.set(SETTINGS_KEY.THEME, preference);
    this.theme.set(preference);
    applyThemePreference(document.documentElement, preference);
  }

  async setLanguage(language: AppLanguage): Promise<void> {
    await this.storage.set(SETTINGS_KEY.LANGUAGE, language);
    this.language.set(language);
    await firstValueFrom(this.translate.use(language));
  }
}
