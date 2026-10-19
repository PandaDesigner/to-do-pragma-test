## ADDED Requirements

### Requirement: ENV-01 La build de producción usa un entorno versionado

La configuración `production` MUST reemplazar `src/environments/environment.ts` por `src/environments/environment.prod.ts`. La configuración `development` MUST NOT declarar `fileReplacements`. Ambos archivos MUST estar versionados, MUST compartir el tipo `AppEnvironment` y MUST contener solo `production` y `remoteConfigFetchIntervalMs`. `environment.ts` MUST declarar `production: false`. `environment.prod.ts` MUST declarar `production: true`. Ninguno MUST contener `apiKey`, `AIza`, `appId`, `password` ni `secret`. `.gitignore` MUST seguir ignorando `src/assets/firebase-config.json`, `.env.*` y `*.keystore`. El modo de Remote Config MUST leerse de `environment` y MUST NOT usar `isDevMode()`. La única lectura del entorno en `src/app/core/config` MUST ser `environment.remoteConfigFetchIntervalMs` en el port; `remote-config.ts` MUST NOT leer `environment` porque el flag de debug lo decide Firebase Remote Config. Los scripts `build:android:release`, `ionic:build` e `ionic:build:android` MUST ejecutar `ng build --configuration production`. El job `verify` MUST ejecutar `npm run build -- --configuration production` y ningún script MUST copiar `environment.example.ts` sobre `environment.ts`.

#### Scenario: [ENV-01.1] La build de producción reemplaza el entorno

- **GIVEN** el archivo `angular.json` del proyecto
- **WHEN** se lee `build.configurations.production.fileReplacements`
- **THEN** contiene el reemplazo de `src/environments/environment.ts` por `src/environments/environment.prod.ts`

#### Scenario: [ENV-01.2] La build de desarrollo no reemplaza el entorno

- **GIVEN** el archivo `angular.json` del proyecto
- **WHEN** se lee `build.configurations.development`
- **THEN** no declara `fileReplacements`

#### Scenario: [ENV-01.3] Los entornos están versionados y solo tienen valores públicos

- **GIVEN** `environment.ts` y `environment.prod.ts`
- **WHEN** se revisan `.gitignore` y el contenido de ambos archivos
- **THEN** ninguno de los dos está ignorado
- **AND** `environment.ts` declara `production` false y `environment.prod.ts` declara `production` true
- **AND** ninguno contiene `apiKey`, `AIza`, `appId`, `password` ni `secret`

#### Scenario: [ENV-01.4] Los archivos con secretos siguen fuera de git

- **GIVEN** el archivo `.gitignore`
- **WHEN** se lee
- **THEN** ignora `src/assets/firebase-config.json`, `.env.*` y `*.keystore`

#### Scenario: [ENV-01.5] Los scripts de release compilan la web en modo producción

- **GIVEN** `package.json`, `build-android-release.cjs` e `ionic-build.cjs`
- **WHEN** se leen los comandos de `build:android:release`, `ionic:build` e `ionic:build:android`
- **THEN** cada uno ejecuta `ng build --configuration production` antes de Cordova

#### Scenario: [ENV-01.6] El modo sale de una sola fuente de verdad

- **GIVEN** el código de `src/app/core/config`
- **WHEN** se busca cómo se decide el modo producción
- **THEN** se usa `environment` y no `isDevMode()`
- **AND** la única lectura del entorno en el módulo es `environment.remoteConfigFetchIntervalMs` en el port
- **AND** `remote-config.ts` no lee `environment` porque el flag de debug lo decide Firebase Remote Config

#### Scenario: [ENV-01.7] El CI compila producción sin copiar ejemplos

- **GIVEN** `.github/workflows/verify.yml` y `package.json`
- **WHEN** se leen el job `verify` y los scripts `pretest`, `prebuild` y `pretypecheck`
- **THEN** el job ejecuta `npm run build -- --configuration production`
- **AND** ningún script copia `environment.example.ts` sobre `environment.ts`
