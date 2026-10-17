## ADDED Requirements

### Requirement: I18N-01 Idiomas español e inglés

La app MUST ofrecer español e inglés. El idioma inicial MUST salir del dispositivo y MUST usar inglés como respaldo. El cambio MUST verse sin reiniciar. Figma: 4:1496.

#### Scenario: I18N-01.1 Cambio en caliente

- **GIVEN** la pantalla en inglés, conforme a Figma 4:1496
- **WHEN** se elige español
- **THEN** los textos visibles cambian a español.

#### Scenario: I18N-01.2 Claves completas

- **GIVEN** los archivos `es.json` y `en.json`, conforme a Figma 4:1496
- **WHEN** se comparan sus claves
- **THEN** contienen las mismas claves.
