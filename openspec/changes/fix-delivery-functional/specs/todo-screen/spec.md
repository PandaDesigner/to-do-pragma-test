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
