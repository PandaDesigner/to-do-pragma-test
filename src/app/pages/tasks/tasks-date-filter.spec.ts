import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { configurePageTesting } from '../../testing/page.fixture';
import { TasksPage } from './tasks.page';
import { TASK_STATUS } from '../../domain/task';
import en from '../../../assets/i18n/en.json';

async function setupQa(): Promise<{
  fixture: ComponentFixture<TasksPage>;
  page: TasksPage;
}> {
  configurePageTesting({
    providers: [
      provideRouter([]),
      provideTranslateService({ fallbackLang: 'en' }),
    ],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  jest
    .spyOn(HTMLElement.prototype, 'focus')
    .mockImplementation(() => undefined);
  const fixture = TestBed.createComponent(TasksPage);
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  fixture.detectChanges();
  return { fixture, page: fixture.componentInstance };
}

describe('DATE-FILTER-01 Grupo de filtro por fecha', () => {
  async function setup(): Promise<{
    fixture: ComponentFixture<TasksPage>;
    page: TasksPage;
  }> {
    return setupQa();
  }

  afterEach(() => {
    document.querySelectorAll('ion-modal').forEach((modal) => modal.remove());
  });

  function ruleOf(selector: string): string {
    const scss = readFileSync(join(__dirname, 'tasks.page.scss'), 'utf8');
    const start = scss.indexOf(selector);
    return scss.slice(start, scss.indexOf('}', start));
  }

  it('[DATE-FILTER-01.1] el grupo expone el boton de hoy y el de calendario', async () => {
    const { fixture } = await setup();
    const actions = fixture.nativeElement.querySelector('.top-actions');
    const today = actions.querySelector('.today-badge');
    const calendar = actions.querySelector('.date-filter-trigger');
    expect(today).not.toBeNull();
    expect(calendar).not.toBeNull();
    expect(today.parentElement).toBe(calendar.parentElement);
  });

  it('[DATE-FILTER-01.2] el icono de calendario se resuelve por la propiedad icon', async () => {
    const { fixture } = await setup();
    const icon = fixture.nativeElement.querySelector(
      '.date-filter-trigger ion-icon',
    );
    expect(icon).not.toBeNull();
    expect(icon.getAttribute('name')).toBeNull();
  });

  it('[DATE-FILTER-01.3] el boton de calendario abre el selector de rango', async () => {
    const { fixture, page } = await setup();
    const trigger = fixture.nativeElement.querySelector('.date-filter-trigger');
    trigger.click();
    fixture.detectChanges();
    expect(page.dateFilterOpen()).toBe(true);
  });

  it('[DATE-FILTER-01.1] el boton de calendario lleva etiqueta accesible traducida', async () => {
    const { fixture } = await setup();
    const trigger = fixture.nativeElement.querySelector('.date-filter-trigger');
    expect(trigger.getAttribute('aria-label')).toBe('Filter by date');
  });

  it('[DATE-FILTER-04.1] el boton de hoy fija el rango al dia actual y conserva su comportamiento', async () => {
    const { fixture, page } = await setup();
    page.store.setCategory('cat-1');
    const badge = fixture.nativeElement.querySelector('.today-badge');
    badge.click();
    fixture.detectChanges();
    expect(page.store.dateRange()).toEqual({
      from: page.today(),
      to: page.today(),
    });
    expect(page.selectedCategoryId()).toBeUndefined();
    expect(page.store.categoryId()).toBeUndefined();
    expect(page.panelOpen()).toBe(true);
  });

  it('[DATE-FILTER-04.2] el boton de hoy conserva la etiqueta sin glifo de flecha', async () => {
    const { fixture } = await setup();
    const badge = fixture.nativeElement.querySelector('.today-badge');
    expect(badge.textContent).toContain('TODAY');
    expect(badge.textContent).not.toContain('›');
  });

  it('[DATE-FILTER-03.1] aplicar un rango desde el selector filtra la lista y vuelve a la pagina 1', async () => {
    const { page } = await setup();
    page.tabPage.set(3);
    page.applyDateRange({ from: '2026-01-01', to: '2026-01-02' });
    expect(page.store.dateRange()).toEqual({
      from: '2026-01-01',
      to: '2026-01-02',
    });
    expect(page.tabPage()).toBe(1);
  });

  it('[TODO-01.4] el badge mide su caja de Figma y no la del grupo de acciones', () => {
    const rule = ruleOf('.today-badge {');
    expect(rule).toContain('flex: 0 0 auto');
    expect(rule).not.toMatch(/(^|\s)flex:\s*1\s*;/);
    expect(rule).toContain('height: var(--app-day-badge-height)');
    expect(rule).toContain('min-width: var(--app-day-badge-min-width)');
  });

  it('[DATE-FILTER-01.1] el grupo separa el badge del icono con el token de espaciado', () => {
    expect(ruleOf('.top-actions {')).toContain('gap: var(--app-space-8)');
  });
});

describe('QC-01 El filtro por rango acota la lista', () => {
  async function setupWithTasks(): Promise<{ page: TasksPage }> {
    const { page } = await setupQa();
    await page.store.upsertMany([
      {
        id: 'qa-antes',
        title: 'Fuera antes',
        status: TASK_STATUS.PENDING,
        categoryId: null,
        dueDate: '2026-01-01',
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: 'qa-dentro',
        title: 'Dentro del rango',
        status: TASK_STATUS.PENDING,
        categoryId: null,
        dueDate: '2026-01-05',
        createdAt: 2,
        updatedAt: 2,
      },
      {
        id: 'qa-despues',
        title: 'Fuera despues',
        status: TASK_STATUS.PENDING,
        categoryId: null,
        dueDate: '2026-01-20',
        createdAt: 3,
        updatedAt: 3,
      },
    ]);
    return { page };
  }

  it('[QC-01.1] la lista respeta el rango aplicado', async () => {
    const { page } = await setupWithTasks();
    page.applyDateRange({ from: '2026-01-04', to: '2026-01-06' });
    const ids = page.filteredTasks().map((task) => task.id);
    expect(ids).toContain('qa-dentro');
    expect(ids).not.toContain('qa-antes');
    expect(ids).not.toContain('qa-despues');
  });

  it('[QC-01.2] la pagina y el store filtran por el mismo rango', async () => {
    const { page } = await setupWithTasks();
    page.applyDateRange({ from: '2026-01-04', to: '2026-01-06' });
    const enPagina = page
      .filteredTasks()
      .map((task) => task.id)
      .sort();
    const enStore = page.store
      .visibleTasks()
      .map((task) => task.id)
      .sort();
    expect(enPagina).toEqual(enStore);
  });

  it('[QC-01.3] quitar el filtro devuelve la lista completa', async () => {
    const { page } = await setupWithTasks();
    page.applyDateRange({ from: '2026-01-04', to: '2026-01-06' });
    expect(page.filteredTasks().length).toBe(1);
    page.applyDateRange(null);
    expect(page.filteredTasks().length).toBe(3);
  });
});
