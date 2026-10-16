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

export interface Category {
  id: string;
  name: string;
  icon: string;
  colorToken: string;
  kind: CategoryKind;
}
