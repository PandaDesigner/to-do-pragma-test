## Why

El FAB "Nueva tarea" y el paginador numérico se acomodan hoy contra el viewport (`slot="fixed"` y `bottom: 0` respectivamente). El resultado: el FAB se desplaza con el contenido cuando hay scroll dentro del `<ion-content>` y queda tapando las filas a la izquierda cuando la columna del notebook está centrada; el paginador aparece aunque haya menos de 21 tareas y no se ancla al fondo del área visible. Esto rompe dos contratos UX que las capturas del navegador han dejado claros:

1. FAB anclado a 50 px del borde derecho de la columna del notebook, nunca a la izquierda, y respetando el alto del paginador + safe-area-inset inferior.
2. Paginador numérico visible solo si la lista filtrada excede el tamaño de página (20 tareas), `position: sticky` dentro de `.task-list`, fondo opaco y `z-index: 1` para que no sea tapado por el FAB y viceversa.

## What Changes

- Nueva responsabilidad de dominio `pageCount(total, size)` en `src/app/domain/pagination.ts`: cálculo puro `Math.ceil(total / size)`, testeado contra la tabla 0/20/21/40/41/61.
- `TaskStore` se apoya en `pageCount` y reescribe `setPage` para que cualquier cambio de filtro (`setCategory`, `setStatuses`, `setSection`) resetee `pageCount` a 1.
- `TaskStore.remove` ajusta hacia atrás cuando se elimina la última tarea de la última página: si el `pageCount` actual supera el nuevo total, vuelve a `pageCount - 1`.
- `TaskStore` añade `goToPage(n)` que llama `setPage` y, tras el cambio, hace scroll del `.task-list` al inicio (a través de un efecto en la página).
- `TasksPage.goToPage` reescrito: navega vía `setPage`, dispara `scrollToTop()` sobre el contenedor `.task-list`.
- Tokens en `_tokens.scss`: `--app-pager-height: 56px`, `--app-fab-size: 56px`. Expuestos en `src/theme/variables.scss` como `--app-pager-height` y `--app-fab-size`.
- Layout de la página:
  - `<ion-content [fullscreen]="false">` para que `.notebook-page` ocupe exactamente el alto del content area.
  - `.notebook-page`: `flex column; height 100%`.
    - `app-page-header` + `.chips` (filtros): `flex: none`.
    - `.task-list`: `flex: 1 1 auto; min-height: 0; overflow-y: auto; padding-bottom: calc(var(--app-fab-size) + 24px)`.
    - `.pager` (cuando exista): `flex: none; position: sticky; bottom: 0; background: var(--app-surface); z-index: 1`.
  - FAB fuera del `.task-list`, hermano del paginador, con `position: fixed` (no `slot="fixed"`) y `right: 50px; bottom: calc(var(--app-pager-height) + 16px + env(safe-area-inset-bottom));` Sin `left`.
- `aria-label` del FAB y del paginador vienen de i18n: `tasks.fab.new`, `tasks.pager.label`, `tasks.pager.prev`, `tasks.pager.next`. Sin texto fijo en la plantilla.

## Capabilities

### New Capabilities

- `pagination`: lógica pura de paginación en `domain/pagination.ts` + contratos expuestos.

### Modified Capabilities

- `tasks`: requisitos `TSK-04`, `TSK-09` (scroll) y `TSK-10` (FAB) se actualizan para anclar el FAB al final del notebook y dejar el paginador sticky.

## Impact

Toca `TasksPage` (template, scss, ts), `TaskStore` (lógica de setPage, reset, step-back), `src/app/domain/pagination.ts` (nuevo), `src/app/shared/components/*` (sin cambios), tokens y variables SCSS, dos archivos de i18n. AGENTS.md exige que ningún cambio rompa la cobertura 80/95/90.

## Out of scope

- Reemplazar `<select>` del NewTaskModal por componentes custom (ya en non-goals de `category-sheet`).
- Ajustes no relacionados con FAB / paginación / sticky-scroll del tasks page.
