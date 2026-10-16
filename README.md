# Todo Notebook

App de tareas con Ionic 8 + Angular 22 standalone, Cordova (sin Capacitor), `@ngrx/signals` y Firebase Remote Config. Esta rama (`feature/app-base-2`) entrega la app funcional sobre el scaffolding de `init`: dominio, persistencia, stores, UI con virtual scroll y cobertura por capa.

## Requisitos

- Node.js 24.15.0 LTS (usa `nvm use` con el `.nvmrc` incluido).
- npm 11.
- JDK 17 (Temurin), exportado en `JAVA_HOME`; obligatorio para `cordova build android` y para Gradle.
- Android SDK en `ANDROID_HOME` (o `ANDROID_SDK_ROOT`) con `cmdline-tools`, `platform-tools` y `build-tools 36.0.0+`. Acepta las licencias con `yes | sdkmanager --licenses` la primera vez.
- Xcode 15 o superior con las Command Line Tools (`xcode-select --install`) y la licencia aceptada (`sudo xcodebuild -license accept`).
- CocoaPods 1.16+ (`sudo gem install cocoapods --no-document`) e `ios-deploy` 1.12+ (`npm i -g ios-deploy`).
- `cordova-android` y `cordova-ios` ya están como `devDependencies`.

### Verificación rápida del entorno

```bash
node --version                 # v24.15.0
java -version                  # openjdk 17
echo "$ANDROID_HOME"           # apunta a un SDK con build-tools 36
xcodebuild -version            # Xcode 15+
pod --version                  # >= 1.16
npm run requirements           # cordova requirements --verbose (necesita SDK + Xcode)
```

## Comandos

| Acción                             | Comando                                     |
| ---------------------------------- | ------------------------------------------- |
| Instalar dependencias              | `npm ci`                                    |
| Arrancar el servidor de desarrollo | `npm run ionic:serve` (también `npm start`) |
| Ejecutar pruebas                   | `npm test`                                  |
| Ejecutar pruebas con cobertura     | `npm test -- --coverage`                    |
| Revisar el código                  | `npm run lint`                              |
| Comprobar formato                  | `npm run format:check`                      |
| Aplicar formato                    | `npm run format`                            |
| Comprobar tipos                    | `npm run typecheck`                         |
| Generar build de producción        | `npm run build`                             |
| Generar APK + AAB firmados Android | `npm run ionic:build:android`               |
| Generar APK debug Android         | `npm run build:android`                     |
| Generar APK release Android       | `npm run build:android:release`             |
| Generar IPA no firmado iOS        | `npm run build:ios`                         |
| Comprobar requisitos Cordova      | `npm run requirements`                      |
| Restaurar plataformas Cordova     | `npx cordova platform add android` y `ios`  |
| Resetear `cordova.platforms`      | `npm run clean:platforms`                   |

## Arquitectura

Capas: `pages → store → domain ← data`; `core/di` conecta implementaciones. Componentes `shared` solo input/output. SignalStore para el estado. Aliases TypeScript: `@core/*`, `@domain/*`, `@data/*`, `@store/*`, `@pages/*`, `@shared/*`.

Patrones clave:

- **Strategy**: `filterTasks` y `sortTasksByDueDate` son funciones puras en `domain/` que los stores componen.
- **State**: cuatro clases (`pending`, `completed`, `overdue`, `archived`) en `data/states/`; la máquina delega en ellas sin tabla de destinos.
- **Decorator**: `@Debounce(ms)` agrupa llamadas por instancia; `@LogAction` registra nombre y argumentos.
- **Repository + port**: `TaskRepository` y `CategoryRepository` viven en `domain/`; los tokens Angular `TASK_REPOSITORY` y `CATEGORY_REPOSITORY` viven en `core/di/`.
- **SignalStore**: `TaskStore` y `CategoryStore` exponen `Signal`, `refresh`, `upsert`, `remove`.

## Cordova

- Identificador de app: `io.github.pandadesigner.todonotebook`.
- Plugin: `cordova-sqlite-storage`.
- Plataformas: `cordova platform add android` e `ios` ejecutadas; `platforms/` está en `.gitignore`.

## Build nativo

### Android (APK firmado + AAB)

`npm run ionic:build:android` ejecuta `scripts/build-android-release.cjs`, que sustituye las credenciales de `.env.local` en `build.json` (placeholders en git), corre `ng build --configuration production`, `ionic cordova build android --release --device` y `./gradlew :app:assembleRelease`, y restaura `build.json` al final.

Requisitos:

1. Generar `pragmadev-appbase.jks` y `.env.local` siguiendo `KEYSTORE.md`.
2. JDK 17 y `ANDROID_HOME` apuntando a un Android SDK con build-tools 34+.
3. Ejecutar `npm run ionic:build:android`.

Artefactos:

- `platforms/android/app/build/outputs/bundle/release/app-release.aab` (App Bundle para Play Store).
- `platforms/android/app/build/outputs/apk/release/app-release.apk` (APK firmado para distribución directa).

Firma verificada con `apksigner verify --verbose`: APK Signature Scheme v2 OK. El AAB se firma vía `:app:bundleRelease` automáticamente.

### iOS (IPA)

`cordova-ios 8` genera el workspace con el nombre fijo `App.xcworkspace` dentro de `platforms/ios/`, no a partir del nombre de la app (`Todo Notebook` solo aparece como `CFBundleDisplayName` en el `Info.plist`). Tras `cordova platform add ios`, ábrelo así:

```bash
open platforms/ios/App.xcworkspace
```

#### Build sin firma (CI o equipos sin Apple Developer)

`npm run build:ios` ejecuta `cordova build ios --release --device` y desactiva la firma con `CODE_SIGNING_ALLOWED=NO`, pensado para runners que solo necesitan validar el binario:

- Resultado: `platforms/ios/build/Release-iphoneos/Runner.app` o `App.xcarchive`. Subible como artefacto en CI.
- No instalable en un dispositivo sin re-firmar con un provisioning profile válido.

#### Build firmado con Apple Developer

Requisitos:

1. Estar dado de alta en el [Apple Developer Program](https://developer.apple.com/programs/) con un Team ID propio.
2. Crear en Xcode un _Signing Certificate_ (Apple Development / Apple Distribution) y descargar el _Provisioning Profile_ correspondiente al bundle `io.github.pandadesigner.todonotebook` desde [developer.apple.com/account/resources](https://developer.apple.com/account/resources).
3. En Xcode, abrir `platforms/ios/App.xcworkspace`, seleccionar el target `App`, ir a _Signing & Capabilities_ y desmarcar _Automatically manage signing_ para apuntar a tu Team y profile. El proyecto Cordova deja `CODE_SIGN_STYLE = Manual` cuando se pasa un provisioning profile.

Generar el IPA desde Xcode:

1. Seleccionar un destino _Any iOS Device (arm64)_.
2. _Product → Archive_.
3. En el Organizer, _Distribute App → App Store Connect / Ad Hoc / Enterprise_ y seguir el asistente.
4. Xcode produce `Runner.ipa` firmado con el provisioning profile seleccionado, listo para App Store Connect, TestFlight o distribución interna.

Generar el IPA desde la línea de comandos:

```bash
# Firma local sin secretos en git: el perfil y el certificado viven en el llavero del desarrollador
cordova build ios --release --device \
  --buildFlag="DEVELOPMENT_TEAM=ABCDE12345" \
  --buildFlag="PROVISIONING_PROFILE_SPECIFIER=Todo Notebook"
```

El IPA final queda en `platforms/ios/build/Release-iphoneos/Runner.ipa`. Si necesitas firma automática en CI con un solo comando, añade _Fastlane match_ con `MATCH_PASSWORD`, `MATCH_GIT_BASIC_AUTHORIZATION` y `MATCH_TYPE` como secretos del repositorio; no versionar certificados ni perfiles.

## Retos

1. **`cordova platform add` reescribe `package.json`.** Cada vez que se añade una plataforma, el CLI muta `cordova.platforms` en el manifiesto y rompe el spec INIT-04 (`expect(manifest.cordova?.platforms).toEqual(['android', 'ios'])`). Solución: `npm run clean:platforms` antes de commitear; el helper reescribe el array a la baseline declarada en lugar de vaciarlo, documentado en `scripts/clean-cordova-platforms.cjs`.
2. **Build Android necesita credenciales locales sin filtrarse a git.** `build.json` versiona placeholders; `scripts/build-android-release.cjs` los sustituye desde `.env.local` solo en tiempo de ejecución y los restaura al final. La primera versión tenía dos bugs (orden del regex y `process.exit` antes del `finally`) que filtraron la contraseña al manifiesto; corregidos.
3. **TypeScript 6 con alias `paths`.** TS 6 exige que `paths` sean relativos al `tsconfig` (no a `baseUrl`); se retiró `baseUrl` y se declararon tipos Jest/Node explícitamente para evitar contaminar el bundle de la app con `types: []`.
4. **PKCS12 ignora `-keypass`.** keytool avisa pero acepta; `ANDROID_KEY_PASSWORD` debe ser igual a `ANDROID_KEYSTORE_PASSWORD`. Documentado en `KEYSTORE.md`.
5. **Cordova 13 + Node 26 reporta vulnerabilidades heredadas** (`tar`, `@grpc/grpc-js`, etc.) que no afectan al bundle web; queda pendiente un cambio dedicado para actualizarlas.

## Optimizaciones

- **Persistencia con `@Debounce(300)`**: una ráfaga de `save` produce una sola escritura en SQLite. Con el botón debug que genera 5.000 tareas, el `Repository.persist()` no genera 5.000 writes — se mide en las pruebas de `IonicStorageTaskRepository`.
- **Virtual scroll desde 200 tareas**: `cdk-virtual-scroll-viewport` renderiza solo el viewport visible. `shouldVirtualize()` decide por umbral. El debug de 5.000 tareas pasa de `@for` a `cdk-virtual-scroll` automáticamente.
- **OnPush + trackBy en todas las páginas**: evita re-renderizados por referencia y reduce trabajo del change detector. `trackBy: trackById` está en `tasks.page.ts` y `categories.page.ts`.
- **Filtros y orden puros**: `filterTasks` y `sortTasksByDueDate` no mutan la entrada; los stores los componen sin alocar memoria extra.
- **Feature flag con timeout**: `RemoteConfigService.isCategoriesEnabled(port, 3000)` corta a 3 s, devuelve `true` por defecto ante fallo de red o timeout, y nunca aplica una respuesta tardía.

## Calidad y mantenibilidad

- **Cobertura por capa**: `jest.config.cjs` aplica thresholds por path — global 80%, `src/app/domain/` 95%, `src/app/data/` 90%, `src/app/store/` 90%. El workflow `verify` falla el build si no se cumplen.
- **LSP y tipado estricto**: `tsc --noEmit` se ejecuta en CI y en el script `typecheck`. Sin `any` salvo en adaptadores de infraestructura explícitamente comentados.
- **ESLint con `angular-eslint`**: reglas para standalone components, signals y decoradores. El linter pasa en todo el repo.
- **Prettier con configuración del proyecto**: `npm run format` aplica el formato; `format:check` lo verifica. CI falla si hay drift.
- **Tests RED→GREEN documentados en `verify-report.md`**: cada tarea de `tasks.md` deja evidencia de qué falla antes, qué pasa después, y qué覆盖率 queda.
- **Dominio sin Angular ni Cordova**: `src/app/domain/` no importa `@angular/*` ni `cordova-*`. Verificado en revisión de código de cada tarea. Esto permite probar todo el dominio con Jest puro sin `TestBed`.
- **Contrato `Repository<T>` verificado contra dos implementaciones**: la misma suite de 5 pruebas corre contra InMemory y contra Ionic Storage con almacenamiento simulado. Si añades un nuevo repositorio (por ejemplo, REST), basta con implementar `list/save/remove` y la suite te dice si cumple el contrato.

## Auditoría de dependencias

El comando `npm audit` informa avisos heredados de `tar`, `@grpc/grpc-js`, `basic-ftp`, `braces`, `tmp` y `sprintf-js` (ver `openspec/changes/init/verify-report.md`). No afectan al bundle del navegador pero quedan pendientes de un cambio dedicado.

## Estado del cambio OpenSpec

Este repositorio implementa los cambios `init` y `app-base`. La trazabilidad vive en:

- `openspec/changes/init/{tasks.md,verify-report.md}`
- `openspec/changes/app-base/{tasks.md,verify-report.md,design.md,proposal.md,specs/}`
- `.github/pull_request_template.md`
