## 1. Diseño

- [x] 1.1 Leer el feedback del navegador y extraer: FAB a la izquierda, paginador siempre visible.
- [x] 1.2 Cerrar PR #33 (`feat/tasks-numeric-pager`) como superseded por este change.
- [x] 1.3 Escribir propuesta, diseño y specs con escenarios TSK-16/17/18.

## 2. Lógica pura de paginación

- [x] 2.1 RED: test `domain/pagination.spec.ts` para la tabla 0/20/21/40/41/61.
- [x] 2.2 GREEN: `src/app/domain/pagination.ts` con `pageCount(total, size)` y `PAGE_SIZE = 20`.

## 3. Store: setPage, reset, step-back

- [x] 3.1 RED: tests en `task.spec.ts` para: setPage con reemplazo, reset por filtro, step-back al eliminar la última tarea de la última página.
- [x] 3.2 GREEN: `TaskStore.setCategory/setStatuses/setSection` con `pageCount: 1`. `TaskStore.remove(id)` con step-back usando `pageCount(remaining, pageSize)`.

## 4. Página: scroll al cambiar página y posicionamiento del FAB

- [x] 4.1 RED: tests en `tasks.page.spec.ts` para `goToPage(n)` que llama `setPage` y dispara `scrollListToTop()`. Comprobar que `.task-list` tiene `scrollTop: 0` tras navegar.
- [x] 4.2 GREEN: reescribir `TasksPage.goToPage` para delegar en el store y emitir scroll-to-top.
- [x] 4.3 GREEN: añadir tokens `--app-pager-height: 56px` y `--app-fab-size: 56px` en `_tokens.scss` y `variables.scss`.
- [x] 4.4 GREEN: ajustar SCSS del `.notebook-page` (flex column), `.task-list` (flex 1, min-height 0, overflow-y auto, padding-bottom), `.pager` (flex none, sticky).

## 5. FAB anclado y paginador

- [x] 5.1 RED: tests de SCSS para `ion-fab { right: 50px; bottom: calc(var(--app-pager-height) + 16px + env(safe-area-inset-bottom)); }` y contra `left` ausente.
- [x] 5.2 GREEN: mover `<ion-fab>` fuera de `<main>`, eliminar `slot="fixed"`, aplicar coordenadas absolutas y `<ion-icon name="add">`.
- [x] 5.3 GREEN: `<nav class="pager">` con `position: sticky; bottom: 0; background: var(--app-surface); z-index: 1;`.
- [x] 5.4 GREEN: i18n `tasks.fab.new`, `tasks.pager.label`, `tasks.pager.prev`, `tasks.pager.next` en es y en. Eliminar `todo.pagerPrev/pagerNext` (los migramos a `tasks.*`).

## 6. Verificación

- [ ] 6.1 Capturas `tasks-{light,dark}-{es,en}.png` en `openspec/changes/fix-tasks-fab-pager-layout/evidence/`: 45 tareas con scroll al final y 20 tareas sin paginador. Ausente: no había emulador iOS ni Android arrancado en esta sesión; AGENTS.md obliga a documentar la ausencia. Requisito bloqueado para una sesión con simulador disponible.
- [x] 6.2 Filas TSK-16, TSK-17 y TSK-18 registradas en `openspec/traceability.md` con su `it()` correspondiente.
- [x] 6.3 Pasar `npm run lint`, `lint:styles`, `format:check`, `typecheck`, `jest --coverage`, `trace:check` y `openspec validate --all --strict`.
- [x] 6.4 PR a `develop` con sección Reutilización: `domain/pagination.ts` (nuevo), `TaskStore` reescrito, `TasksPage.goToPage` con scroll, tokens `--app-pager-height/--app-fab-size`, i18n. Fusionado en el PR #34.

## 7. Cierre

- [x] 7.1 Checks verdes y merge con merge commit: PR #34, fusionado el 2026-10-17.
- [x] 7.2 Tests y build repetidos sobre `develop` post-merge.
- [x] 7.3 Rama `chore/archive-fix-tasks-fab-pager-layout` y `openspec archive`: PR #35 (`133ea18`), fusionado el 2026-10-17.

Solo queda 6.1 abierta, bloqueada por falta de simulador en aquella sesión.
