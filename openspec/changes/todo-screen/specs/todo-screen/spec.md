## ADDED Requirements

### Requirement: TODO-01 Rail y fecha del día

La pantalla de tareas MUST mostrar el rail de cinco pestañas y la fecha del día con el badge de hoy. Routine y Event MUST verse y MUST NOT navegar. Figma: 4:440.

#### Scenario: TODO-01.1 Rail de cinco pestañas

- **GIVEN** la pantalla de tareas, conforme a Figma 4:440
- **WHEN** se abre
- **THEN** el rail muestra Todo, Routine, Event, My y More, con Todo activa
- **AND** Routine y Event están deshabilitadas

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
