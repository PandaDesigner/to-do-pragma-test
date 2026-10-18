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

### Requirement: RC-01 Remote Config se lee una vez

`RemoteConfigService.initialize` MUST llamar `port.fetch()` una sola vez dentro de `REMOTE_CONFIG_TIMEOUT_MS`. Un timeout MUST dejar `enable_categories` en true y `enable_debug_actions` en false. Figma: 4:1113.

#### Scenario: [RC-01] Una lectura cubre los dos flags

- **GIVEN** un puerto que responde ambos flags, conforme a Figma 4:1113
- **WHEN** se inicializa la configuración
- **THEN** `fetch` se llama una vez
- **AND** un timeout de 3000 ms deja categorías habilitadas y debug apagado

### Requirement: RC-02 El debug nace apagado

`enable_debug_actions` MUST ser false en el valor inicial, si falta, si no es el booleano `true`, o si la lectura falla. MUST NOT encenderse para medir. Figma: 4:1496.

#### Scenario: [RC-02] Solo un true remoto enciende el debug

- **GIVEN** un valor ausente, inválido o un error de lectura, conforme a Figma 4:1496
- **WHEN** se inicializa
- **THEN** `debugActionsEnabled` es false
- **AND** el booleano remoto `true` lo deja en true

### Requirement: RC-03 El puerto declara el default de debug

`defaultConfig` MUST incluir `enable_debug_actions: false` y `enable_categories: true`. El shell MUST NOT mostrar el texto `enable_categories:`. Figma: 4:1113.

#### Scenario: [RC-03] El default de debug es false

- **GIVEN** el puerto de Firebase, conforme a Figma 4:1113
- **WHEN** prepara `defaultConfig`
- **THEN** `enable_debug_actions` es false
- **AND** la pantalla no muestra el banner `enable_categories:`

### Requirement: SET-03 Borrar todas las tareas pide confirmación

El botón de borrar todo MUST usar `DeletionConfirmation`. Si se cancela, MUST NOT borrar. Figma: 4:1496.

#### Scenario: [SET-03] Cancelar no borra las tareas

- **GIVEN** las acciones de debug visibles, conforme a Figma 4:1496
- **WHEN** se pide borrar todo y se cancela
- **THEN** no se llama a `removeAllTasks`

### Requirement: SET-04 Borrar todo vuelve a la página 1

`removeAll` MUST vaciar las tareas y dejar la página actual en 1. El tope de dos semillas MUST seguir. Figma: 4:1496.

#### Scenario: [SET-04] La página vuelve a 1

- **GIVEN** la lista en la página 3, conforme a Figma 4:1496
- **WHEN** se borran todas las tareas
- **THEN** no quedan tareas y la página es 1

### Requirement: RC-04 Un 404 no es un error de pantalla

Un HTTP 404 MUST dejar categorías en true, debug en false, `error()` en null y un solo `console.info`. MUST NOT importar el SDK de Firebase en el servicio. Figma: 4:1113.

#### Scenario: [RC-04] La ausencia de config no muestra banner

- **GIVEN** un `fetch` que rechaza con HTTP 404, conforme a Figma 4:1113
- **WHEN** se inicializa
- **THEN** no hay error y se informa una vez por consola

### Requirement: RC-05 Un 500 es un toast descartable

Un HTTP 500 MUST dejar `error()` con el fallo. El shell MUST mostrar un `ion-toast` descartable con las claves `remoteConfig.error.*` y MUST NOT mostrar un panel fijo. Figma: 4:1496.

#### Scenario: [RC-05] El fallo no tapa el FAB

- **GIVEN** un error HTTP 500, conforme a Figma 4:1496
- **WHEN** el shell lo recibe
- **THEN** presenta un toast descartable
- **AND** no existe `.remote-error`

### Requirement: CATDEL-01 Borrar una categoría suelta sus tareas

Borrar una categoría MUST dejar sus tareas con `categoryId` null y MUST NOT borrarlas. Con el flag apagado, el shell MUST rechazar el borrado. Figma: 4:788.

#### Scenario: [CATDEL-01] Las tareas pasan a Todo

- **GIVEN** una categoría con una tarea, conforme a Figma 4:788
- **WHEN** se borra la categoría
- **THEN** la tarea sigue y su `categoryId` es null
