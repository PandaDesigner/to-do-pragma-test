## MODIFIED Requirements

### Requirement: TODO-01 Rail y fecha del día

La pantalla de tareas MUST mostrar el rail de cinco pestañas y la fecha del día con el badge de hoy. Con categorías activas, Routine y Event MUST navegar y filtrar por la sección de categoría correspondiente. El título del día MUST formatearse con el idioma activo de la aplicación y MUST usar un nombre de día y de mes localizado en español e inglés, con respaldo a inglés cuando el idioma no está soportado. El badge de hoy MUST dimensionarse por su contenido, sin ocupar el ancho disponible del grupo de acciones. Figma: 4:440.

#### Scenario: TODO-01.1 Rail de cinco pestañas

- **GIVEN** la pantalla de tareas, conforme a Figma 4:440
- **WHEN** se abre
- **THEN** el rail muestra Todo, Routine, Event, My y More, con Todo activa
- **AND** Routine y Event están habilitadas cuando las categorías están activas

#### Scenario: TODO-01.2 Fecha y badge

- **GIVEN** el reloj en lunes 23 de febrero, conforme a Figma 4:440
- **WHEN** se abre la pantalla
- **THEN** el título de fecha es `23.Mon` en inglés y se muestra el badge de hoy

#### Scenario: TODO-01.3 El título del día se localiza

- **GIVEN** el reloj en domingo 18 de octubre de 2026
- **WHEN** se calcula el título del día en español
- **THEN** el nombre del día aparece en español y no en inglés

#### Scenario: TODO-01.4 El badge se dimensiona por su contenido

- **GIVEN** la pantalla de tareas abierta
- **WHEN** se mide el botón de hoy dentro del grupo de acciones
- **THEN** su ancho es el de su contenido y su alto es el medido, no el alto disponible del grupo