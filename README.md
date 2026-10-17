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
| Generar APK debug Android          | `npm run build:android`                     |
| Generar APK release Android        | `npm run build:android:release`             |
| Generar IPA no firmado iOS         | `npm run build:ios`                         |
| Comprobar requisitos Cordova       | `npm run requirements`                      |
| Restaurar plataformas Cordova      | `npx cordova platform add android` y `ios`  |
| Resetear `cordova.platforms`       | `npm run clean:platforms`                   |

## Arquitectura

Capas: `pages → store → domain ← data`; `core/di` conecta implementaciones. Componentes `shared` solo input/output. SignalStore para el estado. Aliases TypeScript: `@core/*`, `@domain/*`, `@data/*`, `@store/*`, `@pages/*`, `@shared/*`.

Patrones clave:

- **Strategy**: `filterTasks`, `sortTasksByDueDate` y `filterTasksBySection` son funciones puras en `domain/`; el `TaskStore` las compone con los filtros activos.
- **Sections**: `CategorySection` en `general`/`routine`/`event`; las pestañas `Routine` y `Event` filtran por la sección. Las rutas `/tabs/routine` y `/tabs/event` comparten `TasksPage` y pasan la sección mediante `ROUTE_DATA`.
- **State**: cuatro clases (`pending`, `completed`, `overdue`, `archived`) en `data/states/`; la máquina delega en ellas sin tabla de destinos.
- **Decorator**: `@Debounce(ms)` agrupa llamadas por instancia; `@LogAction` registra nombre y argumentos.
- **Repository + port**: `TaskRepository` y `CategoryRepository` viven en `domain/`; los tokens Angular `TASK_REPOSITORY` y `CATEGORY_REPOSITORY` viven en `core/di/`.
- **SignalStore**: `TaskStore` y `CategoryStore` exponen `Signal`, `refresh`, `upsert`, `remove`. `setSection` y `setCategories` sincronizan el filtro por sección.

## Pestañas y secciones

- Rail lateral con cinco pestañas: `Todo`, `Routine`, `Event`, `My`, `More`. Las dos primeras se ven y se desactivan solo cuando el flag `enable_categories` está en `false`.
- En `My` se gestionan las categorías. Cada categoría tiene una `section` (`general` por defecto si no se indica) y un `colorToken` que la UI traduce a un color de la paleta. Las tareas asignadas a una categoría de la sección `routine` o `event` solo aparecen en su pestaña; el resto se ve en `Todo`.
- La creación desde `Routine` o `Event` solo permite categorías de esa sección. Desde `Todo` se ofrece cualquier categoría y la opción `Sin categoría`.

## Cordova

- Identificador de app: `io.github.pandadesigner.todonotebook`.
- Plugin: `cordova-sqlite-storage`.
- Plataformas: `cordova platform add android` e `ios` ejecutadas; `platforms/` está en `.gitignore`.

## Build nativo

### Android (APK firmado + AAB)

`build.json` está fuera del repo (ver `.gitignore`); `build.example.json` contiene los placeholders. Los secretos llegan por variables de entorno, nunca commiteadas:

- `ANDROID_KEYSTORE_PATH` — ruta al `.jks` (por ejemplo `pragmadev-appbase.jks`).
- `ANDROID_KEY_ALIAS` — alias dentro del keystore.
- `ANDROID_KEYSTORE_PASSWORD` — contraseña del keystore.
- `ANDROID_KEY_ALIAS_PASSWORD` — contraseña del alias (en PKCS12 suele coincidir con la del keystore).

Requisitos:

1. Generar `pragmadev-appbase.jks` y exportarlo en `.env.local` siguiendo `KEYSTORE.md`.
2. JDK 17 y `ANDROID_HOME` apuntando a un Android SDK con build-tools 34+.
3. Ejecutar `npm run ionic:build:android`. Equivale a:
   ```bash
   ionic cordova build android --release -- -- \
     --keystore=$ANDROID_KEYSTORE_PATH \
     --alias=$ANDROID_KEY_ALIAS \
     --storePassword=$ANDROID_KEYSTORE_PASSWORD \
     --password=$ANDROID_KEY_ALIAS_PASSWORD
   ```
   El script `scripts/build-android-release.cjs` hace lo mismo leyendo `.env.local`, corre `ng build --configuration production`, el build de Cordova y `./gradlew :app:assembleRelease`.

Artefactos:

- `platforms/android/app/build/outputs/bundle/release/app-release.aab` (App Bundle para Play Store).
- `platforms/android/app/build/outputs/apk/release/app-release.apk` (APK firmado para distribución directa).

Firma verificada con `apksigner verify --verbose`: APK Signature Scheme v2 OK. El AAB se firma vía `:app:bundleRelease` automáticamente.

### iOS (IPA)

`cordova-ios 8` genera el workspace con el nombre fijo `App.xcworkspace` dentro de `platforms/ios/`, no a partir del nombre de la app (`Todo Notebook` solo aparece como `CFBundleDisplayName` en el `Info.plist`). Tras `cordova platform add ios`, ábrelo así:

```bash
open platforms/ios/App.xcworkspace
```

El bundle identifier es `io.github.pandadesigner.todonotebook` (de `config.xml`).

#### Team ID

El Team ID aparece en el campo `OU` del subject del certificado de firma. Para extraerlo del Llavero:

```bash
security find-certificate -c "Apple Development: tu-correo@dominio" -p \
  | openssl x509 -noout -subject
# subject=UID=..., CN=Apple Development: tu-correo@dominio (XXXXXX), OU=TEAM_ID, O=..., C=...
```

Copia el valor de `OU=TEAM_ID` a tu `build.json` local (ignorado por git) bajo `ios.debug.developmentTeam` e `ios.release.developmentTeam`. `build.example.json` contiene los placeholders. No commitees el Team ID real ni el `build.json`.

#### Firma automática y limitación de la cuenta Development

Con `automaticProvisioning: true` y `developmentTeam` fijado en `build.json`, Xcode descarga y renueva los provisioning profiles desde tu cuenta Apple sin pasos manuales. Para que funcione, tu cuenta debe estar dada de alta en el [Apple Developer Program](https://developer.apple.com/programs/) (pago, no la Apple ID personal gratuita), tener al menos un dispositivo registrado y el App ID `io.github.pandadesigner.todonotebook` creado en _Certificates, Identifiers & Profiles_.

Si la cuenta es la Apple ID personal sin pago del Developer Program, Xcode puede emitir el certificado `Apple Development` pero **no** crea provisioning profiles para distribución: `ionic cordova build ios --device --release` termina en `** ARCHIVE FAILED **` con `Your team has no devices from which to generate a provisioning profile` y `Xcode couldn't find any iOS App Development provisioning profiles matching 'io.github.pandadesigner.todonotebook'`. En ese caso, o bien te das de alta en el programa de pago, o bien firmas el `.app` manualmente en Xcode con un perfil Apple Distribution / Ad Hoc generado fuera del flujo automático.

#### Build sin firma (CI o equipos sin Apple Developer)

`npm run build:ios` ejecuta `cordova build ios --release --device` y desactiva la firma con `CODE_SIGNING_ALLOWED=NO`, pensado para runners que solo necesitan validar el binario:

- Resultado: `platforms/ios/build/Release-iphoneos/Todo Notebook.app` o `App.xcarchive`. Subible como artefacto en CI.
- No instalable en un dispositivo sin re-firmar con un provisioning profile válido.

#### Build firmado desde la línea de comandos

Con firma automática y `build.json` local con `developmentTeam` rellenado:

```bash
ionic cordova build ios --device --release
# IPA firmado en platforms/ios/build/Release-iphoneos/Todo Notebook.ipa
# (o .xcarchive para exportar después desde el Organizer)
```

Para Apple Distribution o Ad Hoc con perfil manual, abre `platforms/ios/App.xcworkspace`, desmarca _Automatically manage signing_ en el target `App` y selecciona tu provisioning profile; exporta el `.ipa` desde el Organizer con _Distribute App → App Store Connect / Ad Hoc_. Si necesitas firma automática en CI con un solo comando, añade _Fastlane match_ con `MATCH_PASSWORD`, `MATCH_GIT_BASIC_AUTHORIZATION` y `MATCH_TYPE` como secretos del repositorio; no versionar certificados ni perfiles.

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
