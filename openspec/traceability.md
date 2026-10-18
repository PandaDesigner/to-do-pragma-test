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
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-01 | SHEET-01.1 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-01.1] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-01 | SHEET-01.2 | category-sheet | src/app/pages/categories/categories.page.spec.ts:[SHEET-01.2] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:1267 | new-task-modal | docs/mocks/new-task-modal.png | SHEET-01 | SHEET-01.3 | category-sheet | src/app/pages/tasks/tasks.page.html:openCategorySheet | ausente: sin simulador (verify-report 6.1) | develop |
| 4:947 | categories-form-sheet-panel | docs/mocks/categories-form-sheet.png | SHEET-01 | SHEET-01.4 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-01.4] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-02 | SHEET-02.1 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-02.1] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-02 | SHEET-02.2 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-02.2] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-03 | SHEET-03.1 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-03.1] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-04 | SHEET-04.1 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-04.1] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-04 | SHEET-04.2 | category-sheet | src/app/shared/components/chip/chip.component.spec.ts:[SHEET-04.2] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-05 | SHEET-05.1 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-05.1] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-05 | SHEET-05.2 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-05.2] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-05 | SHEET-05.3 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-05.3] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-05 | SHEET-05.4 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-05.4] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-06 | SHEET-06.1 | category-sheet | src/app/store/category.spec.ts:[SHEET-06.1] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-06 | SHEET-06.2 | category-sheet | src/app/store/category.spec.ts:[SHEET-06.2] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-06 | SHEET-06.3 | category-sheet | src/app/store/category.spec.ts:[SHEET-06.3] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-07 | SHEET-07.1 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-07.1] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-03 | SHEET-03.2 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-03.2] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | SHEET-07 | SHEET-07.2 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-07.2] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | CAT-SEC-01 | CAT-SEC-01.5 | category-sheet | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[CAT-SEC-01.5] | ausente: sin simulador (verify-report 6.1) | develop |
| 4:973 | todo-filtered-by-category | docs/mocks/todo-filtered-by-category.png | TODO-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:1062 | todo-empty-state | docs/mocks/todo-empty-state.png | TODO-00 | registro | F6 | pendiente | pendiente | pendiente |
| 4:1062 | todo-empty-state | docs/mocks/todo-empty-state.png | FID-01 | CAT-UI-01.1 | fix-ui-fidelity | src/app/pages/categories/categories.page.spec.ts:[CAT-UI-01.1] | openspec/changes/fix-ui-fidelity/evidence/categories-empty-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:1062 | todo-empty-state | docs/mocks/todo-empty-state.png | FID-01 | CAT-UI-01.2 | fix-ui-fidelity | src/app/pages/categories/categories.page.spec.ts:[CAT-UI-01.2] | openspec/changes/fix-ui-fidelity/evidence/categories-empty-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:1062 | todo-empty-state | docs/mocks/todo-empty-state.png | FID-01 | CAT-UI-01.3 | fix-ui-fidelity | src/app/pages/categories/categories.page.spec.ts:[CAT-UI-01.3] | openspec/changes/fix-ui-fidelity/evidence/categories-empty-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | FID-02 | TODAY-UI-01.1 | fix-ui-fidelity | src/app/pages/tasks/tasks.page.spec.ts:[TODAY-UI-01.1] | openspec/changes/fix-ui-fidelity/evidence/today-badge-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | FID-02 | TODAY-UI-01.5 | fix-chevron-icon-binding | src/app/pages/tasks/today-badge-render.spec.ts:[TODAY-UI-01.5] | openspec/changes/fix-chevron-icon-binding/evidence/chevron-badge-{light,dark}-{es,en}.png | fix-chevron-icon-binding |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | FID-02 | TODAY-UI-01.6 | fix-chevron-icon-binding | src/app/pages/tasks/today-badge-render.spec.ts:[TODAY-UI-01.6] | openspec/changes/fix-chevron-icon-binding/evidence/chevron-badge-{light,dark}-{es,en}.png | fix-chevron-icon-binding |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | FID-02 | TODAY-UI-01.7 | fix-chevron-icon-binding | src/app/pages/tasks/today-badge-render.spec.ts:[TODAY-UI-01.7] | openspec/changes/fix-chevron-icon-binding/evidence/chevron-badge-{light,dark}-{es,en}.png | fix-chevron-icon-binding |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | FID-02 | TODAY-UI-01.4 | fix-ui-fidelity | src/app/pages/tasks/tasks.page.spec.ts:[TODAY-UI-01.4] | openspec/changes/fix-ui-fidelity/evidence/today-badge-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:520 | todo-panel-closed | docs/mocks/todo-panel-closed.png | FID-02 | TODAY-UI-01.2 | fix-ui-fidelity | src/app/core/settings/chrome-translations.spec.ts:[TODAY-UI-01.2] | openspec/changes/fix-ui-fidelity/evidence/today-badge-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:520 | todo-panel-closed | docs/mocks/todo-panel-closed.png | FID-02 | TODAY-UI-01.3 | fix-ui-fidelity | src/app/pages/tasks/tasks.page.spec.ts:[TODAY-UI-01.3] | openspec/changes/fix-ui-fidelity/evidence/today-badge-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | FID-03 | SHEET-UI-01.1 | fix-ui-fidelity | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-UI-01.1] | openspec/changes/fix-ui-fidelity/evidence/categories-sheet-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | FID-03 | SHEET-UI-01.2 | fix-ui-fidelity | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-UI-01.2] | openspec/changes/fix-ui-fidelity/evidence/categories-sheet-{light,dark}-{es,en}.png | fix-ui-fidelity |
| 4:869 | categories-form-sheet | docs/mocks/categories-form-sheet.png | FID-03 | SHEET-UI-01.3 | fix-ui-fidelity | src/app/shared/components/category-sheet/category-sheet.component.spec.ts:[SHEET-UI-01.3] | openspec/changes/fix-ui-fidelity/evidence/categories-sheet-{light,dark}-{es,en}.png | fix-ui-fidelity |
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
| -- | tasks-page | docs/mocks/tasks-page-libre.png | TSK-16 | TSK-16.1 | fix-tasks-fab-pager-layout | src/theme/todo-layout.spec.ts:[TSK-16.1] | pendiente (ausente: sin emulador) | #34 |
| -- | tasks-page | docs/mocks/tasks-page-libre.png | TSK-16 | TSK-16.2 | fix-tasks-fab-pager-layout | src/app/pages/tasks/tasks.page.spec.ts:contextual | pendiente (ausente: sin emulador) | #34 |
| -- | tasks-page | docs/mocks/tasks-page-libre.png | TSK-17 | TSK-17.1 | fix-tasks-fab-pager-layout | src/app/domain/pagination.spec.ts:variants | pendiente (ausente: sin emulador) | #34 |
| -- | tasks-page | docs/mocks/tasks-page-libre.png | TSK-17 | TSK-17.2 | fix-tasks-fab-pager-layout | src/app/pages/tasks/tasks.page.spec.ts:[TSK-17.2] | pendiente (ausente: sin emulador) | #34 |
| -- | tasks-page | docs/mocks/tasks-page-libre.png | TSK-17 | TSK-17.3 | fix-tasks-fab-pager-layout | src/app/store/task.spec.ts:[TSK-17.3] | pendiente (ausente: sin emulador) | #34 |
| -- | tasks-page | docs/mocks/tasks-page-libre.png | TSK-17 | TSK-17.4 | fix-tasks-fab-pager-layout | src/app/store/task.spec.ts:[TSK-17.4] | pendiente (ausente: sin emulador) | #34 |
| -- | tasks-page | docs/mocks/tasks-page-libre.png | TSK-18 | TSK-18.1 | fix-tasks-fab-pager-layout | src/theme/todo-layout.spec.ts:[TSK-18.1] | pendiente (ausente: sin emulador) | #34 |
| 4:1404 | task-row | docs/mocks/todo-panel-closed.png | SWIPE-01 | SWIPE-01.1 | fix-delivery-functional | src/app/shared/components/task-item/task-item.component.spec.ts:[SWIPE-01.1] | ausente: sin captura en esta sesión | pendiente |
| 4:1404 | task-row | docs/mocks/todo-panel-closed.png | SWIPE-01 | SWIPE-01.2 | fix-delivery-functional | src/app/shared/services/deletion-confirmation.spec.ts:[SWIPE-01.2] | ausente: sin captura en esta sesión | pendiente |
| 4:520 | todo-panel-closed | docs/mocks/todo-panel-closed.png | TODO-12 | TODO-12.1 | fix-delivery-functional | src/app/pages/tasks/tasks.page.spec.ts:[TODO-12.1] | ausente: sin captura en esta sesión | pendiente |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | TODO-10 | TODO-10.1 | fix-delivery-functional | src/app/pages/tasks/tasks.page.spec.ts:[TODO-10.1] | ausente: sin captura en esta sesión | pendiente |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | TODO-10 | TODO-10.2 | fix-delivery-functional | src/app/pages/tasks/tasks.page.spec.ts:[TODO-10.2] | ausente: sin captura en esta sesión | pendiente |
| 4:973 | task-row | docs/mocks/todo-panel-closed.png | TODO-11 | TODO-11.1 | fix-delivery-functional | src/app/pages/tasks/tasks.page.spec.ts:[TODO-11.1] | ausente: sin captura en esta sesión | pendiente |
| 4:520 | todo-panel-closed | docs/mocks/todo-panel-closed.png | TSK-19 | TSK-19.1 | fix-delivery-functional | src/app/pages/tasks/tasks.page.spec.ts:[TSK-19.1] | ausente: sin captura en esta sesión | pendiente |
| 4:520 | todo-panel-closed | docs/mocks/todo-panel-closed.png | TSK-19 | TSK-19.2 | fix-delivery-functional | src/app/store/task.spec.ts:[TSK-19.2] | ausente: sin captura en esta sesión | pendiente |
| 4:520 | todo-panel-closed | docs/mocks/todo-panel-closed.png | TSK-20 | TSK-20.1 | fix-delivery-functional | src/app/pages/tasks/tasks-pager.spec.ts:[TSK-20.1] | ausente: sin captura en esta sesión | pendiente |
| 4:1113 | categories-off | docs/mocks/todo-panel-closed.png | RC-01 | RC-01 | fix-delivery-functional | src/app/core/config/remote-config.spec.ts:[RC-01] | ausente: sin captura en esta sesión | pendiente |
| 4:1496 | settings | docs/mocks/todo-panel-closed.png | RC-02 | RC-02 | fix-delivery-functional | src/app/core/config/remote-config.spec.ts:[RC-02] | ausente: sin captura en esta sesión | pendiente |
| 4:1113 | categories-off | docs/mocks/todo-panel-closed.png | RC-03 | RC-03 | fix-delivery-functional | src/app/core/config/firebase-remote-config-port.spec.ts:[RC-03] | ausente: sin captura en esta sesión | pendiente |
| 4:1113 | categories-off | docs/mocks/todo-panel-closed.png | RC-04 | RC-04 | fix-delivery-functional | src/app/core/config/remote-config.spec.ts:[RC-04] | ausente: sin captura en esta sesión | pendiente |
| 4:1496 | settings | docs/mocks/todo-panel-closed.png | RC-05 | RC-05 | fix-delivery-functional | src/app/layout/shell/shell.component.spec.ts:[RC-05] | ausente: sin captura en esta sesión | pendiente |
| 4:1496 | settings | docs/mocks/todo-panel-closed.png | SET-03 | SET-03 | fix-delivery-functional | src/app/pages/settings/settings.page.spec.ts:[SET-03] | ausente: sin captura en esta sesión | pendiente |
| 4:1496 | settings | docs/mocks/todo-panel-closed.png | SET-04 | SET-04 | fix-delivery-functional | src/app/store/task.spec.ts:[SET-04] | ausente: sin captura en esta sesión | pendiente |
| 4:788 | categories-list | docs/mocks/categories-list.png | CATDEL-01 | CATDEL-01 | fix-delivery-functional | src/app/store/category.spec.ts:[CATDEL-01] | ausente: sin captura en esta sesión | pendiente |
| -- | build | -- | ENV-01 | ENV-01.1 | firebase-env-production | src/project-config.spec.ts:[ENV-01.1] | n/a | local |
| -- | build | -- | ENV-01 | ENV-01.2 | firebase-env-production | src/project-config.spec.ts:[ENV-01.2] | n/a | local |
| -- | build | -- | ENV-01 | ENV-01.3 | firebase-env-production | src/environments/environment.spec.ts:[ENV-01.3] | n/a | local |
| -- | build | -- | ENV-01 | ENV-01.4 | firebase-env-production | src/project-config.spec.ts:[ENV-01.4] | n/a | local |
| -- | build | -- | ENV-01 | ENV-01.5 | firebase-env-production | src/build-scripts.spec.ts:[ENV-01.5] | n/a | local |
| -- | build | -- | ENV-01 | ENV-01.6 | firebase-env-production | src/app/core/config/firebase-remote-config-port.spec.ts:[ENV-01.6] | n/a | local |
| -- | build | -- | ENV-01 | ENV-01.7 | firebase-env-production | src/project-config.spec.ts:[ENV-01.7] | n/a | local |
| -- | remote-config | -- | RC-06 | RC-06.1 | firebase-env-production | src/app/core/config/firebase-remote-config-port.spec.ts:[RC-06.1] | n/a | local |
| -- | remote-config | -- | RC-06 | RC-06.2 | firebase-env-production | src/environments/environment.spec.ts:[RC-06.2] | n/a | local |
| -- | remote-config | -- | RC-06 | RC-06.3 | firebase-env-production | src/app/core/config/firebase-remote-config-port.spec.ts:[RC-06.3] | n/a | local |
| -- | remote-config | -- | RC-06 | RC-06.4 | firebase-env-production | src/app/core/config/remote-config.spec.ts:[RC-06.4] | n/a | local |
| -- | remote-config | -- | RC-06 | RC-06.5 | firebase-env-production | src/app/core/config/firebase-remote-config-port.spec.ts:[RC-06.5] | n/a | local |
| -- | firebase-config | -- | FBCFG-01 | FBCFG-01.1 | firebase-env-production | src/build-scripts.spec.ts:[FBCFG-01.1] | n/a | local |
| -- | firebase-config | -- | FBCFG-01 | FBCFG-01.2 | firebase-env-production | src/build-scripts.spec.ts:[FBCFG-01.2] | n/a | local |
| -- | firebase-config | -- | FBCFG-01 | FBCFG-01.3 | firebase-env-production | src/build-scripts.spec.ts:[FBCFG-01.3] | n/a | local |
| -- | firebase-config | -- | FBCFG-01 | FBCFG-01.4 | firebase-env-production | src/build-scripts.spec.ts:[FBCFG-01.4] | n/a | local |
| -- | firebase-config | -- | FBCFG-01 | FBCFG-01.5 | firebase-env-production | src/build-scripts.spec.ts:[FBCFG-01.5] | n/a | local |
| -- | firebase-config | -- | FBCFG-01 | FBCFG-01.6 | firebase-env-production | src/build-scripts.spec.ts:[FBCFG-01.6] | n/a | local |
| -- | firebase-config | -- | FBCFG-01 | FBCFG-01.7 | firebase-env-production | src/build-scripts.spec.ts:[FBCFG-01.7] | n/a | local |
| -- | readme | -- | DOC-FB-01 | DOC-FB-01.1 | firebase-env-production | src/delivery-docs.spec.ts:[DOC-FB-01.1] | n/a | local |
| -- | readme | -- | DOC-FB-01 | DOC-FB-01.2 | firebase-env-production | src/delivery-docs.spec.ts:[DOC-FB-01.2] | n/a | local |
| -- | readme | -- | DOC-FB-01 | DOC-FB-01.3 | firebase-env-production | src/delivery-docs.spec.ts:[DOC-FB-01.3] | n/a | local |
| -- | readme | -- | DOC-FB-01 | DOC-FB-01.4 | firebase-env-production | src/delivery-docs.spec.ts:[DOC-FB-01.4] | n/a | local |
| -- | readme | -- | DOC-FB-01 | DOC-FB-01.5 | firebase-env-production | src/delivery-docs.spec.ts:[DOC-FB-01.5] | n/a | local |
| -- | readme | -- | DOC-FB-01 | DOC-FB-01.6 | firebase-env-production | src/delivery-docs.spec.ts:[DOC-FB-01.6] | n/a | local |
| 4:440 | tasks-page | docs/mocks/todo-day-panel-open.png | FIN-01 | FIN-01.1 | finish-remaining-ui | src/app/shared/components/task-item/task-item.component.spec.ts:[FIN-01.1] | openspec/changes/archive/2026-10-18-finish-remaining-ui/evidence/tasks-notes-{light,dark}-{es,en}.png | #45 |
| 4:617 | tasks-page | docs/mocks/my-notes-shopping.png | FIN-02 | TODO-04.2 | finish-remaining-ui | src/app/pages/tasks/tasks.page.spec.ts:[TODO-04.2] | openspec/changes/archive/2026-10-18-finish-remaining-ui/evidence/tasks-notes-{light,dark}-{es,en}.png | #45 |
| 4:440 | tasks-page | docs/mocks/todo-day-panel-open.png | FIN-03 | TODO-01.3 | finish-remaining-ui | src/app/pages/tasks/tasks.page.spec.ts:[TODO-01.3] | openspec/changes/archive/2026-10-18-finish-remaining-ui/evidence/tasks-{light,dark}-{es,en}.png | #45 |
| 4:440 | tasks-page | docs/mocks/todo-day-panel-open.png | FIN-04 | I18N-01.3 | finish-remaining-ui | src/app/layout/shell/shell.component.spec.ts:[I18N-01.3] | n/a: contrato de claves, sin captura | #45 |
| 4:440 | tasks-page | docs/mocks/todo-day-panel-open.png | FIN-04 | I18N-01.4 | finish-remaining-ui | src/app/core/settings/chrome-translations.spec.ts:[I18N-01.4] | n/a: contrato de claves, sin captura | #45 |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | SHEET-90 | SHEET-90.1 | regularize-direct-commits | src/direct-commits.spec.ts:[SHEET-90.1] | n/a: caracterización, sin captura | local |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | PAGE-20 | PAGE-20.1 | regularize-direct-commits | src/direct-commits.spec.ts:[PAGE-20.1] | n/a: caracterización, sin captura | local |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | SCROLL-01 | SCROLL-01.1 | regularize-direct-commits | src/direct-commits.spec.ts:[SCROLL-01.1] | n/a: caracterización, sin captura | local |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | PAGER-01 | PAGER-01.1 | regularize-direct-commits | src/direct-commits.spec.ts:[PAGER-01.1] | n/a: caracterización, sin captura | local |
| 4:440 | todo-day-panel-open | docs/mocks/todo-day-panel-open.png | ROW-01 | ROW-01.1 | regularize-direct-commits | src/direct-commits.spec.ts:[ROW-01.1] | n/a: caracterización, sin captura | local |
| 4:440 | tasks-page | docs/mocks/todo-day-panel-open.png | APP-09 | APP-09.1 | fix-app-09-spec-align | src/app/pages/tasks/tasks.page.spec.ts:[APP-09.1] | n/a: requisito tecnico de paginacion, sin nodo de Figma | pendiente |
| 4:788 | categories-list | docs/mocks/categories-list.png | APP-09 | APP-09.2 | fix-app-09-spec-align | src/app/pages/categories/categories.page.spec.ts:[APP-09.2] | n/a: requisito tecnico de virtualizacion, sin nodo de Figma | pendiente |
| 4:1496 | settings | docs/mocks/todo-panel-closed.png | DEBUG-01 | DEBUG-01.1 | regularize-direct-commits | src/direct-commits.spec.ts:[DEBUG-01.1] | n/a: caracterización, sin captura | local |
| -- | openspec | -- | SPEC-01 | SPEC-01.1 | regularize-direct-commits | src/openspec-ids.spec.ts:[SPEC-01.1] | n/a | local |
| -- | openspec | -- | SPEC-01 | SPEC-01.2 | regularize-direct-commits | src/openspec-ids.spec.ts:[SPEC-01.2] | n/a | local |
| -- | openspec | -- | SPEC-01 | SPEC-01.3 | regularize-direct-commits | src/openspec-ids.spec.ts:[SPEC-01.3] | n/a | local |
