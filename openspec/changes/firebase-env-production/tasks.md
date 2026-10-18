## 1. T1 Entornos versionados

### 1.1 [ENV-01.1]

- [x] 1.1.1 RED `src/project-config.spec.ts` › `[ENV-01.1] production replaces environment.ts with environment.prod.ts`
- [x] 1.1.2 GREEN `fileReplacements` solo en `production`
- [x] 1.1.3 REFACTOR

### 1.2 [ENV-01.2]

- [x] 1.2.1 RED `src/project-config.spec.ts` › `[ENV-01.2] development keeps environment.ts without fileReplacements`
- [x] 1.2.2 GREEN
- [x] 1.2.3 REFACTOR

### 1.3 [ENV-01.3]

- [x] 1.3.1 RED `src/environments/environment.spec.ts` › `[ENV-01.3] environment files are tracked, typed and credential-free`
- [x] 1.3.2 GREEN versionar ambos entornos y quitarlos del `.gitignore`
- [x] 1.3.3 REFACTOR borrar `environment.example.ts` y `ensure-environment.cjs`

### 1.4 [ENV-01.4]

- [x] 1.4.1 RED `src/project-config.spec.ts` › `[ENV-01.4] gitignore keeps firebase-config, env files and keystores out of git`
- [x] 1.4.2 GREEN
- [x] 1.4.3 REFACTOR

### 1.5 [ENV-01.5]

- [x] 1.5.1 RED `src/build-scripts.spec.ts` › `[ENV-01.5] release scripts build the web bundle with --configuration production`
- [x] 1.5.2 GREEN explicitar el flag donde falte
- [x] 1.5.3 REFACTOR

### 1.6 [ENV-01.6]

- [x] 1.6.1 RED `src/app/core/config/firebase-remote-config-port.spec.ts` › `[ENV-01.6] reads the build mode from environment, not isDevMode`
- [x] 1.6.2 GREEN mock de `environment` y quitar `isDevMode()`
- [x] 1.6.3 REFACTOR `remote-config.spec.ts` deja de mutar `environment.production`

### 1.7 [ENV-01.7]

- [x] 1.7.1 RED `src/project-config.spec.ts` › `[ENV-01.7] CI builds production without copying an environment example`
- [x] 1.7.2 GREEN quitar `pretest`, `prebuild` y `pretypecheck`
- [x] 1.7.3 REFACTOR

## 2. T2 Intervalo de Remote Config

### 2.1 [RC-06.1]

- [x] 2.1.1 RED `firebase-remote-config-port.spec.ts` › `[RC-06.1] uses environment.remoteConfigFetchIntervalMs as minimumFetchIntervalMillis`
- [x] 2.1.2 GREEN
- [x] 2.1.3 REFACTOR

### 2.2 [RC-06.2]

- [x] 2.2.1 RED `environment.spec.ts` › `[RC-06.2] production fetch interval is an integer between 0 and 60000 ms`
- [x] 2.2.2 GREEN valor aprobado en la PARADA 1
- [x] 2.2.3 REFACTOR

### 2.3 [RC-06.3]

- [x] 2.3.1 RED `[RC-06.3] keeps the 3000 ms timeout and safe defaults`
- [x] 2.3.2 GREEN
- [x] 2.3.3 REFACTOR

### 2.4 [RC-06.4]

- [x] 2.4.1 RED `remote-config.spec.ts` › `[RC-06.4] applies a newly published value on the next production start`
- [x] 2.4.2 GREEN
- [x] 2.4.3 REFACTOR

### 2.5 [RC-06.5]

- [x] 2.5.1 RED `[RC-06.5] calls fetchAndActivate exactly once per fetch`
- [x] 2.5.2 GREEN o registro de verificación sin RED si `[RC-01]` ya lo cubre en el port
- [x] 2.5.3 REFACTOR

## 3. T3 Config de Firebase en release

### 3.1 [FBCFG-01.1]

- [x] 3.1.1 RED `src/build-scripts.spec.ts` › `[FBCFG-01.1] --require fails with a clear message when firebase-config.json is missing`
- [x] 3.1.2 GREEN `ensureFirebaseConfig`
- [x] 3.1.3 REFACTOR

### 3.2 [FBCFG-01.2]

- [x] 3.2.1 RED `[FBCFG-01.2] generates firebase-config.json from FIREBASE_* variables`
- [x] 3.2.2 GREEN
- [x] 3.2.3 REFACTOR

### 3.3 [FBCFG-01.3]

- [x] 3.3.1 RED `[FBCFG-01.3] never overwrites an existing firebase-config.json`
- [x] 3.3.2 GREEN
- [x] 3.3.3 REFACTOR

### 3.4 [FBCFG-01.4]

- [x] 3.4.1 RED `[FBCFG-01.4] warns and succeeds without --require`
- [x] 3.4.2 GREEN
- [x] 3.4.3 REFACTOR

### 3.5 [FBCFG-01.5]

- [x] 3.5.1 RED `[FBCFG-01.5] never prints configuration values`
- [x] 3.5.2 GREEN
- [x] 3.5.3 REFACTOR

### 3.6 [FBCFG-01.6]

- [x] 3.6.1 RED `[FBCFG-01.6] release scripts require firebase config before the production build`
- [x] 3.6.2 GREEN enganchar `--require` en los release
- [x] 3.6.3 REFACTOR paso sin `--require` en el CI

### 3.7 [FBCFG-01.7]

- [x] 3.7.1 RED `[FBCFG-01.7] incomplete variables fail naming only the missing keys`
- [x] 3.7.2 GREEN
- [x] 3.7.3 REFACTOR

## 4. T5 README

### 4.1 [DOC-FB-01.1] a [DOC-FB-01.6]

- [x] 4.1.1 RED `src/delivery-docs.spec.ts` con los seis títulos del prompt
- [x] 4.1.2 GREEN sección Firebase, Estado OpenSpec y `debugHint`
- [x] 4.1.3 REFACTOR

## 5. Verificación

- [x] 5.1 `npm test -- --coverage`, lint, lint:styles, format:check, typecheck, trace:check y build de producción
- [x] 5.2 Demostrar `production: true` en `www/` sin imprimir config
- [x] 5.3 Clon limpio sin `firebase-config.json`: build verde y `--require` en rojo
- [ ] 5.4 APK de release solo si Pedro lo pide en esta máquina
- [x] 5.5 `openspec validate firebase-env-production --strict`
- [x] 5.6 Filas en `openspec/traceability.md`

## 6. Notion

- [ ] 6.1 Añadir nota al final de P-06 `3fccb441977381a593e5f50f6f970545`
- [ ] 6.2 Añadir nota al final de P-28 `3fccb441977381dbaf8cf4d5bb4dfbaf`
- [x] 6.3 No crear filas para NUEVA-01 ni NUEVA-02

## 7. Fuera de este apply

- [ ] 7.1 RC-07 solo si la PARADA 1 lo aprueba
- [x] 7.2 Change B `regularize-direct-commits` después de cerrar A
