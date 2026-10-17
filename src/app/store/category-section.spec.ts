import type { Category } from '../domain/category';
import { CATEGORY_SECTION } from '../domain/category/category-section';
import { configurePageTesting } from '../testing/page.fixture';

const legacy: Category = { id: 'old', name: 'Old', kind: 'list', colorToken: 'my', icon: 'list' };

describe('CategoryStore section handling', () => {
  it('[DATA-SEC-01.1] loads legacy categories as general without rewriting them', async () => {
    const { categories, categoryRepository } = configurePageTesting();
    await categoryRepository.save(legacy);
    const save = jest.spyOn(categoryRepository, 'save');
    await categories.refresh();
    const stored = await categoryRepository.list();
    expect(stored[0].name).toBe('Old');
    expect(save).not.toHaveBeenCalled();
  });

  it('parses explicit sections stored on disk', async () => {
    const { categories, categoryRepository } = configurePageTesting();
    await categoryRepository.save({ ...legacy, section: CATEGORY_SECTION.ROUTINE });
    await categories.refresh();
    const stored = await categoryRepository.list();
    expect(stored[0].section).toBe(CATEGORY_SECTION.ROUTINE);
  });

  it('[CAT-SEC-01.4] rejects a stored section that is not part of the enum', async () => {
    const { categories, categoryRepository } = configurePageTesting();
    await categoryRepository.save({ ...legacy, section: 'unknown' as unknown as Category['section'] });
    await expect(categories.refresh()).rejects.toThrow('Sección de categoría no válida');
    expect(categories.error()).toContain('Sección de categoría no válida');
  });

  it('preserves legacy records on disk after refresh', async () => {
    const { categories, categoryRepository } = configurePageTesting();
    await categoryRepository.save(legacy);
    await categories.refresh();
    const stored = await categoryRepository.list();
    expect(stored[0].name).toBe('Old');
    expect(stored[0].section).toBeUndefined();
  });

  it('[CAT-SEC-02.1] refreshing after moving a category updates visible tasks', async () => {
    const { categories, categoryRepository, tasks, taskRepository } = configurePageTesting();
    await categoryRepository.save({ ...legacy, section: CATEGORY_SECTION.ROUTINE });
    await taskRepository.save({ id: 't1', title: 'Squat', status: 'pending', categoryId: 'old', dueDate: '2026-02-23', createdAt: 0, updatedAt: 0 });
    await categories.refresh();
    await tasks.refresh();
    expect(tasks.tasks()[0].categoryId).toBe('old');
    await categoryRepository.save({ ...legacy, section: CATEGORY_SECTION.EVENT });
    await categories.refresh();
    expect(tasks.tasks()[0].categoryId).toBe('old');
  });
});
