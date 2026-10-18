## MODIFIED Requirements

### Requirement: APP-09 Páginas tasks y categories con OnPush, paginación y virtual scroll

Las páginas `tasks` y `categories` MUST ser standalone con `OnPush`.

La página `tasks` MUST renderizar la lista paginada: MUST recortar la lista filtrada en páginas de 20 filas con el tamaño tomado de `PAGE_SIZE`, MUST exponer el total de páginas y la página actual acotada al rango válido, MUST incluir un `ion-infinite-scroll` deshabilitado cuando no queden páginas siguientes, MUST mostrar un paginador numerado anclado bajo la zona de scroll solo cuando haya más de una página, y MUST NOT renderizar `cdk-virtual-scroll-viewport`. La fila de la lista MUST seguir la identidad de la tarea para no recrear el DOM al paginar.

La página `categories` MUST aplicar virtual scroll de CDK a partir de 200 categorías mediante `shouldVirtualize()`, MUST renderizar `cdk-virtual-scroll-viewport` con `*cdkVirtualFor` y `trackById` al alcanzar el umbral, y MUST renderizar la lista con `@for` por debajo del umbral.

#### Scenario: [APP-09.1] La lista de tasks pagina de 20 en 20 sin virtual scroll

- **GIVEN** la página `tasks` con 5.000 tareas generadas más 5 tareas ya existentes
- **WHEN** se renderiza la lista
- **THEN** `totalPages()` es 251
- **AND** `visibleTasks()` tiene 20 elementos
- **AND** se renderizan 20 elementos `app-task-item` dentro de `section.task-list`
- **AND** existe un `nav.pager` y un `ion-infinite-scroll` habilitado
- **AND** `loadMore()` avanza a la página siguiente con 20 elementos
- **AND** no existe `cdk-virtual-scroll-viewport`

#### Scenario: [APP-09.2] El virtual scroll de CDK vive en categories

- **GIVEN** la página `categories` con 199 categorías
- **WHEN** `shouldVirtualize()` evalúa
- **THEN** devuelve `false` y la lista se renderiza con `@for`.
- **WHEN** se añade la categoría número 200
- **THEN** `shouldVirtualize()` devuelve `true` y se renderiza `cdk-virtual-scroll-viewport`.

### Requirement: APP-11 Botón debug 5.000 tareas

La página de Ajustes MUST exponer un botón que genera 5.000 tareas pendientes en bloque. La página de tareas MUST NOT mostrarlo. Figma: 4:1496.

#### Scenario: APP-11-A Generación masiva

- **GIVEN** la página de Ajustes, conforme a Figma 4:1496
- **WHEN** se invoca `generateFiveThousand()`
- **THEN** `tasks()` pasa a tener 5.005 tareas y la lista de `tasks` las pagina de 20 en 20 sin virtual scroll.