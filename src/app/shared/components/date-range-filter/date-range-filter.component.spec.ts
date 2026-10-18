import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
  ): HTMLElement & {
    showDefaultTitle?: boolean;
    multiple?: boolean;
    presentation?: string;
  } {
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
    expect(
      fixture.nativeElement.innerHTML + overlayOf(fixture).innerHTML,
    ).not.toContain('contentInputs');
    expect(
      fixture.nativeElement.innerHTML + overlayOf(fixture).innerHTML,
    ).not.toContain('content-inputs');
  });

  it('[DATE-FILTER-02.2] el calendario desactiva el titulo por defecto, declara alto explicito y es un rango', async () => {
    const fixture = await setup();
    const datetime = datetimeOf(fixture);
    expect(datetime.showDefaultTitle).toBe(false);
    expect(datetime.multiple).toBe(true);
    expect(datetime.presentation).toBe('date');
    const host = datetime.closest(
      '.date-filter__calendar',
    ) as HTMLElement | null;
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
    expect(toDateRange(['2026-06-01T00:00:00', '2026-06-02T00:00:00'])).toEqual(
      { from: '2026-06-01', to: '2026-06-02' },
    );
  });

  // Estos dos tests atacan un fallo que 550 tests en verde no detectaron: los
  // tres botones estaban en el DOM, con sus handlers y sus traducciones, pero
  // caian 306px por debajo del viewport y no habia forma de pulsarlos. Un boton
  // puede existir en el DOM y ser inalcanzable para una persona.
  it('[DATE-FILTER-02.5] el modal abre a una altura que deja sitio a las acciones', async () => {
    const fixture = await setup();
    // overlayOf ya devuelve el ion-modal proyectado en el documento, no un
    // contenedor que lo contenga.
    const modal = overlayOf(fixture) as HTMLElement & {
      initialBreakpoint?: number;
      breakpoints?: number[];
    };
    const target = modal.initialBreakpoint;
    const steps = modal.breakpoints ?? [];
    expect(target).toBeDefined();
    expect(steps.length).toBeGreaterThan(0);
    // El contenido pide ~473px. Con 0.6 de 915px el modal daba 549px, asi que el
    // breakpoint no era la causa del desbordamiento: lo era que nada acotaba la
    // altura del cuerpo. El breakpoint sube para dar margen al calendario.
    expect(target as number).toBeGreaterThanOrEqual(0.8);
  });

  it('[DATE-FILTER-02.6] el cuerpo del modal recorta en vez de crecer y deja las acciones dentro', async () => {
    const fixture = await setup();
    const body = overlayOf(fixture).querySelector(
      '.date-filter__body',
    ) as HTMLElement | null;
    const actions = overlayOf(fixture).querySelector(
      '.date-filter__actions',
    ) as HTMLElement | null;
    expect(body).toBeTruthy();
    expect(actions).toBeTruthy();

    // jsdom no carga la hoja de estilos del componente, asi que getComputedStyle
    // no ve min-height. Se lee el SCSS del disco para comprobar la regla que
    // evita que el contenedor crezca a la altura de su contenido.
    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    const bodyRule = styles.match(/\.date-filter__body\s*\{([^}]*)\}/);
    expect(bodyRule).toBeTruthy();
    expect(bodyRule?.[1]).toContain('min-height: 0');
    expect(bodyRule?.[1]).toContain('box-sizing: border-box');

    // El calendario no puede pasar del alto pedido, que es lo que desborda.
    const calendarRule = styles.match(/\.date-filter__calendar\s*\{([^}]*)\}/);
    expect(calendarRule).toBeTruthy();
    expect(calendarRule?.[1]).toContain('max-height: 330px');
  });

  // ion-datetime no expone variables propias: su SCSS interno consume el
  // sistema de steps de Ionic, que el proyecto solo define para
  // --ion-text-color. Sin mapear los demas, el calendario cae a los fallbacks
  // blancos de Ionic y queda blanco puro dentro de un modal oscuro.
  it('[DATE-FILTER-02.7] el calendario toma la superficie y el texto de la paleta del proyecto', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const calendar = overlay.querySelector(
      '.date-filter__calendar',
    ) as HTMLElement | null;
    expect(calendar).toBeTruthy();

    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    const rule = styles.match(/\.date-filter__calendar\s*\{([^}]*)\}/);
    expect(rule).toBeTruthy();
    const body = rule?.[1] ?? '';

    // Superficie: el calendario no puede quedarse en blanco de Ionic.
    expect(body).toContain('--ion-color-step-100');
    expect(body).toContain('--ion-color-step-300');
    expect(body).toContain('--ion-color-step-650');
    expect(body).toContain('--ion-text-color');
    // Y debe tomar los tokens del proyecto, no valores sueltos.
    expect(body).toContain('var(--app-surface)');
    expect(body).toContain('var(--app-text)');
  });

  it('[DATE-FILTER-02.8] los dias atenuados del calendario mantienen contraste AA en oscuro', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    const rule = styles.match(/\.date-filter__calendar\s*\{([^}]*)\}/);
    const body = rule?.[1] ?? '';

    // Los dias adyacentes se dibujan con opacidad reducida sobre el fondo. Si
    // el texto atenuado se compone sobre una superficie clara y el modal es
    // oscuro, el resultado queda ilegible: 1.65:1 medido en pantalla.
    expect(body).toContain('--ion-color-step-650');
    // Los dias adyacentes se dibujan con step-500, no con el color base. El
    // calendario debe definir tambien el rgb de la superficie, que alimenta los
    // rellenos translucidos como el anillo del dia seleccionado: sin el, ese
    // relleno sale del blanco de Ionics y se ve como un halo claro en oscuro.
    const perPalette = `${styles.match(/\.date-filter__calendar\[data-palette='dark'\]\s*\{([^}]*)\}/)?.[1] ?? ''}${styles.match(/\.date-filter__calendar\[data-palette='light'\],\s*\.date-filter__calendar\[data-palette='system'\]\s*\{([^}]*)\}/)?.[1] ?? ''}`;
    expect(perPalette).toContain('--ion-color-base-rgb');
    expect(perPalette).toContain('--ion-color-step-500');
  });

  it('[DATE-FILTER-02.10] las reglas por paleta no dependen de :host-context', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    // :host-context(html.ion-palette-dark) no funciona: Angular lo compila como
    // html.ion-palette-dark[_nghost] .date-filter__calendar, que exige la
    // clase en el propio elemento del componente, y la clase de paleta vive en
    // <html>. Se verifico en navegador que la regla no llegaba a aplicarse.
    // El componente expone la paleta como atributo y el SCSS selecciona por
    // atributo, que si llega.
    expect(styles).not.toContain(':host-context');
    expect(styles).toContain(".date-filter__calendar[data-palette='dark']");
    expect(styles).toContain(".date-filter__calendar[data-palette='light']");
    // Y el caso system, cuando la clase no esta y decide el SO.
    expect(styles).toContain(".date-filter__calendar[data-palette='system']");
    expect(styles).toContain('prefers-color-scheme: dark');
  });

  it('[DATE-FILTER-02.11] el calendario recibe la paleta activa como atributo', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const calendar = overlay.querySelector(
      '.date-filter__calendar',
    ) as HTMLElement | null;
    expect(calendar).toBeTruthy();
    // El atributo tiene que existir siempre: si falta, ninguna regla por
    // paleta aplica y el calendario vuelve a los fallbacks claros de Ionic.
    const palette = calendar?.getAttribute('data-palette');
    expect(palette).toBeTruthy();
    expect(['dark', 'light', 'system']).toContain(palette);
  });

  it('[DATE-FILTER-02.9] los dias atenuados cumplen AA en las dos paletas', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );

    // Valores verificados: 5.93:1 en oscuro sobre #1e1a2b y 5.22:1 en claro
    // sobre #ffffff. Un valor unico no sirve, porque el mismo gris da 5.93:1 en
    // una paleta y 2.86:1 en la otra.
    const dark = styles.match(
      /\.date-filter__calendar\[data-palette='dark'\]\s*\{([^}]*)\}/,
    );
    const light = styles.match(
      /\.date-filter__calendar\[data-palette='light'\],\s*\.date-filter__calendar\[data-palette='system'\]\s*\{([^}]*)\}/,
    );
    expect(dark).toBeTruthy();
    expect(light).toBeTruthy();
    // El tono de los dias atenuados llega por token, no como hex suelto: hay una
    // regla de stylelint que prohibe los hex en el componente. El token cambia
    // de valor segun la paleta, --app-calendar-adjacent, porque un gris unico
    // da 5.93:1 en oscuro y 2.86:1 en claro.
    expect(dark?.[1]).toContain(
      '--ion-color-step-500: var(--app-calendar-adjacent)',
    );
    expect(light?.[1]).toContain(
      '--ion-color-step-500: var(--app-calendar-adjacent)',
    );

    // Y el rgb de la superficie de cada paleta, que no puede ser el mismo.
    expect(dark?.[1]).toContain('--ion-color-base-rgb: 30, 26, 43');
    expect(light?.[1]).toContain('--ion-color-base-rgb: 255, 255, 255');
  });

  it('[DATE-FILTER-02.12] la fila de acciones se alinea con el ancho del calendario', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const actions = overlay.querySelector(
      '.date-filter__actions',
    ) as HTMLElement | null;
    expect(actions).toBeTruthy();

    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    const rule = styles.match(/\.date-filter__actions\s*\{([^}]*)\}/);
    expect(rule).toBeTruthy();
    const body = rule?.[1] ?? '';

    // Los botones no pueden ir pegados al borde derecho: con flex-end el grupo
    // acaba en 396 contra los 398 del calendario y deja 43px de aire a la
    // izquierda, con el centro del grupo en 228 frente al 207 del calendario.
    expect(body).not.toContain('justify-content: flex-end');

    // ion-button mete 2px de margen a cada lado, que descuadran los bordes
    // exteriores, asi que hay que neutralizarlos en su propia regla.
    const buttonRule = styles.match(
      /\.date-filter__actions\s+ion-button\s*\{([^}]*)\}/,
    );
    expect(buttonRule).toBeTruthy();
    expect(buttonRule?.[1]).toContain('margin: 0');
  });

  it('[DATE-FILTER-02.13] el calendario queda centrado en la fila', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const calendar = overlay.querySelector(
      '.date-filter__calendar',
    ) as HTMLElement | null;
    const datetime = calendar?.querySelector(
      'ion-datetime',
    ) as HTMLElement | null;
    expect(calendar).toBeTruthy();
    expect(datetime).toBeTruthy();

    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    const rule = styles.match(
      /\.date-filter__calendar\s+ion-datetime\s*\{([^}]*)\}/,
    );
    expect(rule).toBeTruthy();
    const body = rule?.[1] ?? '';

    // ion-datetime se auto-limita a max-width: 350px y, al ser flex, se queda
    // pegado a la izquierda: 0px de holgura a la izquierda y 32 a la derecha,
    // con el centro 16px desviado del de la fila. Hay que quitar el tope y
    // centrarlo.
    expect(body).toContain('max-width: none');
    expect(body).toContain('width: 100%');
    expect(body).toContain('margin-inline: auto');
  });

  it('[DATE-FILTER-02.14] los tres botones se alinean con el ancho del calendario', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const actions = overlay.querySelector(
      '.date-filter__actions',
    ) as HTMLElement | null;
    const calendar = overlay.querySelector(
      '.date-filter__calendar',
    ) as HTMLElement | null;
    expect(actions).toBeTruthy();
    expect(calendar).toBeTruthy();

    const buttons = [...(actions?.querySelectorAll('ion-button') ?? [])];
    expect(buttons.length).toBe(3);

    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    // La fila toma el ancho completo del calendario, para que los botones queden
    // alineados con la rejilla de arriba y la fila no se descentre.
    const rule = styles.match(/\.date-filter__actions\s*\{([^}]*)\}/);
    expect(rule).toBeTruthy();
    expect(rule?.[1]).toMatch(/width:\s*100%/);
  });

  it('[DATE-FILTER-02.15] el titulo del modal destaca sobre la pista', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);

    expect(overlay.querySelector('.date-filter__title')).toBeTruthy();
    expect(overlay.querySelector('.date-filter__hint')).toBeTruthy();

    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    const typography = readFileSync(
      join(__dirname, '../../../../theme/_typography.scss'),
      'utf8',
    );
    const tokens = readFileSync(
      join(__dirname, '../../../../theme/_tokens.scss'),
      'utf8',
    );

    const titleRule = styles.match(/\.date-filter__title\s*\{([^}]*)\}/)?.[1];
    const hintRule = styles.match(/\.date-filter__hint\s*\{([^}]*)\}/)?.[1];
    const bodyRule = styles.match(/\.date-filter__body\s*\{([^}]*)\}/)?.[1];
    expect(titleRule).toBeTruthy();
    expect(hintRule).toBeTruthy();
    expect(bodyRule).toBeTruthy();

    // El titulo declara un token de tamano propio, que debe escalar por encima
    // del texto de la pista: con los dos al mismo tamano se leian como una sola
    // linea y no se distinguia cual de los dos era el titulo.
    const titleSize = titleRule?.match(/font-size:\s*var\((--[\w-]+)\)/)?.[1];
    const hintSize = hintRule?.match(/font-size:\s*var\((--[\w-]+)\)/)?.[1];
    const pxOf = (source: string, token: string): number =>
      Number(typography.match(new RegExp(`${token}:\\s*(\\d+)px`))?.[1] ?? '0');

    expect(titleSize).toBeTruthy();
    expect(hintSize).toBeTruthy();
    expect(pxOf(typography, titleSize as string)).toBeGreaterThan(
      pxOf(typography, hintSize as string),
    );

    // La pista no lleva peso explicito, asi que hereda el normal. El titulo no
    // puede subir de 400 con DM Serif Display, que solo existe en ese peso, y por
    // eso la jerarquia se comprueba con el tamano y no con el peso.
    const hintWeight = Number(
      hintRule?.match(/font-weight:\s*(\d+)/)?.[1] ?? 400,
    );
    const titleWeight = Number(
      titleRule?.match(/font-weight:\s*(\d+)/)?.[1] ?? 400,
    );
    expect(titleWeight).toBeGreaterThanOrEqual(hintWeight);

    // Por ultimo se despega del borde superior con mas espacio del que separa al
    // resto de piezas, para que no se lea pegado al tope del modal.
    const bodySpace = bodyRule?.match(
      /padding:\s*var\((--app-space-\d+)\)/,
    )?.[1];
    // El margen superior puede venir como margin-top o como el primer valor de
    // la forma abreviada margin.
    const titleSpace =
      titleRule?.match(/margin-top:\s*var\((--app-space-\d+)\)/)?.[1] ??
      titleRule?.match(/margin:\s*var\((--app-space-\d+)\)/)?.[1];
    const spaceOf = (token: string): number =>
      Number(
        tokens.match(
          new RegExp(`\\$${token.replace('--app-', '')}:\\s*(\\d+)px`),
        )?.[1] ?? '0',
      );

    expect(titleSpace).toBeTruthy();
    expect(bodySpace).toBeTruthy();
    expect(spaceOf(titleSpace as string)).toBeGreaterThan(
      spaceOf(bodySpace as string),
    );
  });

  it('[DATE-FILTER-02.16] los botones reparten el ancho en Clear doble, Cancel y Apply simple', async () => {
    const fixture = await setup();
    const overlay = overlayOf(fixture);
    const actions = overlay.querySelector(
      '.date-filter__actions',
    ) as HTMLElement | null;
    expect(actions).toBeTruthy();

    const buttons = [...(actions?.querySelectorAll('ion-button') ?? [])];
    expect(buttons.length).toBe(3);

    const styles = readFileSync(
      join(__dirname, 'date-range-filter.component.scss'),
      'utf8',
    );
    const rowRule = styles.match(/\.date-filter__actions\s*\{([^}]*)\}/)?.[1];
    expect(rowRule).toBeTruthy();

    // La fila reparte el ancho con flex, no con anchos fijos: Clear toma el
    // doble que Cancel y Apply, que comparten un cuarto cada uno.
    const rowDeclarations = (rowRule as string)
      .split('\n')
      .filter((line) => !line.trim().startsWith('//'))
      .join('\n');
    expect(rowDeclarations).not.toMatch(/justify-content:\s*flex-start/);

    // Cancel y Apply toman un cuarto cada uno: basis 0 reparte por igual y grow 1
    // les da su parte. Clear declara grow 2 para llevarse dos partes.
    const baseRule = styles.match(
      /\.date-filter__actions\s+ion-button\s*\{([^}]*)\}/,
    )?.[1];
    expect(baseRule).toBeTruthy();
    expect(baseRule).toMatch(/flex:\s*1 1 0/);

    // El selector acepta comillas simples o dobles: prettier las reescribe a
    // simples y un test atado a las dobles falla sin que cambie el estilo.
    const clearRule = styles.match(
      /\.date-filter__actions\s+ion-button\[data-testid=["']date-filter-clear["']\]\s*\{([^}]*)\}/,
    )?.[1];
    expect(clearRule).toBeTruthy();
    expect(clearRule).toMatch(/flex:\s*2 1 0/);
  });
});
