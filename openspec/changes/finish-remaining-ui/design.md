## Approach

Keep the existing page → store → domain path. `TasksPage` decides the notes layout from `availableCategories()` when `categoryId` matches `CATEGORY_KIND.SHOPPING`. `TaskItemComponent` stays presentational: a `variant` input of `task | note`, and the deletion control lives in the Ionic end option. Removal is still `remove` → `DeletionConfirmation` → `store.remove`.

`focusToday()` calls `setCategory(undefined)`, restores `VIEW_STATUSES`, opens the pending panel, and scrolls the list. It does not navigate, because the control lives on the tasks page.

Copy uses `TranslatePipe` and `TranslateService.instant` with the existing `en` / `es` files. Section chips in the category sheet read `sectionLabels()`, a computed of `{ key, label }`.

## Decisions

- Task-list virtual scroll stays out. The 5,000-task test still expects a pager of 20.
- The row uses the Ionic sliding option rather than a pointer handler. `docs/design.md` maps the swipe to that control, and `todo-screen` already specifies it as `SWIPE-01.1`. A second pointer-based reveal would have duplicated the same behavior under a new id.
- Shopping notes do not change filtering. Chips and `visibleTasks` stay as they are.
- No new shared component. The row variant is one input on the component that already renders the row.
- The editor duration presets are locale keys instead of a formatter. The preset list is fixed and short, so a keyed string per value is simpler than a duration pipe.

## Risks

- `TranslateService.instant` inside a computed does not refresh if the language changes after the first read. The app sets the language at startup, which matches the current settings flow.
- The captures in `evidence/` are 375x812 browser captures. They do not prove a 2px match against Figma.

## Rollback

Revert the branch. No schema or storage migration.