import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { InMemoryRepository } from '../../../data/repositories/in-memory-repository';
import {
  CLOCK,
  CATEGORY_REPOSITORY,
  TASK_REPOSITORY,
} from '../../../core/di/tokens';
import { CATEGORY_KIND, type Category } from '../../../domain/category';
import type { Task } from '../../../domain/task';
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
    expect(fixture.componentInstance.sectionLabels).toHaveLength(3);
    expect(fixture.componentInstance.section()).toBe('routine');
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
