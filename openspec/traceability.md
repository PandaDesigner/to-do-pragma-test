# Trazabilidad Figma

Matriz inicial de F0. `registro` anota un nodo de Figma sin escenario todavía. Cuando una fila tenga un identificador de escenario, `npm run trace:check` falla si ese identificador no aparece en un test. También falla si falta un nodo de `docs/design.json`.

| Figma node | pantalla | mock | Req ID | Scenario | Tarea | Test (archivo:it) | Evidencia light/dark | PR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | TODO-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:520 | todo-panel-closed | docs/mocks/todo-panel-closed.png | TODO-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:617 | my-notes-shopping | docs/mocks/my-notes-shopping.png | NOTE-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:664 | todo-completed-task | docs/mocks/todo-completed-task.png | TODO-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:788 | categories-list | docs/mocks/categories-list.png | CAT-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | CAT-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:947 | categories-form-sheet-panel | docs/mocks/categories-form-sheet.png | CAT-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:973 | todo-filtered-by-category | docs/mocks/todo-filtered-by-category.png | TODO-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:1062 | todo-empty-state | docs/mocks/todo-empty-state.png | TODO-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:1113 | todo-categories-flag-off | docs/mocks/todo-categories-flag-off.png | FLAG-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:1267 | new-task-modal | docs/mocks/new-task-modal.png | TASK-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:1365 | new-task-sheet-panel | docs/mocks/new-task-modal.png | TASK-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:1404 | todo-swipe-delete-confirm | docs/mocks/todo-swipe-delete-confirm.png | TODO-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:1496 | more-settings | docs/mocks/more-settings.png | SET-01 | SET-01.1 | i18n | src/app/pages/settings/settings.page.spec.ts:[SET-01.1] | openspec/changes/archive/2026-10-17-i18n/evidence/more-settings-{light,dark}-{es,en}.png | #11 |
| 4:1496 | more-settings | docs/mocks/more-settings.png | SET-01 | SET-01.2 | i18n | src/app/pages/settings/settings.page.spec.ts:[SET-01.2] | openspec/changes/archive/2026-10-17-i18n/evidence/more-settings-{light,dark}-{es,en}.png | #11 |
| 4:1496 | more-settings | docs/mocks/more-settings.png | I18N-01 | I18N-01.1 | i18n | src/app/pages/settings/settings.page.spec.ts:[I18N-01.1] | openspec/changes/archive/2026-10-17-i18n/evidence/more-settings-{light,dark}-{es,en}.png | #11 |
| 4:1496 | more-settings | docs/mocks/more-settings.png | I18N-01 | I18N-01.2 | i18n | src/app/core/settings/translations.spec.ts:[I18N-01.2] | openspec/changes/archive/2026-10-17-i18n/evidence/more-settings-{light,dark}-{es,en}.png | #11 |
| 4:1560 | todo-dark-mode | docs/mocks/todo-dark-mode.png | UI-22 | UI-22.1 | theme-aliases | src/theme/dark.spec.ts:[UI-22.1] | pendiente | pendiente |
| 4:1560 | todo-dark-mode | docs/mocks/todo-dark-mode.png | UI-22 | UI-22.2 | theme-aliases | src/theme/dark.spec.ts:[UI-22.2] | pendiente | pendiente |
| 4:1560 | todo-dark-mode | docs/mocks/todo-dark-mode.png | UI-22 | UI-22.3 | theme-aliases | src/theme/theme-preference.spec.ts:[UI-22.3] | pendiente | pendiente |
