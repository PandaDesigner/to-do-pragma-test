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

---

# Cierre de la configuración nativa Cordova (iteración 6)

Cambios adicionales de la rama para cerrar la configuración nativa de Cordova exigida por la propuesta del PDF, sin tocar la lógica de la app.

## config.xml

- Widget con `version="1.0.0"`, `android-versionCode="1"` e `ios-CFBundleVersion="1"`.
- `<access origin="*"/>`, `<allow-navigation href="*"/>` y `<allow-intent>` para `http`, `https`, `tel`, `sms`, `mailto` y `geo`.
- `<preference name="scheme" value="app"/>` y `<preference name="hostname" value="localhost"/>` documentados en cabecera: cambiarlos después de guardar datos reales invalida el origen de Ionic Storage.
- Android: `android-minSdkVersion=24`, `android-targetSdkVersion=36` (compatible con `cordova-android@15`; el requisito original pedía 35 pero cordova-android 15 falla `cordova requirements` con 35), `AndroidXEnabled=true`, `AndroidWindowSplashScreenAnimatedIcon=resources/android/splash-icon.png` y `AndroidWindowSplashScreenBackground=#3A2E5C`.
- iOS: `deployment-target=13.0`, `StatusBarOverlaysWebView=false` y `StatusBarBackgroundColor=#4b3f6b` tomado del theme (`--ion-color-primary` en `src/app/theme/variables.scss`).
- Iconos y splash en `resources/`: Android adaptive con foreground y background en cada densidad, iOS cubriendo todos los tamaños requeridos hasta `icon-1024.png`, splash universal `Default@2x~universal~anyany.png`.

## package.json y spec de config

- `cordova.platforms = ["android", "ios"]` declarado en el manifiesto. El spec `INIT-04` (`src/project-config.spec.ts`) acepta ese array literal en lugar de vaciarlo.
- `scripts/clean-cordova-platforms.cjs` reescribe `cordova.platforms` a la baseline `["android", "ios"]` (no lo vacía), de modo que el spec sigue pasando después de que el CLI Cordova lo mute.
- Scripts nuevos en `package.json`:
  - `build:android` → `ng build && cordova build android --debug`
  - `build:android:release` → `ng build --configuration production && cordova build android --release` (usa `build.json`)
  - `build:ios` → `cordova build ios --release --device --buildFlag=CODE_SIGNING_ALLOWED=NO`
  - `requirements` → `cordova requirements --verbose`

## CI: `.github/workflows/verify.yml`

- Job `android` (Ubuntu, JDK 17 Temurin, `android-actions/setup-android@v4` con `cmdline-tools-version 13.0`, cache de Gradle, `npm ci`, `cordova platform add android`, `npm run build:android`, sube `app-debug.apk` como artefacto `android-debug-apk`).
- Job `ios` (macOS-latest, `CODE_SIGNING_ALLOWED=NO`/`CODE_SIGNING_REQUIRED=NO`, instala CocoaPods, `cordova platform add ios`, `npm run build:ios`, sube `.app` y `.xcarchive` desde `platforms/ios/build/Release-iphoneos/` como artefacto `ios-unsigned-archive`).

## README

- Corregido `Runner.xcworkspace` → `App.xcworkspace`. cordova-ios 8 genera ese nombre fijo (ver `node_modules/cordova-ios/CordovaLib/CordovaLib.docc/upgrading-8.md`); el nombre de la app solo aparece como `CFBundleDisplayName` en `Info.plist`. El requisito de la tarea que pedía `Todo Notebook.xcworkspace` se descartó tras validar el directorio `platforms/ios/`.
- Keystore unificado: README, `build.json` y `.gitignore` apuntan a `pragmadev-appbase.jks` (los nombres antiguos `pragmadev.jks` ya estaban cubiertos por el patrón `*.jks`).
- Requisitos del Mac documentados: JDK 17, `ANDROID_HOME`, `sdkmanager --licenses`, `xcodebuild -license accept`, CocoaPods 1.16+ y `ios-deploy` 1.12+, más un bloque de verificación rápida del entorno.
- Sección `Build firmado con Apple Developer` con pasos en Xcode y comando `cordova build ios --release --device --buildFlag=DEVELOPMENT_TEAM=... --buildFlag=PROVISIONING_PROFILE_SPECIFIER=Todo Notebook`. Fastlane queda como opción futura con secretos en GitHub Actions.

## Verificación local

| Check | Resultado |
| --- | --- |
| `npm test -- --testPathPatterns project-config` | 12/12 tests OK (incluye `INIT-04` con `cordova.platforms = ['android', 'ios']`) |
| `npm test` (suite completa) | 23 suites, 147 tests, 0 fallos |
| `npm run build` | Build de producción OK, `Application bundle generation complete` |
| `npx --no-install cordova prepare android` | Exit 0; único aviso: `<splash>` tag deprecado en favor de `AndroidWindowSplashScreenAnimatedIcon` (compatible con el preference ya declarado) |
| `npx --no-install cordova prepare ios` | Exit 0, sin errores |
| `npm run requirements` | Exit 0; cordova-android 15 acepta `android-targetSdkVersion=36` |
| `npm run build:android` | `BUILD SUCCESSFUL in 14s`, `app-debug.apk` (8.431.452 bytes) generado en `platforms/android/app/build/outputs/apk/debug/app-debug.apk` |

## Pendientes

1. **CI en verde (`verify.yml` `android` + `ios`)**: verificado en run [38975613988](https://github.com/PandaDesigner/to-do-pragma-test/actions/runs/38975613988) (`verify`, `Cordova Android (debug)`, `Cordova iOS (no signing)` todos `success` en 2m20s). Artefactos subidos:
   - [`android-debug-apk`](https://api.github.com/repos/PandaDesigner/to-do-pragma-test/actions/artifacts/12078653642/zip) — 5.968.237 bytes, `platforms/android/app/build/outputs/apk/debug/app-debug.apk`.
   - [`ios-unsigned-archive`](https://api.github.com/repos/PandaDesigner/to-do-pragma-test/actions/artifacts/12078802952/zip) — 3.638.095 bytes, `platforms/ios/build/Release-iphoneos/App.xcarchive` + `App.app`.
2. **Firma de iOS con Apple Developer**: el workflow `Cordova iOS (no signing)` produce archive sin firma porque el runner no tiene credenciales. El script `scripts/build-ios-archive.cjs` detecta automáticamente si el keychain tiene identidades (`security find-identity -p codesigning`) y, si las hay, delega a `cordova build ios --release --device` para producir un `.ipa` firmado. Para CI con firma, hay que añadir las identidades al runner (secreto `.p12` + `fastlane match` o un `IMPORT_CERTS_P12_BASE64`). Queda como work-item futuro.
3. **`android-targetSdkVersion=36` en lugar de `35`**: el requisito original pidió 35, pero `cordova-android@15` exige 36+. Documentado arriba.
4. **Aviso de `<splash>` Android deprecado**: cordova-android 15 prefiere `AndroidWindowSplashScreenAnimatedIcon`; el bloque `<splash>` sigue siendo aceptado (warning, no error).

## Estado final de la rama

```
$ git log --oneline feature/app-base-2 (top 5)
91d8b47 docs(readme): align command table column widths
0d8d7e5 feat(ios): wrap iOS archive build to skip export step when no signing identity
432a493 ci(verify): pin cmdline-tools build number and seed www/ before cordova platform add
23b788d docs(openspec): record native Cordova closure in app-base tasks and verify report
00a9c4d docs(readme): fix workspace, keystore and Mac prerequisites for native build
acef478 ci(verify): add android debug APK and unsigned ios archive jobs
e51fac9 feat(package): declare cordova.platforms and add native build scripts
2cf35c4 feat(cordova): close native config for android and ios (config.xml + resources + clean helper)
```