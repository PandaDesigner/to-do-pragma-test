## Why

The live app already stores categories, paginates the task list, and translates settings. Four behaviors from the technical test were still hardcoded or absent: swipe-to-delete on a row, the shopping list rendered as notes, the TODAY control returning to the unfiltered day, and Spanish/English copy on the rail, shell, categories, category sheet, task row, and task editor.

## What Changes

- A task row reveals a trailing delete control after a left swipe of 80px. The click still goes through the existing deletion confirmation. The gesture itself does not delete.
- Selecting a category whose kind is `shopping` shows the notes header, hides the pending-day panel, and renders each row without a checkbox or due-date meta.
- TODAY clears the category filter, restores the view statuses, reopens the pending panel, and scrolls the list to the top. The task list stays paginated.
- User-facing strings on the rail, shell retry, categories page, category sheet, task row, and task editor come from `src/assets/i18n/{en,es}.json`.

## Capabilities

### New Capabilities

- `finish-remaining-ui`: swipe reveal, shopping notes layout, TODAY reset, and the remaining screen copy.

### Modified Capabilities

- `todo-screen`: TODAY is a button, and a shopping category changes the list header and row variant.
- `i18n`: rail, shell, categories, sheet, task row, and editor keys.

## Impact

UI on the tasks page, task row, categories page, category sheet, and shell. Figma: 4:440 for the task screen. No new dependency. Pagination of the task list stays. `CategorySheetComponent` keeps its existing store injection.

## Known limit

The row uses a pointer handler. `docs/design.md` maps the swipe to `ion-item-sliding` and the confirm dialog to Figma `4:1404`. This change does not replace that handler. The scenario id `TODO-10.1` belongs to this pointer test and collides with the delivery id for the empty-section filter. Rename it to `SWIPE-01.1` before opening `fix-delivery-functional`. Visual captures at 375x812 were not taken: Chrome stable is not installed.

## Out of scope

Signed IPA, README Lighthouse numbers, per-tab section cache, filtered pager, Remote Config, and F6 traceability rows that were already marked as registry-only.
