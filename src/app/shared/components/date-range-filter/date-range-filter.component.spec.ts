import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../../assets/i18n/en.json';
import es from '../../../../assets/i18n/es.json';
import { DateRangeFilterComponent } from './date-range-filter.component';

describe('DateRangeFilterComponent', () => {
  async function setup(): Promise<ComponentFixture<DateRangeFilterComponent>> {
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
    jest
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(DateRangeFilterComponent);
    fixture.componentRef.setInput('today', '2026-01-02');
    fixture.componentRef.setInput('initialRange', null);
    fixture.detectChanges();
    return fixture;
  }

  function overlayOf(
    fixture: ComponentFixture<DateRangeFilterComponent>,
  ): HTMLElement {
    const overlay = fixture.nativeElement.querySelector('ion-modal');
    if (!overlay) {
      throw new Error('El selector no monta el overlay');
    }
    return overlay as HTMLElement;
  }

  function datetimeOf(
    fixture: ComponentFixture<DateRangeFilterComponent>,
  ): HTMLElement {
    const element = fixture.nativeElement.querySelector('ion-datetime');
    if (!element) {
      throw new Error('El overlay no monta el calendario');
    }
    return element as HTMLElement;
  }

  it('[DATE-FILTER-02.1] monta el calendario dentro del overlay y no declara contentInputs', async () => {
    const fixture = await setup();
    expect(overlayOf(fixture)).toBeTruthy();
    expect(datetimeOf(fixture)).toBeTruthy();
    expect(fixture.nativeElement.innerHTML).not.toContain('contentInputs');
    expect(fixture.nativeElement.innerHTML).not.toContain('content-inputs');
  });

  it('[DATE-FILTER-02.2] el calendario desactiva el titulo por defecto, declara alto explicito y es un rango', async () => {
    const fixture = await setup();
    const datetime = datetimeOf(fixture);
    expect(datetime.getAttribute('show-default-title')).toBe('false');
    expect(datetime.getAttribute('presentation')).toBe('date');
    expect(datetime.getAttribute('multiple')).toBe('true');
    const host = datetime.parentElement;
    expect(host).toBeTruthy();
    expect(host?.style.height).not.toBe('');
  });

  it('[DATE-FILTER-02.3] el rango inicial va de hoy a hoy', async () => {
    const fixture = await setup();
    expect(datetimeOf(fixture).getAttribute('value')).toBe(
      '["2026-01-02T00:00:00","2026-01-02T00:00:00"]',
    );
  });

  it('[DATE-FILTER-02.3] un rango previo se respeta en vez del dia de hoy', async () => {
    const fixture = await setup();
    fixture.componentRef.setInput('initialRange', {
      from: '2026-03-01',
      to: '2026-03-05',
    });
    fixture.detectChanges();
    expect(datetimeOf(fixture).getAttribute('value')).toBe(
      '["2026-03-01T00:00:00","2026-03-05T00:00:00"]',
    );
  });

  it('[DATE-FILTER-02.4] un rango vacio o incompleto no emite rango', async () => {
    const fixture = await setup();
    const emitted: unknown[] = [];
    fixture.componentInstance.rangeChange.subscribe((range) =>
      emitted.push(range),
    );
    fixture.componentInstance.select([]);
    fixture.componentInstance.select(['2026-04-01T00:00:00']);
    fixture.componentInstance.select([
      '2026-04-01T00:00:00',
      '2026-04-09T00:00:00',
    ]);
    expect(emitted).toEqual([
      { from: '2026-04-01', to: '2026-04-09' },
    ]);
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

  it('[DATE-FILTER-02.3] los titulos del overlay salen traducidos', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    expect(overlay.getAttribute('header')).toBe('Filtrar por fecha');
    const buttons = fixture.nativeElement.querySelectorAll(
      'ion-modal .date-filter__actions button',
    );
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toContain('Aplicar');
    expect(buttons[1].textContent).toContain('Cancelar');
  });
});