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

