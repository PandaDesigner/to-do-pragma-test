import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { SettingsPreferences, SETTINGS_KEY } from './settings-preferences';
import { APP_LANGUAGE } from './app-language';
import es from '../../../assets/i18n/es.json';

describe('QC-02 El atributo lang sigue al idioma activo', () => {
  let storage: { get: jest.Mock; set: jest.Mock };

  beforeEach(() => {
    storage = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: Storage, useValue: storage },
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.setTranslation('en', {});
    document.documentElement.lang = 'en';
  });

  function preferences(): SettingsPreferences {
    return TestBed.inject(SettingsPreferences);
  }

  it('[QC-02.1] cargar deja lang en el idioma resuelto', async () => {
    await preferences().load();
    expect(document.documentElement.lang).toBe(APP_LANGUAGE.EN);
  });

  it('[QC-02.2] cambiar de idioma actualiza lang', async () => {
    const prefs = preferences();
    await prefs.load();
    await prefs.setLanguage(APP_LANGUAGE.ES);
    expect(document.documentElement.lang).toBe(APP_LANGUAGE.ES);
  });

  it('[QC-02.3] cargar con idioma guardado en espanol deja lang en espanol', async () => {
    storage.get.mockImplementation((key: string) =>
      key === SETTINGS_KEY.LANGUAGE
        ? Promise.resolve(APP_LANGUAGE.ES)
        : Promise.resolve(null),
    );
    await preferences().load();
    expect(document.documentElement.lang).toBe(APP_LANGUAGE.ES);
  });
});
