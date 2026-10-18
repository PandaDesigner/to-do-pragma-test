import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../../assets/i18n/en.json';
import es from '../../../../assets/i18n/es.json';
import {
  DATE_FILTER_HEIGHT,
  DateRangeFilterComponent,
  toDateRange,
} from './date-range-filter.component';

describe('DateRangeFilterComponent', () => {
  async function setup(): Promise<
    ComponentFixture<DateRangeFilterComponent>
  > {
    await TestBed.configureTestingModule({
      imports: [DateRangeFilterComponent],
      providers: [
        provideIonicAngular({}),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.setTranslation('es', es);
    translate.use('es');
    // jsdom deja shadowRoot.activeElement en null y el focus trap del overlay
    // entraria en recursion.
    jest
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(DateRangeFilterComponent);
    fixture.componentRef.setInput('today', '2026-01-02');
    fixture.componentRef.setInput('initialRange', null);
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    await fixture.whenStable();
    // El ion-modal proyecta su contenido en el documento de forma asincrona.
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();
    return fixture;
  }

  // El ion-modal solo renderiza su contenido cuando esta abierto, y lo
  // proyecta en el documento, no dentro del host del componente.
  function overlayOf(
    fixture: ComponentFixture<DateRangeFilterComponent>,
  ): HTMLElement {
    const overlay = [...document.querySelectorAll('ion-modal')].at(-1);
    if (!overlay) {
      throw new Error('El componente no monta el overlay');
    }
    return overlay as HTMLElement;
  }

  function datetimeOf(
    fixture: ComponentFixture<DateRangeFilterComponent>,
  ): (HTMLElement & {
    showDefaultTitle?: boolean;
    multiple?: boolean;
    presentation?: string;
  }) {
    const element = overlayOf(fixture).querySelector('ion-datetime');
    if (!element) {
      throw new Error('El overlay no monta el calendario');
    }
    return element as HTMLElement & {
      showDefaultTitle?: boolean;
      multiple?: boolean;
      presentation?: string;
    };
  }

  function datetimeValueOf(
    fixture: ComponentFixture<DateRangeFilterComponent>,
  ): unknown {
    const element = datetimeOf(fixture) as HTMLElement & { value?: unknown };
    return element.value;
  }

  afterEach(() => {
    document.querySelectorAll('ion-modal').forEach((modal) => modal.remove());
  });

  it('[DATE-FILTER-02.1] monta el calendario dentro del overlay y no declara contentInputs', async () => {
    const fixture = await setup();
    expect(overlayOf(fixture)).toBeTruthy();
    expect(datetimeOf(fixture)).toBeTruthy();
    expect(fixture.nativeElement.innerHTML + overlayOf(fixture).innerHTML).not.toContain(
      'contentInputs',
    );
    expect(fixture.nativeElement.innerHTML + overlayOf(fixture).innerHTML).not.toContain(
      'content-inputs',
    );
  });

  it('[DATE-FILTER-02.2] el calendario desactiva el titulo por defecto, declara alto explicito y es un rango', async () => {
    const fixture = await setup();
    const datetime = datetimeOf(fixture);
    expect(datetime.showDefaultTitle).toBe(false);
    expect(datetime.multiple).toBe(true);
    expect(datetime.presentation).toBe('date');
    const host = datetime.closest('.date-filter__calendar') as HTMLElement | null;
    expect(host).toBeTruthy();
    expect(host?.style.height).toBe(`${DATE_FILTER_HEIGHT}px`);
  });

  it('[DATE-FILTER-02.3] el rango inicial va de hoy a hoy', async () => {
    const fixture = await setup();
    fixture.componentInstance.onOpen();
    expect(fixture.componentInstance.draft()).toEqual([
      '2026-01-02T00:00:00',
      '2026-01-02T00:00:00',
    ]);
    fixture.detectChanges();
    expect(datetimeValueOf(fixture)).toEqual([
      '2026-01-02T00:00:00',
      '2026-01-02T00:00:00',
    ]);
  });

  it('[DATE-FILTER-02.3] un rango previo se respeta en vez del dia de hoy', async () => {
    const fixture = await setup();
    fixture.componentRef.setInput('initialRange', {
      from: '2026-03-01',
      to: '2026-03-05',
    });
    fixture.componentInstance.onOpen();
    expect(fixture.componentInstance.draft()).toEqual([
      '2026-03-01T00:00:00',
      '2026-03-05T00:00:00',
    ]);
  });

  it('[DATE-FILTER-02.4] un rango vacio o incompleto no emite rango', async () => {
    const fixture = await setup();
    const emitted: unknown[] = [];
    fixture.componentInstance.rangeChange.subscribe((range) =>
      emitted.push(range),
    );
    fixture.componentInstance.select([]);
    fixture.componentInstance.apply();
    fixture.componentInstance.select(['2026-04-01T00:00:00']);
    fixture.componentInstance.apply();
    fixture.componentInstance.select([
      '2026-04-01T00:00:00',
      '2026-04-09T00:00:00',
    ]);
    fixture.componentInstance.apply();
    expect(emitted).toEqual([
      null,
      null,
      { from: '2026-04-01', to: '2026-04-09' },
    ]);
  });

  it('[DATE-FILTER-02.4] el rango emitido sale ordenado aunque se elija al reves', async () => {
    const fixture = await setup();
    const emitted: unknown[] = [];
    fixture.componentInstance.rangeChange.subscribe((range) =>
      emitted.push(range),
    );
    fixture.componentInstance.select([
      '2026-05-20T00:00:00',
      '2026-05-02T00:00:00',
    ]);
    fixture.componentInstance.apply();
    expect(emitted).toEqual([{ from: '2026-05-02', to: '2026-05-20' }]);
  });

  it('[DATE-FILTER-02.4] limpiar el filtro emite un rango vacio', async () => {
    const fixture = await setup();
    const emitted: unknown[] = [];
    fixture.componentInstance.rangeChange.subscribe((range) =>
      emitted.push(range),
    );
    fixture.componentInstance.clear();
    expect(emitted).toEqual([null]);
    expect(fixture.componentInstance.draft()).toEqual([]);
  });

  it('[DATE-FILTER-02.1] el overlay se cierra y emite dismiss al cancelarse', async () => {
    const fixture = await setup();
    let dismissed = 0;
    fixture.componentInstance.dismiss.subscribe(() => {
      dismissed += 1;
    });
    fixture.componentInstance.close();
    expect(dismissed).toBe(1);
  });

  it('[DATE-FILTER-02.3] los titulos del overlay y de los botones salen traducidos', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const title = overlay.querySelector('.date-filter__title');
    expect(title?.textContent).toContain('Filtrar por fecha');
    const apply = overlay.querySelector('[data-testid="date-filter-apply"]');
    const cancel = overlay.querySelector('[data-testid="date-filter-cancel"]');
    expect(apply?.textContent).toContain('Aplicar');
    expect(cancel?.textContent).toContain('Cancelar');
  });

  it('convierte valores incompletos o invalidos en un rango vacio', () => {
    expect(toDateRange(null)).toBeNull();
    expect(toDateRange(undefined)).toBeNull();
    expect(toDateRange([])).toBeNull();
    expect(toDateRange(['solo-una'])).toBeNull();
    expect(toDateRange(['2026-06-01T00:00:00'])).toBeNull();
    expect(
      toDateRange(['2026-06-01T00:00:00', '2026-06-02T00:00:00']),
    ).toEqual({ from: '2026-06-01', to: '2026-06-02' });
  });
});