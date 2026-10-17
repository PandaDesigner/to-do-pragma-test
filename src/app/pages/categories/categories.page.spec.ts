import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../assets/i18n/en.json';
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

  it('exposes retry that delegates to the store', async () => {
    const { page, categories } = await setup();
    const retry = jest.spyOn(categories, 'retry');
    await page.retry();
    expect(retry).toHaveBeenCalled();
  });
});