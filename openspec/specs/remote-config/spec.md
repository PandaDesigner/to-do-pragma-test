# remote-config Specification

## Purpose
TBD - created by archiving change firebase-env-production. Update Purpose after archive.
## Requirements
### Requirement: RC-06 El intervalo de Remote Config sale del entorno

El port MUST usar `environment.remoteConfigFetchIntervalMs` como `settings.minimumFetchIntervalMillis`. `environment.prod.ts` MUST declarar ese intervalo como un entero entre 0 y 60000. El port MUST mantener `settings.fetchTimeoutMillis` en 3000 y `defaultConfig` con `enable_categories` true y `enable_debug_actions` false. Una inicialización MUST llamar `fetchAndActivate` exactamente una vez. Un valor publicado nuevo MUST aplicarse en el siguiente arranque de producción cuando el intervalo ya venció.

#### Scenario: [RC-06.1] El intervalo mínimo sale del entorno

- **GIVEN** un entorno con `remoteConfigFetchIntervalMs` igual a 60000
- **WHEN** el port consulta Remote Config
- **THEN** `settings.minimumFetchIntervalMillis` es 60000

#### Scenario: [RC-06.2] Producción usa un intervalo corto y acotado

- **GIVEN** el archivo `environment.prod.ts`
- **WHEN** se lee `remoteConfigFetchIntervalMs`
- **THEN** es un entero entre 0 y 60000 ms

#### Scenario: [RC-06.3] El timeout y los valores por defecto no cambian

- **GIVEN** el port de Remote Config con el nuevo intervalo
- **WHEN** consulta Remote Config
- **THEN** `settings.fetchTimeoutMillis` es 3000
- **AND** `defaultConfig` es `enable_categories` true y `enable_debug_actions` false

#### Scenario: [RC-06.4] Un valor publicado nuevo se aplica al reiniciar la app

- **GIVEN** un primer arranque en producción en el que Remote Config devuelve `enable_debug_actions` false
- **AND** se publica `enable_debug_actions` true
- **WHEN** la app arranca otra vez con el intervalo vencido
- **THEN** `debugActionsEnabled` es true

#### Scenario: [RC-06.5] Una sola activación por arranque

- **GIVEN** el port de Remote Config
- **WHEN** se consulta Remote Config
- **THEN** `fetchAndActivate` se llama exactamente una vez

