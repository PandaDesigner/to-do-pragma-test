import {
  CATEGORY_SECTION,
  getCategorySection,
  type CategorySection,
} from './category-section';
import type { Category } from '../category';
import type { Task } from '../task';

export type CategoryBySection = Map<CategorySection, Set<string>>;

export function indexCategoriesBySection(
  categories: readonly Category[],
): CategoryBySection {
  const index: CategoryBySection = new Map();
  for (const category of categories) {
    const section = getCategorySection(category.section);
    if (section === CATEGORY_SECTION.GENERAL) {
      continue;
    }
    const ids = index.get(section) ?? new Set<string>();
    ids.add(category.id);
    index.set(section, ids);
  }
  return index;
}

export function filterTasksBySection(
  tasks: readonly Task[],
  categories: readonly Category[],
  section: CategorySection,
): Task[] {
  if (categories.length === 0) {
    return [...tasks];
  }
  if (section === CATEGORY_SECTION.GENERAL) {
    const generalCategoryIds = new Set(
      categories
        .filter((category) => getCategorySection(category.section) === CATEGORY_SECTION.GENERAL)
        .map((category) => category.id),
    );
    return tasks.filter(
      (task) => task.categoryId === null || generalCategoryIds.has(task.categoryId),
    );
  }
  const ids = indexCategoriesBySection(categories).get(section) ?? new Set<string>();
  return tasks.filter((task) => task.categoryId !== null && ids.has(task.categoryId));
}
