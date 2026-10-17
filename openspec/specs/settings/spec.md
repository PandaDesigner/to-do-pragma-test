# settings Specification

## Purpose
Controles de More/Settings para el modo oscuro y el idioma, guardados en el dispositivo y aplicados al arrancar.
## Requirements
### Requirement: SET-01 Controles de ajustes

La pantalla More/Settings MUST mostrar el modo oscuro y el idioma, y MUST guardar la elección. Figma: 4:1496.

#### Scenario: SET-01.1 Mostrar controles

- **GIVEN** la pantalla de ajustes, conforme a Figma 4:1496
- **WHEN** se abre
- **THEN** muestra el interruptor de modo oscuro y el selector de idioma.

#### Scenario: SET-01.2 Guardar modo oscuro

- **GIVEN** el interruptor apagado, conforme a Figma 4:1496
- **WHEN** se enciende
- **THEN** se guarda la preferencia oscura y se aplica `.ion-palette-dark`.

### Requirement: SET-02 Depuración en Ajustes

Ajustes MUST mostrar la sección de depuración con el botón que genera 5.000 tareas. La página de tareas MUST NOT mostrarla. Figma: 4:1496.

#### Scenario: SET-02.1 Botón en Ajustes

- **GIVEN** la pantalla de Ajustes, conforme a Figma 4:1496
- **WHEN** se abre
- **THEN** muestra el botón de generar 5.000 tareas
- **AND** la pantalla de tareas no lo muestra

