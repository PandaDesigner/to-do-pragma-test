export const CATEGORY_KINDS = ['daily', 'shopping', 'default'] as const;
export type CategoryKind = (typeof CATEGORY_KINDS)[number];

export function isCategoryKind(value: unknown): value is CategoryKind {
  return (
    typeof value === 'string' &&
    (CATEGORY_KINDS as readonly string[]).includes(value)
  );
}

export type Category = {
  id: string;
  name: string;
  kind: CategoryKind;
};
