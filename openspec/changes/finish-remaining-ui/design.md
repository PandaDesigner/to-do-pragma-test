## Approach

Keep the existing page → store → domain path. `TasksPage` decides the notes layout from `availableCategories()` when `categoryId` matches `CATEGORY_KIND.SHOPPING`. `TaskItemComponent` stays presentational: a `variant` input of `task | note`, plus pointer handlers that only reveal a delete button. Removal is still `remove` → `DeletionConfirmation` → `store.remove`.

`focusToday()` calls `setCategory(undefined)`, restores `VIEW_STATUSES`, opens the pending panel, and scrolls the list. It does not navigate, because the control lives on the tasks page.

Copy uses `TranslatePipe` and `TranslateService.instant` with the existing `en` / `es` files. Section chips in the category sheet read `sectionLabels()`, a computed of `{ key, label }`.

## Decisions

- Task-list virtual scroll stays out. The 5,000-task test still expects a pager of 20.
- Swipe threshold is 80px, clamped to 96px. A short drag does not open the action.
- Shopping notes do not change filtering. Chips and `visibleTasks` stay as they are.
- No new shared component. The row variant is one input on the component that already renders the row.

## Risks

- `TranslateService.instant` inside a computed does not refresh if the language changes after the first read. The app sets the language at startup, which matches the current settings flow.
- Visual evidence at 375x812 was not captured in this change.

## Rollback

Revert the branch. No schema or storage migration.
