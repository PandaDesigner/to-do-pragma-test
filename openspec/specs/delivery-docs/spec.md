# delivery-docs Specification

## Purpose
TBD - created by archiving change firebase-env-production. Update Purpose after archive.
## Requirements
### Requirement: DOC-FB-01 El README documenta Firebase sin textos falsos

El README MUST tener una sección `## Firebase y Remote Config` que nombre el proyecto `to-do-pragma` y una tabla con `enable_debug_actions` BOOLEAN `false` y `enable_categories` BOOLEAN `true`. Esa sección MUST mencionar `src/assets/firebase-config.json`, `firebase-config.example.json`, las variables `FIREBASE_*` y que el archivo está en `.gitignore`. MUST explicar la demo con `https://console.firebase.google.com/project/to-do-pragma/config`, `Publicar cambios` y el reinicio de la app. El README MUST NOT contener una clave `AIza…`, un appId `1:<número>:web:<hex>` ni un messagingSenderId real. MUST NOT contener `No hay changes activos`. Los `debugHint` de `es.json` y `en.json` MUST NOT contener `virtual scroll`. La sección `## Estado OpenSpec` MUST nombrar cada carpeta de `openspec/changes` distinta de `archive`.

#### Scenario: [DOC-FB-01.1] El README documenta el proyecto y los parámetros

- **GIVEN** `README.md`
- **WHEN** se busca la sección `## Firebase y Remote Config`
- **THEN** existe y nombra el proyecto `to-do-pragma`
- **AND** tiene una tabla con `enable_debug_actions` BOOLEAN `false` y `enable_categories` BOOLEAN `true`

#### Scenario: [DOC-FB-01.2] El README explica dónde va la config sin commitearla

- **GIVEN** la sección de Firebase del README
- **WHEN** se lee
- **THEN** menciona `src/assets/firebase-config.json`, `firebase-config.example.json`, las variables `FIREBASE_*` y que el archivo está en `.gitignore`

#### Scenario: [DOC-FB-01.3] El README explica cómo cambiar el flag para la demo

- **GIVEN** la sección de Firebase del README
- **WHEN** se lee
- **THEN** contiene `https://console.firebase.google.com/project/to-do-pragma/config`, `Publicar cambios` y el paso de reiniciar la app

#### Scenario: [DOC-FB-01.4] El README no expone configuración real

- **GIVEN** `README.md`
- **WHEN** se lee completo
- **THEN** no contiene una clave con forma `AIza…`, ni un appId con forma `1:<número>:web:<hex>`, ni un messagingSenderId real

#### Scenario: [DOC-FB-01.5] No quedan los textos falsos señalados

- **GIVEN** `README.md`, `src/assets/i18n/es.json` y `src/assets/i18n/en.json`
- **WHEN** se leen
- **THEN** el README no contiene `No hay changes activos`
- **AND** ninguno de los `debugHint` contiene `virtual scroll`

#### Scenario: [DOC-FB-01.6] El estado de OpenSpec del README coincide con el repo

- **GIVEN** las carpetas de `openspec/changes` distintas de `archive`
- **WHEN** se lee la sección `## Estado OpenSpec` del README
- **THEN** nombra cada una de esas carpetas

