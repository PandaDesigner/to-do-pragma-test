import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  APP_LANGUAGE,
  type AppLanguage,
} from '../../core/settings/app-language';
import {
  SettingsPreferences,
  SYSTEM_DARK,
} from '../../core/settings/settings-preferences';
import {
  THEME_PREFERENCE,
  type ThemePreference,
} from '../../../theme/theme-preference';
import { SettingsPage } from './settings.page';
import { DebugTaskSeed } from '../tasks/debug-task-seed';
import { RemoteConfigService } from '../../core/config/remote-config';
import en from '../../../assets/i18n/en.json';
import es from '../../../assets/i18n/es.json';

describe('SettingsPage', () => {
  function setup(options: { debugActionsEnabled?: boolean } = {}) {
    const theme = signal<ThemePreference>(THEME_PREFERENCE.SYSTEM);
    const language = signal<AppLanguage>(APP_LANGUAGE.EN);
    const debugActionsEnabled = signal(options.debugActionsEnabled ?? true);
    const preferences = {
      theme: theme.asReadonly(),
      language: language.asReadonly(),
      setTheme: jest.fn(async (value: ThemePreference) => {
        theme.set(value);
      }),
      setLanguage: jest.fn(async (value: AppLanguage) => {
        language.set(value);
        await firstValueFrom(TestBed.inject(TranslateService).use(value));
      }),
    };
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService({ fallbackLang: APP_LANGUAGE.EN }),
        { provide: SettingsPreferences, useValue: preferences },
        { provide: SYSTEM_DARK, useValue: false },
        {
          provide: DebugTaskSeed,
          useValue: {
            generateFiveThousand: jest.fn().mockResolvedValue(undefined),
            removeAllTasks: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: RemoteConfigService,
          useValue: {
            debugActionsEnabled: debugActionsEnabled.asReadonly(),
          },
        },
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(APP_LANGUAGE.EN, en);
    translate.setTranslation(APP_LANGUAGE.ES, es);
    translate.use(APP_LANGUAGE.EN);
    const fixture = TestBed.createComponent(SettingsPage);
    fixture.detectChanges();
    return { fixture, preferences };
  }

  it.each([
    [APP_LANGUAGE.EN, 'English'],
    [APP_LANGUAGE.ES, 'Español'],
  ] as const)(
    '[I18N-01.1] keeps %s visibly selected after remounting Settings',
    async (language, label) => {
      const { fixture, preferences } = setup();
      await fixture.componentInstance.setLanguage(language);
      fixture.destroy();
      const returned = TestBed.createComponent(SettingsPage);
      returned.detectChanges();
      await returned.whenStable();
      returned.detectChanges();
      const select = returned.nativeElement.querySelector(
        'select',
      ) as HTMLSelectElement;
      expect(preferences.language()).toBe(language);
      expect(select.value).toBe(language);
      expect(select.selectedOptions[0]?.textContent?.trim()).toBe(label);
      returned.destroy();
    },
  );

  it('[SET-01.1] shows the dark mode control and language selector', () => {
    const { fixture } = setup();
    const page: HTMLElement = fixture.nativeElement;
    expect(page.textContent).toContain('Dark mode');
    expect(page.querySelector('ion-toggle')).not.toBeNull();
    expect(page.querySelector('select')).not.toBeNull();
  });

  it('[SET-01.2] saves dark mode when the toggle is turned on', async () => {
    const { fixture, preferences } = setup();
    await fixture.componentInstance.setDark(true);
    expect(preferences.setTheme).toHaveBeenCalledWith(THEME_PREFERENCE.DARK);
  });

  it('[SET-02.1] shows the debug buttons on settings', () => {
    const { fixture } = setup();
    expect(
      fixture.nativeElement.querySelector('[data-testid="generate-tasks"]'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-testid="delete-tasks"]'),
    ).not.toBeNull();
  });

  it('[SET-02.2] hides the debug section when enable_debug_actions is false', () => {
    const { fixture } = setup({ debugActionsEnabled: false });
    expect(
      fixture.nativeElement.querySelector('[data-testid="generate-tasks"]'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-testid="delete-tasks"]'),
    ).toBeNull();
    expect(fixture.nativeElement.querySelector('.debug')).toBeNull();
  });

  it('rejects invalid dark mode toggle events', async () => {
    const { fixture } = setup();
    await expect(
      fixture.componentInstance.setDarkFromToggle({} as CustomEvent),
    ).rejects.toThrow(/modo oscuro/);
  });

  it('rejects invalid language select events', async () => {
    const { fixture } = setup();
    await expect(
      fixture.componentInstance.setLanguageFromSelect({} as Event),
    ).rejects.toThrow(/idioma/);
  });

  it('accepts a valid dark mode toggle event and persists the new value', async () => {
    const { fixture, preferences } = setup();
    const event = { detail: { checked: true } } as CustomEvent;
    await fixture.componentInstance.setDarkFromToggle(event);
    expect(preferences.setTheme).toHaveBeenCalledWith(THEME_PREFERENCE.DARK);
  });

  it('accepts a valid language select event and persists the new value', async () => {
    const { fixture, preferences } = setup();
    const select = document.createElement('select');
    select.value = 'en';
    Object.defineProperty(select, 'value', {
      configurable: true,
      get: () => 'en',
    });
    const event = { target: select } as unknown as Event;
    await fixture.componentInstance.setLanguageFromSelect(event);
    expect(preferences.language()).toBe(APP_LANGUAGE.EN);
  });

  it('triggers debug seed and deletion when the buttons are pressed', async () => {
    const { fixture } = setup();
    await fixture.componentInstance.generateFiveThousand();
    await fixture.componentInstance.removeAllTasks();
    expect(
      fixture.nativeElement.querySelector('[data-testid="delete-tasks"]'),
    ).not.toBeNull();
  });

  it('caps the debug seed button at two activations and disables it', async () => {
    const { fixture } = setup();
    const page = fixture.componentInstance;
    await page.generateFiveThousand();
    await page.generateFiveThousand();
    fixture.detectChanges();
    expect(page.debugSeedExhausted()).toBe(true);
    const button = fixture.nativeElement.querySelector(
      '[data-testid="generate-tasks"]',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    await page.generateFiveThousand();
    expect(page.debugSeedCount()).toBe(2);
  });
});
