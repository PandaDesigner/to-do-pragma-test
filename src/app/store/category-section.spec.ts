import type { Category } from '../domain/category';
import { getCategorySection } from '../domain/category';
import { configurePageTesting } from '../testing/page.fixture';

const legacy: Category = { id: 'old', name: 'Old', kind: 'list', colorToken: 'my', icon: 'list' };

describe('Stored category sections', () => {
  it('[CAT-SEC-01.2] loads legacy records without rewriting them', async () => {
    const { categories, categoryRepository } = configurePageTesting();
    await categoryRepository.save(legacy);
    const save = jest.spyOn(categoryRepository, 'save');
    await categories.refresh();
    expect(getCategorySection(categories.categories()[0])).toBe('general');
    expect(save).not.toHaveBeenCalled();
    expect(await categoryRepository.list()).toEqual([legacy]);
  });

  it('[CAT-SEC-01.4] rejects invalid stored sections and permits retry', async () => {
    const { categories, categoryRepository } = configurePageTesting();
    await categoryRepository.save(legacy);
    await categories.refresh();
    jest.spyOn(categoryRepository, 'list').mockResolvedValueOnce([
      { ...legacy, section: 'unknown' } as unknown as Category,
    ]);
    await expect(categories.refresh()).rejects.toThrow('Sección de categoría no válida');
    expect(categories.error()).toContain('Sección de categoría no válida');
    expect(categories.categories()).toEqual([legacy]);
    await categories.retry();
    expect(categories.error()).toBeNull();
    expect(categories.categories()).toEqual([legacy]);
  });
});
