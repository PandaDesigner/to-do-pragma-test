import {
  DEFAULT_CATEGORY_SECTION,
  isCategorySection,
  parseCategorySection,
  type CategorySection,
} from './category-section';

describe('CategorySection', () => {
  it.each(['general', 'routine', 'event'] as const)(
    'accepts %s as a valid category section',
    (value) => {
      expect(isCategorySection(value)).toBe(true);
      expect(parseCategorySection(value)).toBe(value);
    },
  );

  it('defaults to general when none is provided', () => {
    expect(DEFAULT_CATEGORY_SECTION).toBe<CategorySection>('general');
  });

  it.each([undefined, null, '', 'unknown', 0, {}])(
    'rejects %s as an unknown section',
    (value) => {
      expect(isCategorySection(value)).toBe(false);
      expect(() => parseCategorySection(value)).toThrow(
        'Sección de categoría no válida',
      );
    },
  );
});
