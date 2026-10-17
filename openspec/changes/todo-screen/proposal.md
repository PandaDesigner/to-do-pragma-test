## Why

La pantalla de tareas no es la de Figma. Sigue con una barra de dos pestañas y un editor incrustado. Pedro pidió que la fidelidad visual vaya primero, y el siguiente change después de archivar `i18n` es esta pantalla.

## What Changes

- Sustituir la barra inferior por el rail de cinco pestañas de Figma. Routine y Event se ven y no navegan (D2).
- Mostrar la cabecera del día, el badge de hoy y el panel de tareas pendientes, abierto y cerrado.
- Mostrar las tareas con el checkbox de Figma, el tachado de las completadas y los chips de categoría para filtrar.
- Quitar el editor incrustado. El input rápido crea una tarea con el título. El botón flotante abre el sheet; el formulario completo de ese sheet queda para el change siguiente.
- Mostrar el estado vacío con ilustración y llamada a la acción.
- Mover el botón de depuración de esta página a Ajustes (D3).
- Extraer en este change `page-header`, `empty-state`, `chip` y el ajuste de `TaskItem`. El andamiaje se toca solo en lo que esta pantalla usa.

## Capabilities

### New Capabilities

- `todo-screen`: rail, cabecera del día, panel de pendientes, lista, chips, input rápido, botón flotante y estado vacío, conforme a Figma 4:440, 4:520, 4:664, 4:973 y 4:1062.

### Modified Capabilities

- `app-base`: la pestaña de listas pasa a llamarse como en Figma y el botón de 5.000 tareas deja la página de tareas.
- `settings`: Ajustes muestra la sección de depuración que sale de la página de tareas.

## Impact

Toca el shell, la página de tareas, Ajustes y los componentes compartidos que esta pantalla extrae. No añade dependencias. Nodos: [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440), [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520), [4:664](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-664), [4:973](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-973) y [4:1062](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1062). La fila de Notion de este change no está en `docs/workflow-mcp.md`; se crea al tener el servidor Notion.
