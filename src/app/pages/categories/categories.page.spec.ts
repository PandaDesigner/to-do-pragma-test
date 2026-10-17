import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../assets/i18n/en.json';
import { taskFixture } from '../../testing/task.fixture';
import { add } from 'ionicons/icons';
import { CategoriesPage } from './categories.page';
import { configurePageTesting } from '../../testing/page.fixture';

describe('CategoriesPage', () => {
  async function setup() {
    const dependencies = configurePageTesting({
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');
    const fixture = TestBed.createComponent(CategoriesPage);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    return { ...dependencies, fixture, page: fixture.componentInstance };
  }

  it('[SHEET-01.1] opens the sheet in Create mode from the FAB', async () => {
    const { page, categories } = await setup();
    page.openCreateSheet();
    expect(categories.sheetRequest()).toEqual({ mode: 'create' });
  });

  it('[SHEET-01.1] uses the shared FAB with the plus icon and opens the sheet', async () => {
    const { fixture, categories } = await setup();
    const fab = fixture.nativeElement.querySelector(
      'app-fab-button ion-fab-button',
    ) as HTMLElement;
    const icon = fab.querySelector('ion-icon') as HTMLElement & {
      icon?: string;
    };
    // ion-fab-button hereda aria-label al <button> interno al hidratarse.
    const label =
      fab.shadowRoot?.querySelector('button')?.getAttribute('aria-label') ??
      fab.getAttribute('aria-label');
    expect(label).toBe('Nueva categoría');
    expect(icon.icon).toBe(add);
    fab.click();
    expect(categories.sheetRequest()).toEqual({ mode: 'create' });
  });

  it('[SHEET-01.2] opens the sheet in Edit mode with the selected draft', async () => {
    const { page, categories } = await setup();
    const draft = {
      id: 'c1',
      name: 'Shopping',
      kind: 'list' as const,
      icon: 'cart',
      colorToken: 'routine',
    };
    await categories.upsert(draft);
    page.openEditSheet(draft);
    expect(categories.sheetRequest()).toEqual({ mode: 'edit', draft });
  });

  it('virtualizes from 200 categories and tracks IDs', async () => {
    const { page, categories, fixture } = await setup();
    const category = {
      id: 'c',
      name: 'Lista',
      kind: 'list' as const,
      icon: 'list',
      colorToken: 'my',
    };
    await Promise.all(
      Array.from({ length: 199 }, (_, index) =>
        categories.upsert({ ...category, id: String(index) }),
      ),
    );
    fixture.detectChanges();
    expect(page.shouldVirtualize()).toBe(false);
    await categories.upsert(category);
    fixture.detectChanges();
    expect(page.shouldVirtualize()).toBe(true);
    expect(page.trackById(0, category)).toBe('c');
    expect(
      fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport'),
    ).not.toBeNull();
  });

  it('resolves each category icon via iconFor and renders one ion-icon per row', async () => {
    const { categories, fixture, page } = await setup();
    await categories.upsert({
      id: 'cart',
      name: 'Shopping',
      kind: 'list',
      icon: 'cart',
      colorToken: 'routine',
    });
    await categories.upsert({
      id: 'home',
      name: 'House',
      kind: 'list',
      icon: 'home',
      colorToken: 'event',
    });
    expect(page.iconFor(categories.categories()[0])).toMatch(
      /^data:image\/svg/,
    );
    expect(page.iconFor(categories.categories()[1])).toMatch(
      /^data:image\/svg/,
    );
    expect(page.iconFor(categories.categories()[0])).not.toBe(
      page.iconFor(categories.categories()[1]),
    );
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.swatch ion-icon'),
    ).toHaveLength(2);
  });

  it('counts tasks per category including uncategorized ones', async () => {
    const { page, tasks } = await setup();
    await tasks.upsertMany([
      taskFixture({ id: 't1', categoryId: 'cart', dueDate: '2026-01-01' }),
      taskFixture({ id: 't2', categoryId: 'cart', dueDate: '2026-01-02' }),
      taskFixture({ id: 't3', categoryId: null, dueDate: '2026-01-03' }),
    ]);
    fixture: void page.taskCounts();
    expect(page.taskCounts().get('cart')).toBe(2);
    expect(page.taskCounts().get(null)).toBe(1);
  });

  it('exposes retry that delegates to the store', async () => {
    const { page, categories } = await setup();
    const retry = jest.spyOn(categories, 'retry');
    await page.retry();
    expect(retry).toHaveBeenCalled();
  });
});
