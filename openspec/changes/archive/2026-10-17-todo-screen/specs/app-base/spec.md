## MODIFIED Requirements

### Requirement: APP-10 Feature flag enable_categories en UI

Cuando `enable_categories` es `false`, la pestaña My y los chips de categoría MUST ocultarse; Routine y Event MUST permanecer visibles pero deshabilitadas. La pestaña Todo sigue mostrando las tareas sin filtro de categoría. Si una sección dependiente está abierta, MUST volver a Todo. Figma: 4:440.

#### Scenario: APP-10-A Flag en false

- **GIVEN** el shell con `enable_categories: false`, conforme a Figma 4:440
- **WHEN** se renderiza
- **THEN** la pestaña My no aparece.
- **AND** las tareas no muestran chip de categoría.
- **AND** Routine y Event están deshabilitadas.
- **AND** una sección dependiente abierta vuelve a Todo sin filtro de categoría.

### Requirement: APP-11 Botón debug 5.000 tareas

La página de Ajustes MUST exponer un botón que genera 5.000 tareas pendientes en bloque. La página de tareas MUST NOT mostrarlo. Figma: 4:1496.

#### Scenario: APP-11-A Generación masiva

- **GIVEN** la página de Ajustes, conforme a Figma 4:1496
- **WHEN** se invoca `generateFiveThousand()`
- **THEN** `tasks()` pasa a tener 5.005 tareas y `shouldVirtualize()` devuelve `true`.
