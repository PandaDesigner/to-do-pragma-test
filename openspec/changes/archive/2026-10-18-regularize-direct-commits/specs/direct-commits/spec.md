## ADDED Requirements

### Requirement: SHEET-90 El editor abre al 90 por ciento

Los sheets de tarea y de categoría MUST usar `initialBreakpoint` 0.9, `breakpoints` [0, 0.5, 0.9] y `handleBehavior` cycle. Figma: 4:440.

#### Scenario: [SHEET-90.1] El sheet abre al 90 por ciento

- **GIVEN** el template del editor de tareas y el de categorías, conforme a Figma 4:440
- **WHEN** se lee el `ion-modal`
- **THEN** `initialBreakpoint` es 0.9
- **AND** `breakpoints` es [0, 0.5, 0.9]
- **AND** `handleBehavior` es cycle

### Requirement: PAGE-20 La lista pagina de a 20

La página de tareas MUST usar `PAGE_SIZE` 20 y un `ion-infinite-scroll` que llama `loadMore`. Figma: 4:440.

#### Scenario: [PAGE-20.1] Hay páginas de 20 y scroll infinito

- **GIVEN** el dominio de paginación y el template de tareas, conforme a Figma 4:440
- **WHEN** se leen
- **THEN** `PAGE_SIZE` es 20
- **AND** el scroll infinito vive en la lista y llama `loadMore`

### Requirement: SCROLL-01 El pozo de la lista mide 60vh

`.task-scroll` MUST ser `flex: 0 1 60vh`, con `max-height: 60vh` y `margin-top: 20px`. Figma: 4:440.

#### Scenario: [SCROLL-01.1] El pozo queda separado de los filtros

- **GIVEN** los estilos de la página de tareas, conforme a Figma 4:440
- **WHEN** se lee `.task-scroll`
- **THEN** el flex es `0 1 60vh`
- **AND** la altura máxima es `60vh`
- **AND** el margen superior es `20px`

### Requirement: PAGER-01 El paginador queda debajo del pozo

El `nav.pager` MUST ser hermano de `.task-scroll` y MUST renderizarse solo cuando `totalPages() > 1`. Figma: 4:440.

#### Scenario: [PAGER-01.1] El paginador no vive dentro del scroll

- **GIVEN** el template de tareas, conforme a Figma 4:440
- **WHEN** se lee el marcado
- **THEN** el `nav.pager` queda después de cerrar `.task-scroll`
- **AND** solo aparece si hay más de una página

### Requirement: ROW-01 La fila no tiene borrado inline

La fila MUST usar `ion-item-options` al final, MUST NOT incluir un `ion-button` de borrar en la fila, MUST recortar el título con ellipsis y MUST tachar el título completado en `:host.completed .task-title__text`. Figma: 4:440.

#### Scenario: [ROW-01.1] La fila conserva alto, desborde y tachado

- **GIVEN** el template y los estilos de `app-task-item`, conforme a Figma 4:440
- **WHEN** se leen
- **THEN** el borrado está en `ion-item-options`
- **AND** no hay un `ion-button` en la fila
- **AND** el título usa ellipsis y, si está completado, `line-through`

### Requirement: DEBUG-01 El desarrollo muestra el debug

`environment.ts` MUST declarar `production: false`. `resolveDebugActions` MUST devolver true cuando `environment.production` es false. Figma: 4:1496.

#### Scenario: [DEBUG-01.1] ng serve deja el debug encendido

- **GIVEN** el entorno de desarrollo y `remote-config.ts`, conforme a Figma 4:1496
- **WHEN** se leen
- **THEN** `production` es false
- **AND** el modo de debug sale de `environment.production`
