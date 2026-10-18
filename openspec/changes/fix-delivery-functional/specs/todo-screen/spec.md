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

### Requirement: TODO-10 Sin categorías, solo Todo muestra tareas sueltas

Si el catálogo está vacío, Todo MUST listar solo tareas con `categoryId === null`. Rutina y Evento MUST quedar vacías. Figma: 4:520.

#### Scenario: [TODO-10.1] Todo no hereda tareas de otras secciones

- **GIVEN** un catálogo vacío y una tarea suelta más una tarea con categoría, conforme a Figma 4:520
- **WHEN** se filtra por Todo
- **THEN** solo aparece la tarea suelta

#### Scenario: [TODO-10.2] Rutina y Evento quedan vacías sin catálogo

- **GIVEN** un catálogo vacío, conforme a Figma 4:520
- **WHEN** se filtra por Rutina o por Evento
- **THEN** la lista está vacía

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
