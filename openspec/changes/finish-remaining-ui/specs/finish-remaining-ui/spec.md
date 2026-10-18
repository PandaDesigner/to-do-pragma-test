## ADDED Requirements

### Requirement: Swipe reveals delete

A task row MUST reveal a trailing delete control after a horizontal drag of at least 80px to the left. The gesture MUST NOT emit removal. Activating the revealed control MUST emit the same remove event as the trash button. Figma: 4:440.

#### Scenario: [TODO-10.1] An 80px swipe opens delete on a note row

- **GIVEN** a row rendered with `variant` `note`, conforme a Figma 4:440
- **WHEN** the pointer moves 100px to the left and is released
- **THEN** the checkbox is absent, the note bullet is present, and the trailing delete control is open
- **AND** clicking that control emits `remove` with the task id

### Requirement: Shopping categories render as notes

When the selected category kind is `shopping`, the tasks page MUST show the notes overline and the category name, MUST hide the pending-day panel, and MUST render rows as notes. Filtering MUST still limit the list to that category. Figma: 4:440.

#### Scenario: [TODO-04.2] A shopping chip switches the list to notes

- **GIVEN** a shopping category with an earlier open task, conforme a Figma 4:440
- **WHEN** its chip is selected
- **THEN** the page shows "My notes" in English
- **AND** the pending panel is absent
- **AND** the row has a note bullet and no checkbox

### Requirement: TODAY resets the day view

The today badge MUST be a button. Activating it MUST clear the category filter, restore the default view statuses, reopen the pending panel, and scroll the list to the top. Figma: 4:440.

#### Scenario: [TODO-01.3] TODAY leaves notes mode and reopens the pending panel

- **GIVEN** a shopping category is selected and the pending panel is closed, conforme a Figma 4:440
- **WHEN** the today badge is activated
- **THEN** the category filter is cleared
- **AND** the pending panel is visible

### Requirement: Remaining chrome uses the locale files

The rail, shell retry, categories page, category sheet, task row, and task editor MUST read their labels from `src/assets/i18n/en.json` and `src/assets/i18n/es.json`. Figma: 4:440.

#### Scenario: [TODO-01.1] The Spanish rail uses the locale labels

- **GIVEN** the shell is rendered in Spanish, conforme a Figma 4:440
- **THEN** the rail labels are Todo, Rutina, Evento, Categoría, and Más
