import {
  CATEGORY_KINDS,
  Category,
  CategoryKind,
  isCategoryKind,
} from './category';

describe('Category model', () => {
  it('exposes the supported category kinds and rejects unknown values', () => {
    expect(CATEGORY_KINDS).toEqual(['daily', 'shopping', 'list']);
    expect(isCategoryKind('daily')).toBe(true);
    expect(isCategoryKind('shopping')).toBe(true);
    expect(isCategoryKind('list')).toBe(true);
    expect(isCategoryKind('default')).toBe(false);
    expect(isCategoryKind('work')).toBe(false);
    expect(isCategoryKind(42)).toBe(false);
    expect(isCategoryKind(null)).toBe(false);
  });

  it('keeps the required identifiers and labels in the shape', () => {
    const category: Category = {
      id: 'c-1',
      name: 'Errands',
      kind: 'daily',
      icon: 'list',
      colorToken: 'todo',
    };
    expect(category.id).toBe('c-1');
    expect(category.name).toBe('Errands');
    expect<CategoryKind>(category.kind).toBe('daily');
  });
});
