export const CATEGORY_SECTION = {
  GENERAL: 'general',
  ROUTINE: 'routine',
  EVENT: 'event',
} as const;

export type CategorySection =
  (typeof CATEGORY_SECTION)[keyof typeof CATEGORY_SECTION];

export const CATEGORY_SECTIONS = Object.values(CATEGORY_SECTION);

export const DEFAULT_CATEGORY_SECTION: CategorySection =
  CATEGORY_SECTION.GENERAL;

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

export function getCategorySection(
  value: CategorySection | undefined,
): CategorySection {
  return value ?? DEFAULT_CATEGORY_SECTION;
}
