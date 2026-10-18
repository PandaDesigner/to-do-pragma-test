## Why

Pedro pidió en la pantalla de tareas un grupo de filtro por fecha donde hoy solo hay un botón "HOY", y reportó tres problemas concretos que este change resuelve:

- No se puede filtrar las tareas por un rango de fechas. El único acceso rápido es "HOY", que ni siquiera filtra: `focusToday()` solo restablece categoría y estados.
- El badge "HOY" mide 336x44 con `min-height: var(--app-day-actions-height)`, así que el `flex: 1` del contenedor reparte el ancho y el texto queda en un botón enorme. Pedro lo lea como "está muy grande, reduce".
- El título del día se renderiza como `18.Sun` con el nombre del día fijo en inglés, en una app que ya traduce todo lo demás a español e inglés.

## What Changes

- `.top-actions` pasa de un botón a un grupo de filtro por fecha: el botón rápido "HOY" (que conserva `focusToday()`) y, a su lado, un botón de icono de calendario que abre un `ion-alert` con un `ion-datetime` de rango (desde/hasta) montado con la propiedad `template` del alert, no con `contentInputs`.
- El rango seleccionado se guarda en `TaskStore` con `setDateRange()`, siguiendo el mismo patrón que `setCategory`, `setStatuses` y `setSection`: `patchState` más `pageCount: 1`. Se aplica en `filterTasks` por `dueDate` inclusivo y se combina con los filtros ya existentes por AND.
- `focusToday()` deja de ser solo un restablecimiento: fija el rango a `[hoy, hoy]`, que es lo que el usuario espera de un botón que dice HOY. El resto de su comportamiento actual (restablecer categoría, estados, abrir el panel, subir la lista) se conserva.
- El badge "HOY" se reduce: deja de ocupar el ancho disponible y pasa a dimensionarse por su contenido, con altura y ancho mínimos medidos y fontsize del token de badge.
- `day-title.ts` deja de llevar tablas fijas de meses y días en inglés: el título se formatea con `Intl.DateTimeFormat` en el idioma activo, con respaldo a inglés.
- El texto de las pestañas del rail lateral recupera contraste en modo oscuro: en claro usa `color/primary-dark`, en oscuro usa `color/text`.
- Se agregan las claves i18n del alert en `es.json` y `en.json`.

### Deuda que este change cierra

- **Título del día no localizado**: `formatDayTitle` y `formatLongDate` tenían `WEEKDAY` y `MONTH` como constantes en inglés. Ahora usan `Intl` con el idioma de la app.
- **Contraste del rail en oscuro**: `.rail-tab` usaba `var(--app-primary-dark)`, que el modo oscuro ya invertía a `#edeaf5`, pero la variable `--app-tab-label` seguía apuntando al token claro sin inverter. Se separa la tinta de pestaña de la tinta de marca.

## Capabilities

### New Capabilities

- `tasks-date-filter`: grupo de filtro por fecha de la pantalla de tareas, con botón rápido HOY, selector de rango en `ion-alert` y filtro por rango en el store.

### Modified Capabilities

- `todo-screen`: el badge HOY pasa a ser un botón compacto y el título del día se localiza.
- `ui-shell`: el texto de las pestañas del rail lateral recupera contraste en modo oscuro.

## Impact

- `src/app/store/task.ts`: estado `dateRange` y método `setDateRange`.
- `src/app/domain/task-strategy.ts`: `TaskFilter` acepta `dateRange` y `filterTasks` lo aplica sobre `dueDate`.
- `src/app/pages/tasks/tasks.page.{ts,html,scss}`: grupo `.top-actions`, botón de calendario, `ion-alert` con `ion-datetime` de rango, y badge reducido.
- `src/app/pages/tasks/day-title.ts`: formato localizado con `Intl`.
- `src/app/shared/components/date-range-filter/`: componente presentacional nuevo para el alert (input/output, sin store).
- `src/theme/_tokens.scss`, `src/theme/variables.scss`, `src/theme/_dark.scss`: tokens de la tinta del rail y medidas del badge.
- `src/assets/i18n/{es,en}.json`: claves del alert y del badge.
- Sin dependencias nuevas. Sin migración de datos ni de esquema.

## Out of scope

- Persistir el rango elegido entre sesiones.
- Filtrar por hora, por texto o combinar rangos disjuntos.
- `ion-modal` en lugar de `ion-alert`: se mantiene `ion-alert` y se justifica en `design.md`.
- Evidencia visual por captura de navegador si no hay servidor: se marca Blocked en `tasks.md` y `verify-report.md`.