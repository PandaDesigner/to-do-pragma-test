import {
  CATEGORY_SECTION,
  getCategorySection,
  isCategorySection,
  parseCategorySection,
  type Category,
} from './category';

const category: Category = {
  id: 'c',
  name: 'Lista',
  kind: 'list',
  colorToken: 'my',
  icon: 'list',
};

describe('Category sections', () => {
  it('[CAT-SEC-01.2] treats legacy categories as General without changing the record', () => {
    expect(getCategorySection(category)).toBe(CATEGORY_SECTION.GENERAL);
    expect(category).not.toHaveProperty('section');
  });

  it.each(['general', 'routine', 'event'] as const)(
    '[CAT-SEC-01.1] accepts and reads section %s',
    (section) => {
      expect(isCategorySection(section)).toBe(true);
      expect(parseCategorySection(section)).toBe(section);
      expect(getCategorySection({ ...category, section })).toBe(section);
    },
  );

  it.each([undefined, null, '', 'unknown', 3])(
    '[CAT-SEC-01.4] rejects an unknown explicit section %s',
    (section) => {
      expect(isCategorySection(section)).toBe(false);
      expect(() => parseCategorySection(section)).toThrow(
        'Sección de categoría no válida',
      );
    },
  );

  it('[CAT-SEC-01.3] keeps the section independent of name, kind and color', () => {
    expect(
      getCategorySection({
        ...category,
        name: 'Event',
        kind: 'daily',
        colorToken: 'event',
        section: CATEGORY_SECTION.ROUTINE,
      }),
    ).toBe(CATEGORY_SECTION.ROUTINE);
  });
});
