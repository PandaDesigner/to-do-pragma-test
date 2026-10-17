import type { Category } from '../../domain/category';
import {
  CATEGORY_SECTION,
  type CategorySection,
} from '../../domain/category/category-section';

export function sectionContainsCategory(
  section: CategorySection,
  category: Category,
): boolean {
  if (section === CATEGORY_SECTION.GENERAL) {
    return (
      category.section === undefined ||
      category.section === CATEGORY_SECTION.GENERAL
    );
  }
  return category.section === section;
}
