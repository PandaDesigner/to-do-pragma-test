# finish-remaining-ui Specification

## Purpose
Cierre de la interfaz de la prueba técnica: una categoría de tipo shopping se muestra como lista de notas, el badge de hoy restablece la vista del día y todo el cromo visible (rail, reintento del shell, categorías, sheet, fila y editor) toma sus etiquetas de los archivos de idioma. El borrado de una fila sigue siendo la opción final de Ionic, ya especificada en todo-screen.
## Requirements
### Requirement: FIN-01 El borrado de una fila de nota usa la opción final de Ionic

La fila MUST usar `ion-item-sliding` con `ion-item-options` en `side="end"`. Abrir la opción MUST NOT emitir el borrado. Pulsarla MUST emitir `remove` con el id de la tarea. Una fila con `variant` `note` MUST NOT renderizar `input` de checkbox y MUST renderizar el bullet de nota. Figma: 4:440 y 4:1404.

#### Scenario: [FIN-01.1] La opción final borra la nota solo al pulsarla

- **GIVEN** una fila con `variant` `note`, conforme a Figma 4:440
- **WHEN** se renderiza
- **THEN** existe `ion-item-sliding` con `ion-item-options` en `side="end"`
- **AND** no hay `input` y sí hay `.note-bullet`
- **AND** no se emite `remove` hasta pulsar `ion-item-option`

### Requirement: FIN-02 Una categoría de tipo shopping se muestra como notas

La página de tareas MUST decidir la variante de la lista a partir del `kind` de la categoría seleccionada. Con `kind` `shopping` MUST mostrar el overline de notas, el nombre de la categoría y filas `note`, MUST ocultar el panel de pendientes y MUST NOT renderizar checkbox ni meta de fecha. El filtro MUST seguir limitando la lista a esa categoría y la lista MUST seguir paginada. Figma: 4:617 y 4:440.

#### Scenario: [TODO-04.2] Un chip de shopping cambia la lista a notas

- **GIVEN** una categoría de tipo `shopping` con una tarea anterior a hoy, conforme a Figma 4:440
- **WHEN** se elige su chip
- **THEN** la página muestra "My notes" en inglés
- **AND** el panel de pendientes está ausente
- **AND** la fila tiene bullet de nota y no tiene checkbox

### Requirement: FIN-03 El badge de hoy restablece la vista del día

El badge de hoy MUST ser un botón. Al activarlo MUST limpiar el filtro de categoría, restaurar los estados de vista por defecto, reabrir el panel de pendientes y llevar la lista al inicio. MUST NOT navegar a otra ruta. La lista MUST conservar su paginación. Figma: 4:440.

#### Scenario: [TODO-01.3] HOY sale del modo notas y reabre el panel

- **GIVEN** una categoría de tipo `shopping` elegida y el panel de pendientes cerrado, conforme a Figma 4:440
- **WHEN** se activa el badge de hoy
- **THEN** el filtro de categoría queda vacío
- **AND** el panel de pendientes está visible

### Requirement: FIN-04 El cromo restante lee las claves de idioma

El rail, el reintento del shell, la página de categorías, el sheet de categoría, la fila de tarea y el editor de tarea MUST tomar sus etiquetas de `src/assets/i18n/es.json` y `src/assets/i18n/en.json`. Las claves MUST ser las mismas en ambos idiomas. Figma: 4:440.

#### Scenario: [I18N-01.3] El rail en español usa las claves del idioma

- **GIVEN** el shell renderizado en español, conforme a Figma 4:440
- **THEN** las etiquetas del rail son Todo, Rutina, Evento, Categoría y Más

