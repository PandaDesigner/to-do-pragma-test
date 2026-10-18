import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../../assets/i18n/en.json';
import { InMemoryRepository } from '../../../data/repositories/in-memory-repository';
import {
  CLOCK,
  CATEGORY_REPOSITORY,
  TASK_REPOSITORY,
} from '../../../core/di/tokens';
import { CATEGORY_KIND, type Category } from '../../../domain/category';
import { CATEGORY_SECTION } from '../../../domain/category/category-section';
import { filterTasksBySection } from '../../../domain/category/filter-by-section';
import { TASK_STATUS, type Task } from '../../../domain/task';
import { TaskStore } from '../../../store/task';
import { CategoryStore } from '../../../store/category';
import { CategorySheetComponent } from './category-sheet.component';

async function setup() {
  const repository = new InMemoryRepository<Category>();
  const taskRepository = new InMemoryRepository<Task>();
  TestBed.configureTestingModule({
    imports: [CategorySheetComponent],
    providers: [
      provideIonicAngular({}),
      provideTranslateService({ fallbackLang: 'en' }),
      TaskStore,
      CategoryStore,
      { provide: CATEGORY_REPOSITORY, useValue: repository },
      { provide: TASK_REPOSITORY, useValue: taskRepository },
      {
        provide: CLOCK,
        useValue: { today: () => '2026-01-02', now: () => 100 },
      },
    ],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  // jsdom leaves shadowRoot.activeElement null, so the sheet handle focus trap recurses.
  jest.spyOn(HTMLElement.prototype, 'focus').mockImplementation(() => undefined);
  const store = TestBed.inject(CategoryStore);
  const fixture = TestBed.createComponent(CategorySheetComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  fixture.detectChanges();
  return { store, fixture, repository };
}

const draft: Category = {
  id: 'c1',
  name: 'Shopping',
  icon: 'cart',
  colorToken: 'routine',
  kind: CATEGORY_KIND.LIST,
  section: 'routine',
};

describe('CategorySheetComponent', () => {
  afterEach(() => {
    document.querySelectorAll('ion-modal').forEach((modal) => modal.remove());
  });

  it('[SHEET-01.1] shows "New category" title in Create mode without Delete conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'create' });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(fixture.componentInstance.title()).toBe('New category');
    expect(fixture.componentInstance.mode()).toBe('create');
  });

  it('[SHEET-01.2] shows "Edit category" title with draft values and Delete in Edit mode conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'edit', draft });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(fixture.componentInstance.title()).toBe('Edit category');
    expect(fixture.componentInstance.name()).toBe('Shopping');
    expect(fixture.componentInstance.icon()).toBe('cart');
    expect(fixture.componentInstance.mode()).toBe('edit');
  });

  it('[SHEET-01.4] exposes a presentational sheet ready to bind to ion-modal conforme a Figma 4:947', async () => {
    const { store, fixture } = await setup();
    expect(fixture.componentInstance.isOpen()).toBe(false);
    store.openCategorySheet({ mode: 'create' });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen()).toBe(true);
  });

  it('[SHEET-02.1] exposes twelve icon entries and marks the draft one as selected conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'edit', draft });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(fixture.componentInstance.icons).toHaveLength(12);
    expect(fixture.componentInstance.icon()).toBe('cart');
  });

  it('[SHEET-02.2] updates the selection when a different key is chosen', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'create' });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    fixture.componentInstance.chooseIcon('star');
    fixture.detectChanges();
    expect(fixture.componentInstance.icon()).toBe('star');
  });

  it('[SHEET-03.1] exposes six color swatches in the agreed order with the draft one selected conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'edit', draft });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(fixture.componentInstance.colors).toHaveLength(6);
    expect(fixture.componentInstance.colors.map((entry) => entry.key)).toEqual([
      'routine',
      'event',
      'my',
      'more',
      'more-gray',
      'primary',
    ]);
    expect(fixture.componentInstance.colorToken()).toBe('routine');
  });

  it('[SHEET-03.2] moves the ring and check to the chosen swatch conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'edit', draft });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.componentInstance.chooseColor('primary');
    fixture.detectChanges();
    expect(fixture.componentInstance.colorToken()).toBe('primary');
    expect(
      fixture.componentInstance.colors
        .filter((entry) => entry.key === fixture.componentInstance.colorToken())
        .map((entry) => entry.key),
    ).toEqual(['primary']);
  });

  it('[SHEET-04.1] derives the preview label from the current name signal conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'edit', draft });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(fixture.componentInstance.name()).toBe('Shopping');
    fixture.componentInstance.onName('Compras');
    fixture.detectChanges();
    expect(fixture.componentInstance.name()).toBe('Compras');
  });

  it('[SHEET-05.1] blocks save when the name is empty conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'create' });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    fixture.componentInstance.onName('   ');
    fixture.detectChanges();
    expect(fixture.componentInstance.canSave()).toBe(false);
    const save = jest.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.submit();
    expect(save).not.toHaveBeenCalled();
  });

  it('[SHEET-05.2] emits save with the chosen fields and closes the sheet conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'create' });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    fixture.componentInstance.onName('Compras');
    fixture.componentInstance.chooseIcon('star');
    fixture.componentInstance.chooseColor('primary');
    const save = jest.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Compras',
        icon: 'star',
        colorToken: 'primary',
      }),
    );
    expect(store.sheetRequest()).toBeNull();
  });

  it('[SHEET-05.3] emits delete with the draft id in Edit mode and closes the sheet conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'edit', draft });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) =>
      (resolve as (v: void) => void)(undefined),
    );
    fixture.detectChanges();
    const remove = jest.spyOn(fixture.componentInstance.delete, 'emit');
    fixture.componentInstance.remove();
    expect(remove).toHaveBeenCalledWith('c1');
    expect(store.sheetRequest()).toBeNull();
  });

  it('[SHEET-05.5] cancels a new category without saving conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'create' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.componentInstance.onName('Compras');
    const save = jest.spyOn(fixture.componentInstance.save, 'emit');
    const modal = [...document.querySelectorAll('ion-modal')].at(-1) as
      | (HTMLElement & { initialBreakpoint?: number; breakpoints?: number[] })
      | undefined;
    const cancel = [...(modal?.querySelectorAll('button') ?? [])].find(
      (button) => button.textContent?.trim() === 'Cancel',
    );
    expect(modal).toBeTruthy();
    expect(modal?.initialBreakpoint).toBe(0.8);
    expect(modal?.breakpoints).toEqual([0, 0.5, 0.8]);
    expect(modal.getAttribute('handlebehavior')).toBe('cycle');
    expect(cancel).toBeTruthy();
    const dismiss = jest.spyOn(fixture.componentInstance, 'dismiss');
    cancel!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(dismiss).toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
    expect(store.sheetRequest()).toBeNull();
    expect(fixture.componentInstance.name()).toBe('');
  });

  it('[SHEET-05.4] guards delete in Create mode without an editing id conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'create' });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) =>
      (resolve as (v: void) => void)(undefined),
    );
    fixture.detectChanges();
    const remove = jest.spyOn(fixture.componentInstance.delete, 'emit');
    fixture.componentInstance.remove();
    expect(remove).not.toHaveBeenCalled();
  });

  it('[SHEET-07.1] renders the three section entries with the draft one selected conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'edit', draft });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) =>
      (resolve as (v: void) => void)(undefined),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.sectionLabels()).toHaveLength(3);
    expect(fixture.componentInstance.section()).toBe('routine');
  });

  it('[SHEET-07.2] treats a legacy category without section as General and does not rewrite tasks conforme a Figma 4:869', async () => {
    const { store, fixture, repository } = await setup();
    const legacy: Category = {
      id: 'legacy',
      name: 'Old',
      icon: 'cart',
      colorToken: 'routine',
      kind: CATEGORY_KIND.LIST,
    };
    await repository.save(legacy);
    await store.refresh();
    store.openCategorySheet({ mode: 'edit', draft: legacy });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.section()).toBe(CATEGORY_SECTION.GENERAL);
    const save = jest.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.onName('Old');
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'legacy',
        section: CATEGORY_SECTION.GENERAL,
      }),
    );
    expect(await repository.list()).toEqual([legacy]);
  });

  it('[CAT-SEC-01.5] persists a section change to Event and keeps task ids conforme a Figma 4:869', async () => {
    const { store, fixture } = await setup();
    const task: Task = {
      id: 't1',
      title: 'Buy milk',
      status: TASK_STATUS.PENDING,
      categoryId: draft.id,
      dueDate: '2026-01-02',
      createdAt: 100,
      updatedAt: 100,
    };
    await store.upsert(draft);
    store.openCategorySheet({ mode: 'edit', draft });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.componentInstance.chooseSection(CATEGORY_SECTION.EVENT);
    const save = jest.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.submit();
    const saved = save.mock.calls[0][0] as Category;
    expect(saved.section).toBe(CATEGORY_SECTION.EVENT);
    expect(saved.id).toBe(draft.id);
    const visible = filterTasksBySection(
      [task],
      [{ ...draft, section: saved.section }],
      CATEGORY_SECTION.EVENT,
    );
    expect(visible.map((item) => item.id)).toEqual(['t1']);
    expect(task.id).toBe('t1');
    expect(task.categoryId).toBe(draft.id);
  });

  it('dismisses the sheet and resets internal state', async () => {
    const { store, fixture } = await setup();
    store.openCategorySheet({ mode: 'create' });
    fixture.detectChanges();
    fixture.componentInstance.onName('Temporal');
    fixture.componentInstance.chooseIcon('star');
    fixture.componentInstance.chooseColor('my');
    fixture.componentInstance.chooseSection('event');
    fixture.componentInstance.dismiss();
    fixture.detectChanges();
    expect(fixture.componentInstance.name()).toBe('');
    expect(fixture.componentInstance.icon()).toBe('cart');
    expect(fixture.componentInstance.colorToken()).toBe('routine');
    expect(fixture.componentInstance.section()).toBe('general');
    expect(fixture.componentInstance.editingId()).toBeNull();
  });

  it('preserves the existing kind when editing a stored category', async () => {
    const { store, fixture } = await setup();
    const stored = {
      id: 'c1',
      name: 'Shopping',
      icon: 'cart',
      colorToken: 'routine',
      kind: 'daily' as const,
      section: 'routine' as const,
    };
    await store.upsert(stored);
    store.openCategorySheet({ mode: 'edit', draft: stored });
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) =>
      (resolve as (v: void) => void)(undefined),
    );
    fixture.detectChanges();
    const save = jest.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'c1', kind: 'daily' }),
    );
  });

  it('exposes a fill colour for every sheet key', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    for (const key of [
      'routine',
      'event',
      'my',
      'more',
      'more-gray',
      'primary',
    ]) {
      expect(component.fillColor(key as never)).toMatch(/var\(--app-category-/);
    }
  });
});
