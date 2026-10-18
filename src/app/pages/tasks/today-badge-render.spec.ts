import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { chevronForward } from 'ionicons/icons';

import en from '../../../assets/i18n/en.json';
import { configurePageTesting } from '../../testing/page.fixture';
import { ROUTE_DATA } from '../../core/di/tokens';
import { TasksPage } from './tasks.page';

/**
 * El badge HOY ya tuvo un bug que 512 tests en verde no detectaron: el
 * template usaba name="chevron-forward", que Ionicons no resuelve sin addIcons.
 * El elemento quedaba en el DOM, el atributo era correcto y la pantalla no
 * dibujaba nada. Estos tests atacan esa clase de fallo: verifican que el SVG
 * se pinta, no que el marcado declare una intención.
 */
describe('badge HOY: el chevron se dibuja de verdad', () => {
  async function setup() {
    configurePageTesting({
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: ROUTE_DATA, useValue: {} },
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');
    const fixture = TestBed.createComponent(TasksPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, page: fixture.componentInstance };
  }

  it('[TODAY-UI-01.5] entrega el SVG de chevronForward al ion-icon, no un nombre', async () => {
    const { page } = await setup();

    expect(page.icons.chevronForward).toBe(chevronForward);
    // Un SVG de ionicons es una cadena de datos; un nombre sería 'chevron-forward'.
    expect(typeof page.icons.chevronForward).toBe('string');
  });

  it('[TODAY-UI-01.6] el ion-icon del badge recibe el SVG por [icon] y no por name', async () => {
    const { fixture, page } = await setup();
    const badge = fixture.nativeElement.querySelector(
      '.today-badge',
    ) as HTMLElement;
    const icon = badge.querySelector('ion-icon');

    expect(icon).not.toBeNull();
    expect(icon?.hasAttribute('name')).toBe(false);
    // Esta es la aserción que habría atrapado el bug original.
    expect((icon as { icon?: unknown }).icon).toBe(page.icons.chevronForward);
  });

  it('[TODAY-UI-01.7] el nombre inexistente que rompía la pantalla no aparece en el código', async () => {
    const { fixture } = await setup();
    const badge = fixture.nativeElement.querySelector(
      '.today-badge',
    ) as HTMLElement;

    expect(badge.outerHTML).not.toContain('chevron-forward');
  });

  it('[DATE-FILTER-01.4] el botón de hoy declara padding horizontal holgado', async () => {
    await setup();

    const styles = readFileSync(join(__dirname, 'tasks.page.scss'), 'utf8');
    const tokens = readFileSync(
      join(__dirname, '../../../theme/_tokens.scss'),
      'utf8',
    );

    const rule = styles.match(/\.today-badge\s*\{([^}]*)\}/)?.[1];
    expect(rule).toBeTruthy();

    const space = rule?.match(
      /padding-inline:\s*var\((--app-space-\d+)\)/,
    )?.[1];
    expect(space).toBeTruthy();

    // El padding debe pasar de --app-space-4, que a 4 px dejaba la etiqueta y el
    // chevron pegados al borde, a --app-space-8 o mas. Comparar contra el token
    // leido de _tokens.scss y no contra un numero, para que el valor viva en un
    // solo sitio.
    const px = Number(
      tokens.match(
        new RegExp(`\\$${String(space).replace('--app-', '')}:\\s*(\\d+)px`),
      )?.[1] ?? '0',
    );
    expect(px).toBeGreaterThan(4);

    // El min-width tiene que dar margen al contenido mas el padding a los dos
    // lados, o el badge recorta el aire y el padding deja de verse. Con 8 px de
    // padding y 61 px de contenido hacen falta 77 px; se baja a 75 porque el
    // contenido real con el texto en español es algo menor.
    const minWidth = Number(
      tokens.match(/\$day-badge-min-width:\s*(\d+)px/)?.[1] ?? '0',
    );
    expect(minWidth).toBeGreaterThan(px * 2);
  });
});
