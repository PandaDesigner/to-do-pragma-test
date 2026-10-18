## Context

PR #33 dejó el FAB con `slot="fixed"` y la lista con `<ion-content [scrollY]="false">`. El FAB queda a la izquierda cuando la columna del notebook está centrada (tapando filas) y el paginador aparece aunque la lista tenga una sola página. Estos dos defectos los arregla este change.

## Source of truth

- `Figma 4:1062` (todo-empty-state) sigue siendo el layout de la página.
- `Figma 4:973` (todo-filtered-by-category) fija el rail de filtros horizontal. No se cambia.
- AGENTS.md prohíbe hex literales en SCSS; todo sale de tokens.

## Decisions

1. **`pageCount` puro en dominio.** `domain/pagination.ts` exporta `pageCount(total: number, size: number): number` y `PAGE_SIZE = 20`. Test unitario: 0 → 1 (sin paginar), 20 → 1, 21 → 2, 40 → 2, 41 → 3, 61 → 4. El store importa la función; no hay lógica duplicada.
2. **Reset de `pageCount` en filtros.** `setCategory`, `setStatuses`, `setSection` se reescriben para que cualquier mutación de filtro lleve `pageCount` a 1. Cuesta una sola línea por setter y centraliza la regla.
3. **Step-back al borrar la última tarea.** `TaskStore.remove(id)` recalcula `pageCount` con `pageCount(tasks.length - 1, pageSize)`; si el actual supera eso, lo decremente. Mantiene invariante: el usuario siempre termina viendo una página no vacía (o vacía si no hay nada).
4. **`goToPage` reescrito.** `TasksPage.goToPage(n)` llama `setPage(n)` y emite `scrollListToTop()`, que busca `.task-list` por selector y aplica `scrollTo({ top: 0 })` o `nativeElement.scrollTop = 0`. Decisión de paginación: tras el cambio de página el primer ítem debe verse.
5. **FAB anclado a la columna del notebook, no al viewport.** Se elimina `slot="fixed"`. Se aplican coordenadas absolutas dentro del `<ion-content>`: `right: 50px; bottom: calc(var(--app-pager-height) + 16px + env(safe-area-inset-bottom))`. Cuando no hay paginador el `--app-pager-height: 0` y el FAB cae a `bottom: calc(16px + env(safe-area-inset-bottom))`.
6. **Paginador sticky dentro del scroll area.** `.pager` se mueve a un bloque flex `none` abajo del `.task-list`, con `position: sticky; bottom: 0; background: var(--app-surface); z-index: 1`. Es el ÚNICO elemento que se ve afectado por la presencia del paginador (un flex sibling con `flex: none` no rompe el flex de `.task-list`).

## Token map

| Pieza del rediseño | Token |
| --- | --- |
| Alto del paginador (reservado para el cálculo del FAB) | `--app-pager-height: 56px` |
| Tamaño del FAB (para padding-bottom de la lista) | `--app-fab-size: 56px` |
| Fondo del paginador sticky | `--app-surface` |
| Borde / fondo del botón activo | `--app-primary`, `--app-on-primary` |
| Hueco interno | `--app-space-8`, `--app-space-12`, `--app-space-16` |

## Medidas de referencia

- Paginador: 56 px de alto (suficiente para 44 px touch + padding 6).
- FAB: 56 px de diámetro, margen derecho 50 px, gap 16 px sobre el paginador (cuando existe).
- Safe-area-inset-bottom aplicado para iOS.

## Trade-offs

- `position: sticky` dentro de un contenedor con `overflow-y: auto` mantiene el paginador visible solo cuando el contenido más cercano lo requiere. Si la lista es corta y no scrollea, el paginador se queda al final sin solapar filas.
- Mover el FAB fuera del `slot="fixed"` rompe compatibilidad con la fix `load-more-binding` (PR #29) que introdujo el método en la página. Como parte de este change se elimina el método `loadMore()` de la página (el store sigue conservando el wrapper para los tests existentes).
- El cambio de layout fuerza que el botón `loadMore()` y el método de página asociados ya no se usen. El PR #33 llegó a una solución distinta; este change la corrige.

## Migration Plan

No hay migración de datos. Si algo del layout no encaja en un dispositivo muy pequeño, se vuelve al comportamiento anterior en un PR `fix/*` separado.

## Open Questions

Ninguna que cambie el resultado. El `env(safe-area-inset-bottom)` ya estaba disponible en iOS/Web; Android usa un margen equivalente del tema.
