import { TestBed } from '@angular/core/testing';
import { CategoriesPage } from './categories.page';
import { configurePageTesting } from '../../testing/page.fixture';
import { taskFixture } from '../../testing/task.fixture';

describe('CategoriesPage', () => {
  async function setup() {
    const dependencies = configurePageTesting();
    const fixture = TestBed.createComponent(CategoriesPage);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    return { ...dependencies, fixture, page: fixture.componentInstance };
  }

  it('validates, creates and edits categories and leaves assigned tasks uncategorized on delete', async () => {
    const { page, categories, tasks, confirm } = await setup();
    await page.saveCategory();
    expect(categories.categories()).toEqual([]);
    page.form.controls.name.setValue(' Compras ');
    await page.saveCategory();
    const category = categories.categories()[0];
    expect(category.name).toBe('Compras');
    await tasks.upsert(
      taskFixture({ categoryId: category.id, dueDate: '2026-01-03' }),
    );
    expect(page.taskCounts().get(category.id)).toBe(1);
    page.editCategory(category);
    page.form.controls.name.setValue('Shopping');
    await page.saveCategory();
    expect(categories.categories()).toHaveLength(1);
    expect(categories.categories()[0].name).toBe('Shopping');
    confirm.mockResolvedValueOnce(false);
    await page.removeCategory(category);
    expect(categories.categories()).toHaveLength(1);
    await page.removeCategory(category);
    expect(categories.categories()).toEqual([]);
    expect(tasks.tasks()[0].categoryId).toBeNull();
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

  it('prevents writes when disabled and rejects invalid kind/color and vanished categories', async () => {
    const { page, enabled, fixture } = await setup();
    page.form.controls.name.setValue('Test');
    enabled.set(false);
    await page.saveCategory();
    expect(page.feedback.error()).toContain('deshabilitadas');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    await page.removeCategory({
      id: 'c',
      name: 'C',
      kind: 'list',
      icon: 'list',
      colorToken: 'my',
    });
    expect(page.feedback.error()).toContain('deshabilitadas');
    enabled.set(true);
    page.form.controls.kind.setValue('invalid');
    await page.saveCategory();
    expect(page.feedback.error()).toContain('no válido');
    page.form.controls.kind.setValue('list');
    page.editingId.set('missing');
    await page.saveCategory();
    expect(page.feedback.error()).toContain('ya no existe');
  });

  it('exposes write failures and permits retry', async () => {
    const { page, categoryRepository, categories } = await setup();
    jest
      .spyOn(categoryRepository, 'save')
      .mockRejectedValueOnce(new Error('offline'));
    page.form.controls.name.setValue('Test');
    await page.saveCategory();
    expect(page.feedback.error()).toBe('offline');
    await page.retry();
    expect(categories.categories()).toHaveLength(1);
  });
});
