## Why

The live app already stores categories, paginates the task list, and translates settings. Four behaviors from the technical test were still hardcoded or absent: the swipe delete control on a row, the shopping list rendered as notes, the TODAY control returning to the unfiltered day, and Spanish/English copy on the rail, shell retry, categories page, category sheet, task row, and task editor.

## What Changes

- A task row reveals a trailing delete control through the Ionic end option. Opening it does not delete. The click goes through the existing deletion confirmation.
- Selecting a category whose kind is `shopping` shows the notes header, hides the pending-day panel, and renders each row without a checkbox or due-date meta.
- TODAY clears the category filter, restores the view statuses, reopens the pending panel, and scrolls the list to the top. The task list stays paginated.
- User-facing strings on the rail, shell retry, categories page, category sheet, task row, and task editor come from `src/assets/i18n/{en,es}.json`. The task editor duration presets, the create-category link, and the save and cancel buttons were literals and now resolve from the locale files.

## Capabilities

### New Capabilities

- `finish-remaining-ui`: shopping notes layout, TODAY reset, and the remaining screen copy.

### Modified Capabilities

- `todo-screen`: a shopping category changes the list header and row variant, and TODAY is a button.
- `i18n`: rail, shell, categories, sheet, task row, and editor keys.

## Impact

UI on the tasks page, task row, categories page, category sheet, and shell. Figma: 4:440, 4:617 and 4:1404. No new dependency. Pagination of the task list stays. `CategorySheetComponent` keeps its existing store injection.

## Known limits

`docs/design.md` maps the swipe to the sliding option and the confirm dialog to Figma 4:1404. This change covers the sliding option and does not replace it; the scenario id `SWIPE-02.1` was dropped because `todo-screen` already names that behavior as `SWIPE-01.1` and `SWIPE-01.2`.

The captures in `evidence/` are 375x812 browser captures of the task screen and the shopping-notes state. They are not a 2px Figma diff and they are not from a simulator.

## Out of scope

Signed IPA, README Lighthouse numbers, per-tab section cache, filtered pager, Remote Config, and F6 traceability rows that were already marked as registry-only.