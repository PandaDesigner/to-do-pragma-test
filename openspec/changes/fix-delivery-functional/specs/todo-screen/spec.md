## ADDED Requirements

### Requirement: SWIPE-01 El borrado de una fila usa la opción deslizante de Ionic

La fila MUST usar `ion-item-sliding` con `ion-item-options` en `side="end"`. Abrir la opción MUST NOT emitir el borrado. Pulsar la opción MUST emitir `remove` con el id de la tarea. El diálogo de confirmación MUST usar las claves `task.deleteTitle`, `task.deleteMessage`, `task.deleteCancel` y `task.deleteConfirm`. Figma: 4:1404.

#### Scenario: [SWIPE-01.1] La opción final borra solo al pulsarla

- **GIVEN** una fila de nota, conforme a Figma 4:1404
- **WHEN** se renderiza la fila
- **THEN** existe `ion-item-sliding` con opciones `side="end"`
- **AND** no se emite `remove` hasta pulsar `ion-item-option`

#### Scenario: [SWIPE-01.2] El diálogo sale en el idioma activo

- **GIVEN** el idioma inglés y la tarea "Finish reports", conforme a Figma 4:1404
- **WHEN** se pide confirmación
- **THEN** el título es "Delete task?"
- **AND** el mensaje dice que "Finish reports" se eliminará de forma permanente
- **AND** los botones son "Cancel" y "Delete"

### Requirement: TODO-09 Cada pestaña conserva su sección

Una página de tareas MUST filtrar por la sección de su propia ruta. Otra pestaña cacheada MUST NOT cambiar esa lista, el chip elegido ni la página del paginador. Figma: 4:520.

#### Scenario: [TODO-09.1] Rutina y Evento no comparten la vista

- **GIVEN** dos páginas cacheadas, Rutina y Evento, sobre el mismo store, conforme a Figma 4:520
- **WHEN** Evento queda activa y elige un chip o una página
- **THEN** Rutina sigue listando solo sus tareas
- **AND** su chip y su página no cambian

### Requirement: TODO-10 Sin categorías, el filtro de pendientes suma la regla

Si el catálogo está vacío, la lista MUST conservar el filtro anterior y seguir mostrando las tareas. El panel de pendientes MUST añadir esa condición: en Todo solo entran las abiertas de días anteriores con `categoryId === null`; en Rutina y Evento el panel queda vacío. Figma: 4:440.

#### Scenario: [TODO-10.1] Todo no mete tareas asignadas en pendientes

- **GIVEN** un catálogo vacío, una tarea suelta y una con categoría, anteriores a hoy, conforme a Figma 4:440
- **WHEN** se abre Todo
- **THEN** la lista muestra las dos
- **AND** el panel de pendientes solo muestra la suelta

#### Scenario: [TODO-10.2] Rutina conserva la lista y vacía el panel

- **GIVEN** un catálogo vacío y tareas anteriores a hoy, conforme a Figma 4:440
- **WHEN** se abre Rutina
- **THEN** la lista sigue mostrando esas tareas
- **AND** el panel de pendientes queda vacío

### Requirement: TODO-11 El chip Pendientes filtra estados

La fila de chips MUST incluir un tag Pendientes junto a las categorías. Activarlo MUST limitar la lista a pendientes y vencidas sin quitar el chip de categoría. La fila de tarea MUST usar `app-task-item` en la lista, las notas y el panel, con alto `var(--app-task-row-height)`. El estado MUST decidir checkbox, meta y acciones. Figma: 4:440 y 4:973.

#### Scenario: [TODO-11.1] Pendientes se suma al filtro de categoría

- **GIVEN** una categoría con una tarea pendiente y una completada, conforme a Figma 4:973
- **WHEN** se pulsa el chip Pendientes y después la categoría
- **THEN** la lista muestra solo la pendiente de esa categoría
- **AND** al volver a pulsar Pendientes reaparecen ambas

### Requirement: TSK-19 El paginador usa la lista filtrada

El paginador MUST contar solo las tareas visibles de esa pestaña. Una sección vacía, o un filtro que deja una sola página, MUST NOT mostrar el paginador. La lista MUST dejar espacio para el paginador y el FAB. Figma: 4:520.

#### Scenario: [TSK-19.1] Evento no pagina las tareas de Todo

- **GIVEN** 45 tareas sueltas y 5 de una categoría general, conforme a Figma 4:520
- **WHEN** se abren Todo y Evento
- **THEN** Todo muestra 3 páginas y Evento no muestra paginador
- **AND** al filtrar Todo a 5 tareas, vuelve a la página 1 y oculta el paginador

#### Scenario: [TSK-20.1] La lista no queda debajo del paginador

- **GIVEN** los estilos de la lista, conforme a Figma 4:520
- **WHEN** se compilan
- **THEN** el relleno inferior es `calc(var(--app-pager-height) + var(--app-fab-size) + var(--app-space-16))`
