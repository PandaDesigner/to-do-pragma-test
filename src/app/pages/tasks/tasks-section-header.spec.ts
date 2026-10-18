import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { configurePageTesting } from '../../testing/page.fixture';
import { TasksPage } from './tasks.page';
import { SettingsPreferences } from '../../core/settings/settings-preferences';
import { APP_LANGUAGE } from '../../core/settings/app-language';
import { CATEGORY_SECTION } from '../../domain/category';
import en from '../../../assets/i18n/en.json';
import es from '../../../assets/i18n/es.json';

async function setup(): Promise<TasksPage> {
  configurePageTesting({
    providers: [
      provideRouter([]),
      provideTranslateService({ fallbackLang: 'en' }),
    ],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.setTranslation('es', es);
  translate.use('en');
  jest
    .spyOn(HTMLElement.prototype, 'focus')
    .mockImplementation(() => undefined);
  const fixture = TestBed.createComponent(TasksPage);
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  fixture.detectChanges();
  return fixture.componentInstance;
}

describe('QC-04 La cabecera nombra la sección activa', () => {
  it('[QC-04.1] cada sección declara su propia clave de cabecera', async () => {
    const page = await setup();
    expect(page.sectionLabel()).toBe(
      'category.sections.' + CATEGORY_SECTION.GENERAL,
    );
  });

  it('[QC-04.2] la cabecera expone la clave de la sección como título', async () => {
    const page = await setup();
    expect(page.headerTitle()).toBe(page.sectionLabel());
  });

  it('[QC-04.3] la cabecera de una sección sin tareas sigue nombrándola', async () => {
    const page = await setup();
    expect(page.headerTitle()).not.toBe('');
    expect(page.headerTitle()).toContain('sections');
  });

  it('[QC-04.4] la plantilla pasa el título de sección al page-header', () => {
    const html = readFileSync(join(__dirname, 'tasks.page.html'), 'utf8');
    // La sección se antepone al sobretítulo, junto a la fecha, en vez de
    // sustituir el título del día.
    expect(html).toContain('[overline]="(headerTitle() | translate)');
  });
});

describe('QC-05 La fecha de la cabecera sigue al idioma', () => {
  async function setupWithLanguage(language: string): Promise<TasksPage> {
    const page = await setup();
    await TestBed.inject(SettingsPreferences).setLanguage(
      language === 'es' ? APP_LANGUAGE.ES : APP_LANGUAGE.EN,
    );
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    return page;
  }

  it('[QC-05.1] el título del día se formatea en español', async () => {
    const page = await setupWithLanguage('es');
    expect(page.locale()).toBe('es');
    // El reloj del fixture fija hoy en 2026-01-02, un viernes.
    expect(page.dayTitle()).toBe('2.vie');
  });

  it('[QC-05.2] el sobretítulo muestra la fecha larga en español', async () => {
    const page = await setupWithLanguage('es');
    expect(page.longDate()).toBe('2 de enero');
  });

  it('[QC-05.3] la señal de idioma se sincroniza al cargar', async () => {
    // Con la interfaz en español, la cabecera no puede quedarse en inglés.
    const page = await setupWithLanguage('es');
    expect(page.locale()).not.toBe('en');
  });
});
