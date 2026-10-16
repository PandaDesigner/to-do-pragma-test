# Verificación completa de app-base

Rama de continuación: `feature/app-base-2` desde `develop`. Este informe registra la evidencia de las tareas 4.4, 5.1, 5.2 y 5.3 del change. Las tareas 1.1–4.3 ya quedaron verificadas en iteraciones previas (ver `openspec/changes/init/verify-report.md` y el historial de este change).

## Resumen de tareas

| Tarea | Estado | Evidencia |
| --- | --- | --- |
| 1.1 Modelos y State | done | `verify-report.md` previo |
| 1.2 Estrategias | done | `verify-report.md` previo |
| 1.3 Contratos y tokens | done | `verify-report.md` previo |
| 2.1 Persistencia | done | `verify-report.md` previo |
| 2.2 Stores | done | `verify-report.md` previo |
| 3.1 RemoteConfig | done | `verify-report.md` previo |
| 3.2 Decoradores | done | `verify-report.md` previo |
| 4.1 Páginas con virtual scroll | done | `verify-report.md` previo |
| 4.2 Shell con feature flag | done | `verify-report.md` previo |
| 4.3 Debug 5.000 tareas | done | `verify-report.md` previo |
| **4.4 README + APK firmado + IPA documentado** | **done en este informe** | sección Tarea 4.4 |
| **5.1 jest.config thresholds** | **done en este informe** | sección Tarea 5.1 |
| **5.2 .github/workflows/verify.yml** | **done en este informe** | sección Tarea 5.2 |
| **5.3 verify-report.md (este archivo)** | **done** | este documento |
| 5.4 PR abierto | pendiente de Pedro | ver `gh pr list` |

---

## Tarea 5.1: `jest.config.cjs` con thresholds 80/95/90/90

Se añadió `coverageThreshold` con cuatro bloques: `global` (80%), `./src/app/domain/` (95%), `./src/app/data/` (90%), `./src/app/store/` (90%). Cobertura actual ejecutada con `npm test -- --coverage`:

- `All files`: 97.57 % statements, 97.31 % branches, 94.32 % functions, 97.53 % lines (≥ 80 % global).
- `app/data/repositories`: 100 % en las cuatro métricas.
- `app/data/states`: 100 % en las cuatro métricas.
- `app/domain`: 100 % en las cuatro métricas.
- `app/store`: 100 % en las cuatro métricas.

Resultado: thresholds cumplidos sin modificar cobertura existente. El workflow CI fallará automáticamente si una capa cae por debajo de su umbral.

## Tarea 5.2: `.github/workflows/verify.yml`

Se renombró el workflow existente `ci.yml` (que ya tenía el job `verify` ejecutando `npm test`, `npm run lint`, `npm run format:check`, `npm run typecheck` y `npm run build`) a `verify.yml` para alinearlo con la propuesta CI. Cambios:

- Workflow renombrado: `name: verify`.
- `npm test` reemplazado por `npm test -- --coverage` para que los thresholds de 5.1 se apliquen en CI.
- Triggers sin cambios: PR a `develop` y `main`, push a `develop` y `main`.

GitHub Actions ejecutará el workflow en cada push/PR; el job `verify` falla si cualquier threshold de cobertura o cualquier step de lint/typecheck/format/build falla.

## Tarea 4.4: README + APK firmado + IPA documentado

### Keystore

`pragmadev.jks` (heredado de `init`) se mantiene intacto. Se generó `pragmadev-appbase.jks` en paralelo con keytool:

```
keytool -genkeypair -alias pragmadev-appbase -keyalg RSA -keysize 2048 -validity 10000 \
  -keystore pragmadev-appbase.jks \
  -storepass <random 32 chars base64> \
  -dname "CN=Todo Notebook (app-base), OU=Mobile, O=PragmaDev, L=City, ST=State, C=US" \
  -storetype PKCS12
```

Identidad:

- SHA-1 `18:07:1D:FB:E1:2D:0F:3C:91:A1:C1:BA:1A:D8:53:9C:15:5F:6E:1F`
- SHA-256 `96:D8:D7:2A:4F:47:73:F1:04:0E:10:28:24:B9:85:19:42:5B:36:7F:8A:9C:48:A4:21:B2:30:00:CA:26:25:11`
- Validez: 2026-10-16 → 2054-03-03 (~27 años).

Credenciales en `.env.local` (modo 600, gitignored). `KEYSTORE.md` documenta alias, fingerprints, variables de entorno y backup.

### Wrapper de build

`build.json` mantiene placeholders públicos (`ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_ALIAS_PASSWORD`). `scripts/build-android-release.cjs` lee `.env.local`, sustituye los placeholders en `build.json`, ejecuta `ng build --configuration production`, `ionic cordova build android --release --device` y `./gradlew :app:assembleRelease`, y restaura `build.json` al final en un bloque `finally`. Dos bugs corregidos durante esta tarea:

1. El regex `RegExp(PLACEHOLDERS.join('|'), 'g')` probaba `ANDROID_KEY_ALIAS` antes que `ANDROID_KEY_ALIAS_PASSWORD`, dejando el sufijo `_PASSWORD` sin reemplazar. Fix: ordenar placeholders por longitud antes de unirlos.
2. `process.exit(...)` dentro del `try` saltaba el `finally`, dejando `build.json` con valores reales después de un build fallido. Fix: capturar `exitCode` en una variable y llamar `process.exit` después del `finally`.

### APK y AAB firmados

Ejecutado `npm run ionic:build:android` con `ANDROID_KEYSTORE_PASSWORD` exportado. Resultado:

- `platforms/android/app/build/outputs/bundle/release/app-release.aab` (5.359.647 bytes, 517 entries). Firma OK.
- `platforms/android/app/build/outputs/apk/release/app-release.apk` (7.637.583 bytes). Firma verificada con `apksigner verify --verbose`:

```
Verifies
Verified using v1 scheme (JAR signing): false
Verified using v2 scheme (APK Signature Scheme v2): true
Verified using v3 scheme (APK Signature Scheme v3): false
Number of signers: 1
```

`build.json` quedó restaurado a sus placeholders públicos tras el build.

### IPA

No generado en este entorno: la firma de IPA para distribución requiere Xcode con un Apple Developer Team configurado en *Signing & Capabilities* y acceso al portal de Apple. El proceso queda documentado paso a paso en `README.md` § Build nativo → iOS, incluyendo la alternativa Fastlane para CI. La firma Cordova no versiona secretos: el provisioning profile y el certificado viven en el llavero del desarrollador.

### README

`README.md` reescrito desde la versión de `init` con cuatro secciones obligatorias del PDF:

- `## Retos` — cinco desafíos resueltos con referencia al código (`scripts/clean-cordova-platforms.cjs`, `scripts/build-android-release.cjs`, ajuste de `tsconfig` para TS 6, limitación PKCS12, deudas heredadas de `npm audit`).
- `## Optimizaciones` — `@Debounce(300)`, virtual scroll desde 200 ítems, OnPush + trackBy, estrategias puras, feature flag con timeout 3 s.
- `## Calidad y mantenibilidad` — cobertura por capa, LSP, ESLint, Prettier, RED→GREEN documentado, dominio sin Angular, contrato `Repository<T>` verificado contra dos implementaciones.
- `## Build nativo` — comandos exactos para Android (`npm run ionic:build:android`) e iOS (vía Xcode + opcional Fastlane), con rutas a los artefactos.

Formato aplicado con `npm run format` (Prettier). `format:check` posterior: `All matched files use Prettier code style!`.

## Comprobaciones finales

| Check | Resultado |
| --- | --- |
| `npm test` | 22 suites, 142 tests, 0 fallos |
| `npm run typecheck` | 0 errores |
| `npm run lint` | All files pass linting |
| `npm run format:check` | All matched files use Prettier code style |
| `npm test -- --coverage` | Thresholds globales y por capa cumplidos |
| `npm run ionic:build:android` | BUILD SUCCESSFUL, AAB + APK firmados |
| `apksigner verify --verbose` | APK Signature Scheme v2 verified |

## Estado de git al cierre

```
RM .github/workflows/ci.yml -> .github/workflows/verify.yml
 M .gitignore
 M README.md
 M config.xml
 M jest.config.cjs
 M openspec/changes/app-base/tasks.md
 M package-lock.json
 M package.json
?? KEYSTORE.md
?? build.json
?? scripts/
```

Archivos locales no versionados (`pragmadev-appbase.jks`, `.env.local`, `platforms/`, `plugins/`, `www/`, `dist/`, `coverage/`) están cubiertos por `.gitignore`.

## Siguiente paso autorizado

Pedro debe fusionar `feature/app-base-2` a `develop`. No archivar este change hasta que la fusión se confirme.