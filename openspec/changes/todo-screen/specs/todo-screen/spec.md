## ADDED Requirements

### Requirement: TODO-01 Rail y fecha del día

La pantalla de tareas MUST mostrar el rail de cinco pestañas y la fecha del día con el badge de hoy. Con categorías activas, Routine y Event MUST navegar y filtrar por la sección de categoría correspondiente. Figma: 4:440.

#### Scenario: TODO-01.1 Rail de cinco pestañas

- **GIVEN** la pantalla de tareas, conforme a Figma 4:440
- **WHEN** se abre
- **THEN** el rail muestra Todo, Routine, Event, My y More, con Todo activa
- **AND** Routine y Event están habilitadas cuando las categorías están activas

#### Scenario: TODO-01.2 Fecha y badge

- **GIVEN** el reloj en lunes 23, conforme a Figma 4:440
- **WHEN** se abre la pantalla
- **THEN** el título de fecha es `23.Mon` y se muestra el badge de hoy

### Requirement: TODO-02 Panel de pendientes

La pantalla MUST mostrar el panel de tareas no hechas de días anteriores, abierto o cerrado. Figma: 4:440 y 4:520.

#### Scenario: TODO-02.1 Panel abierto

- **GIVEN** hay tareas pendientes anteriores a hoy, conforme a Figma 4:440
- **WHEN** el panel está abierto
- **THEN** flota sobre la lista, en left 62 y top 187, con ancho 300 y cabecera de 60

#### Scenario: TODO-02.2 Panel cerrado

- **GIVEN** el panel abierto, conforme a Figma 4:520
- **WHEN** se pulsa su cabecera
- **THEN** queda en 62 de alto y la lista baja con un hueco de 83

### Requirement: TODO-03 Tarea completada

Una tarea completada MUST mostrar el checkbox marcado y el título tachado. Figma: 4:664.

#### Scenario: TODO-03.1 Tachado

- **GIVEN** una tarea completada en la lista, conforme a Figma 4:664
- **WHEN** se renderiza
- **THEN** el título está tachado y el checkbox está marcado

### Requirement: TODO-04 Filtro por chips

Con categorías activas, la pantalla MUST filtrar la lista con chips. Figma: 4:973.

#### Scenario: TODO-04.1 Chip seleccionado

- **GIVEN** varias categorías, conforme a Figma 4:973
- **WHEN** se elige una
- **THEN** la lista solo muestra tareas de esa categoría y el chip queda seleccionado

### Requirement: TODO-05 Estado vacío

Sin tareas en la vista, la pantalla MUST mostrar la ilustración, el texto y la llamada a la acción. Figma: 4:1062.

#### Scenario: TODO-05.1 Sin tareas

- **GIVEN** la vista sin tareas, conforme a Figma 4:1062
- **WHEN** se abre
- **THEN** se ve la ilustración de 68 y el botón de 239 por 50
- **AND** no se ve el editor incrustado

### Requirement: TODO-06 Alta rápida y sheet

El input rápido MUST crear una tarea de hoy con el título escrito. El botón flotante MUST abrir el formulario en un `ion-modal`. La página MUST NOT mostrar el editor incrustado. Figma: 4:440.

#### Scenario: TODO-06.1 Alta rápida

- **GIVEN** el input rápido con un título, conforme a Figma 4:440
- **WHEN** se envía
- **THEN** se crea una tarea de hoy con ese título

#### Scenario: TODO-06.2 Abrir el sheet

- **GIVEN** la pantalla de tareas, conforme a Figma 4:440
- **WHEN** se pulsa el botón flotante
- **THEN** se abre un `ion-modal` y el editor no está en la página

### Requirement: TODO-07 Vistas por sección de categoría

Todo, Routine y Event MUST reutilizar la pantalla de tareas, con enlaces propios y filtros consistentes en lista, chips y panel. Las vistas MUST mostrar pendientes, vencidas y completadas, no archivadas. Figma: 4:440, 4:664 y 4:973; extensión funcional aprobada.

#### Scenario: TODO-07.1 Routine muestra solo sus categorías

- **GIVEN** categorías General, Routine y Event con tareas, conforme a Figma 4:440
- **WHEN** se abre `/tabs/routine`
- **THEN** Routine está activa y solo aparecen tareas de categorías Routine
- **AND** los chips solo ofrecen esas categorías.

#### Scenario: TODO-07.2 Event muestra solo sus categorías

- **GIVEN** categorías de las tres secciones con tareas, conforme a Figma 4:440
- **WHEN** se abre o recarga `/tabs/event`
- **THEN** Event está activa y solo aparecen tareas de categorías Event
- **AND** una sección sin tareas muestra el estado vacío, no las tareas de otra sección.

#### Scenario: TODO-07.3 Todo reúne todas las secciones

- **GIVEN** tareas con categorías de las tres secciones y sin categoría, conforme a Figma 4:440
- **WHEN** se abre `/tabs/tasks`
- **THEN** se muestran todas las que pasan el filtro de categoría elegido
- **AND** el chip Todas no limita por sección.

#### Scenario: TODO-07.4 Completar conserva la tarea visible

- **GIVEN** una tarea pendiente o vencida en cualquiera de las tres vistas, conforme a Figma 4:664
- **WHEN** se completa
- **THEN** sigue visible, marcada y tachada
- **AND** al archivarla deja de mostrarse.

#### Scenario: TODO-07.5 Panel y chips respetan la sección

- **GIVEN** tareas atrasadas y categorías de varias secciones, conforme a Figma 4:440 y 4:973
- **WHEN** se abre Routine o Event y se elige un chip
- **THEN** la lista y el panel solo contienen tareas de esa categoría y sección
- **AND** reprogramar no modifica tareas de otras secciones.

### Requirement: TODO-08 Secciones condicionadas por categorías

Routine y Event MUST estar habilitadas solo con categorías activas. Los enlaces directos y una sección ya abierta MUST volver a Todo si el flag está apagado. Figma: 4:440.

#### Scenario: TODO-08.1 Apagar el flag desde una sección

- **GIVEN** Routine o Event abierta con categorías activas, conforme a Figma 4:440
- **WHEN** `enable_categories` pasa a false
- **THEN** vuelve a Todo, limpia el filtro de categoría y deshabilita Routine/Event
- **AND** My y los chips se ocultan.

#### Scenario: TODO-08.2 Enlace directo con flag apagado

- **GIVEN** categorías desactivadas, conforme a Figma 4:440
- **WHEN** se intenta abrir `/tabs/routine` o `/tabs/event`
- **THEN** el guard redirige a `/tabs/tasks`.

### Requirement: TODO-09 Alta con categoría de la sección

Desde Routine o Event, el alta MUST asignar una categoría de la sección activa y MUST NOT guardar una tarea sin asignación o de otra sección. La creación desde Todas MUST permitir elegir esa categoría en el formulario. Figma: 4:440 y 4:869; extensión funcional aprobada.

#### Scenario: TODO-09.1 Alta rápida con categoría elegida

- **GIVEN** un chip de categoría de la sección activa elegido, conforme a Figma 4:973
- **WHEN** se envía un título en el input rápido
- **THEN** se crea para hoy con esa categoría y permanece visible.

#### Scenario: TODO-09.2 Alta desde Todas conserva el título

- **GIVEN** Todas seleccionado en Routine o Event, conforme a Figma 4:440
- **WHEN** se envía un título en el input rápido
- **THEN** se abre el formulario con ese título sin crear todavía una tarea
- **AND** solo ofrece categorías de la sección activa y exige elegir una para guardar.

#### Scenario: TODO-09.3 Asignación incompatible no se guarda

- **GIVEN** el formulario de Routine o Event, conforme a Figma 4:440
- **WHEN** se intenta guardar sin categoría o con una de otra sección
- **THEN** aparece un error y el formulario conserva los valores
- **AND** no se modifica el repositorio de tareas.

#### Scenario: TODO-09.4 Sección sin categorías

- **GIVEN** una sección sin categorías, conforme a Figma 4:1062
- **WHEN** se intenta añadir una tarea
- **THEN** se ofrece ir a crear una categoría antes
- **AND** no se guarda una tarea que quede fuera de la vista.
