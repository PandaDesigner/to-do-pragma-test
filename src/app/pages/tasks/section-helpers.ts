import { CATEGORY_SECTION, type CategorySection } from '../../domain/category/category-section';
import type { Category } from '../../domain/category';
import type { Task } from '../../domain/task';

export function taskBelongsToSection(
  task: Task,
  section: CategorySection,
  availableCategories: readonly Category[],
): boolean {
  if (section === CATEGORY_SECTION.GENERAL) {
    if (task.categoryId === null) {
      return true;
    }
    const category = availableCategories.find((entry) => entry.id === task.categoryId);
    return category === undefined || category.section === undefined || category.section === CATEGORY_SECTION.GENERAL;
  }
  if (task.categoryId === null) {
    return false;
  }
  const category = availableCategories.find((entry) => entry.id === task.categoryId);
  return category?.section === section;
}
