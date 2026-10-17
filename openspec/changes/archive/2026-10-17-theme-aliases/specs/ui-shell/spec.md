## MODIFIED Requirements

### Requirement: UI-22 Paleta oscura verificable

El sistema MUST ofrecer la paleta de Figma 4:1560 con primary #8B7FC0, primary-dark y text #EDEAF5 y surface #1E1A2B. Sin preferencia guardada, MUST seguir prefers-color-scheme. Una preferencia oscura MUST aplicar .ion-palette-dark. Una preferencia clara MUST retirar esa clase y conservar la paleta clara aunque el sistema esté en oscuro. Figma: 4:1560.

#### Scenario: UI-22.1 Oscuro por clase

- **GIVEN** .ion-palette-dark aplicada al documento y el sistema en claro, conforme a Figma 4:1560
- **WHEN** se renderiza la pantalla
- **THEN** los colores efectivos corresponden a la columna oscura y no existen overrides locales contradictorios.

#### Scenario: UI-22.2 Oscuro del sistema

- **GIVEN** el documento sin .ion-palette-dark, conforme a Figma 4:1560
- **WHEN** el sistema reporta prefers-color-scheme: dark
- **THEN** se aplica la paleta de Figma 4:1560.

#### Scenario: UI-22.3 Retorno al claro

- **GIVEN** la clase forzando oscuro, conforme a Figma 4:1560
- **WHEN** se aplica una preferencia clara
- **THEN** se retira .ion-palette-dark y se conserva la paleta clara aunque el sistema esté en oscuro.
