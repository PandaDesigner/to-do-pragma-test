export const CATEGORY_KIND = {
  DAILY: 'daily',
  SHOPPING: 'shopping',
  LIST: 'list',
} as const;
export type CategoryKind = (typeof CATEGORY_KIND)[keyof typeof CATEGORY_KIND];
export const CATEGORY_KINDS = Object.values(CATEGORY_KIND);

export function isCategoryKind(value: unknown): value is CategoryKind {
  return (
    typeof value === 'string' &&
    (CATEGORY_KINDS as readonly string[]).includes(value)
  );
}

export const CATEGORY_SECTION = {
  GENERAL: 'general',
  ROUTINE: 'routine',
  EVENT: 'event',
} as const;
export type CategorySection =
  (typeof CATEGORY_SECTION)[keyof typeof CATEGORY_SECTION];
export const CATEGORY_SECTIONS = Object.values(CATEGORY_SECTION);

export function isCategorySection(value: unknown): value is CategorySection {
  return (
    typeof value === 'string' &&
    (CATEGORY_SECTIONS as readonly string[]).includes(value)
  );
}

export function parseCategorySection(value: unknown): CategorySection {
  if (!isCategorySection(value)) {
    throw new Error('Sección de categoría no válida: ' + String(value));
  }
  return value;
}

export function getCategorySection(category: Category): CategorySection {
  return category.section ?? CATEGORY_SECTION.GENERAL;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  colorToken: string;
  kind: CategoryKind;
  section?: CategorySection;
}
