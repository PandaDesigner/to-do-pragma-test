## Why

Cada pestaña reutiliza la página cacheada y muestra la sección de la última visita. El paginador cuenta todas las tareas. Remote Config se consulta dos veces, el flag de debug queda prendido y un 404 tapa el FAB. El swipe de la fila es un handler de puntero; Figma 4:1404 pide `ion-item-sliding` y un diálogo traducido.

## What Changes

- La opción de borrar usa `ion-item-sliding` y solo emite `remove` al pulsarla. El diálogo sale del idioma activo.
- Cada pestaña calcula su sección. Sin categorías, Routine y Event quedan vacías.
- El paginador y `setPage` usan la lista filtrada y no tapan la última fila.
- Remote Config se lee una vez. `enable_debug_actions` es false salvo un `true` remoto. Borrar todo pide confirmación. Un 404 no muestra error. Un fallo con config presente es un toast que no tapa el FAB.
- Se verifica que borrar una categoría deja sus tareas sin categoría.

## Capabilities

### New Capabilities

- `remote-config`: una consulta, flag de debug y error no bloqueante.

### Modified Capabilities

- `todo-screen`: sección por pestaña, filtro sin categorías y swipe Ionic.
- `fix-tasks-fab-pager-layout`: paginador sobre la lista filtrada.
- `settings`: borrado total confirmado y límite de seeds.
- `category-sections`: verificación del borrado de categoría.

## Impact

UI de tareas, shell y ajustes. Figma: 4:520, 4:1062, 4:1113, 4:1404, 4:1496, 4:788, 4:869. Rama `fix/delivery-functional` hacia `develop`. No se fusiona en esta sesión.

## Out of scope

Fase 3, P-05, P-11, P-19, P-21, P-23 y el README de entrega. `enable_debug_actions` no se enciende para medir.
