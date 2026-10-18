# Todo Notebook

App de tareas con Ionic 8 + Angular 22 standalone, Cordova (sin Capacitor), `@ngrx/signals` y Firebase Remote Config. `develop` entrega la demo de la prueba: lista de tareas, categorías, feature flag, persistencia local y builds Android e iOS.

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

## Entrega de la prueba

La fuente funcional es `docs/prueba-tecnica.pdf`.

1. **Versionado.** Repositorio Git. La rama de entrega es `develop`.
2. **Híbrido con Cordova.** Android e iOS. Cómo compilar está en [Build nativo](#build-nativo). En el navegador: `npm ci` y `npm start`.
3. **Firebase Remote Config.** El flag `enable_categories` queda en `true` salvo que el valor remoto sea el booleano `false` o el texto `false`. Un HTTP 404 o un corte a los 3 s también lo dejan en `true`. El shell no muestra el valor del flag. Con el flag en `false`, `Routine` y `Event` siguen visibles y deshabilitadas, y `My` se oculta.
4. **Rendimiento.** Persistencia con `@Debounce(300)` y OnPush. La lista de tareas pagina de a 20 (`PAGE_SIZE` en `src/app/domain/pagination.ts`). Detalle en [Optimizaciones](#optimizaciones).
5. **APK e IPA.** El APK sí va firmado y verificado; su ruta exacta está en [Android](#android-apk-firmado--aab). **No hay IPA firmado**: la cuenta es un Apple ID gratuito sin Apple Developer Program, que no puede emitir un perfil de distribución. Lo que sí existe es un `.xcarchive` de iOS **sin firmar**, que compila pero no se instala en ningún iPhone. Detalle y cómo verlo en un iPhone en [iOS](#ios-ipa-no-firmado-por-decision-de-entrega).

### Respuestas

- **Desafíos.** Cordova reescribe `cordova.platforms` al añadir una plataforma (`npm run clean:platforms` lo devuelve a `android` e `ios`). El release de Android no puede versionar contraseñas: `scripts/build-android-release.cjs` las toma de `.env.local` y restaura `build.json`. Una cuenta Apple ID gratuita no emite provisioning profile, así que el IPA firmado queda bloqueado sin el Developer Program. TypeScript 6 exige `paths` relativos al `tsconfig`.
- **Optimización.** Una ráfaga de guardados escribe una sola vez en SQLite. La lista de tareas muestra una página de 20 filas; el scroll infinito pide la página siguiente y el paginador muestra como máximo 3 números. El flag remoto no deja la UI colgada: corta a 3 s y no aplica una respuesta tardía.
- **Calidad.** Jest con umbrales por capa (global 80 %, dominio 95 %, data y store 90 %), `tsc --noEmit`, ESLint y Prettier. El dominio no importa Angular ni Cordova. Cada escenario de OpenSpec lleva su id en el título del test. La matriz está en `openspec/traceability.md`.

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

- Rail lateral con cinco pestañas: `Todo`, `Routine`, `Event`, `My`, `More`. Con `enable_categories` en `false`, `Routine` y `Event` siguen visibles y deshabilitadas, y `My` se oculta. No hay un aviso con el valor del flag.
- En `My` se gestionan las categorías. Cada categoría tiene una `section` (`general` por defecto si no se indica) y un `colorToken` que la UI traduce a un color de la paleta. Las tareas asignadas a una categoría de la sección `routine` o `event` solo aparecen en su pestaña; el resto se ve en `Todo`.
- La creación desde `Routine` o `Event` solo permite categorías de esa sección. Desde `Todo` se ofrece cualquier categoría y la opción `Sin categoría`.

## Cordova

- Identificador de app: `io.github.pandadesigner.todonotebook`.
- Plugin: `cordova-sqlite-storage` ^7.0.0. Ya está instalado: dependencia en `package.json`, copia en `plugins/cordova-sqlite-storage` y declaración en `config.xml`. No hace falta volver a correr `cordova plugin add` salvo que se borre `plugins/`.
- Plataformas: `cordova platform add android` e `ios`; `platforms/` está en `.gitignore`.

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

- `platforms/android/app/build/outputs/bundle/release/app-release.aab` (App Bundle para Play Store), 5,8 MB.
- `platforms/android/app/build/outputs/apk/release/app-release.apk` (APK firmado para distribución directa), 8.099.963 bytes.

Firma verificada con `apksigner verify --verbose --print-certs` sobre el APK reconstruido el 2026-10-18 desde `develop`:

```
Verifies
Verified using v2 scheme (APK Signature Scheme v2): true
Signer #1 certificate DN: CN=Todo Notebook (app-base), OU=Mobile, O=PragmaDev, L=City, ST=State, C=US
Signer #1 certificate SHA-256 digest: 96d8d72a4f4773f1040e102824b98519425b367f8a9c48a421b23000ca262511
```

SHA-256 del APK: `15216c0468c96863b310472d19879dd39b708abd11ae2b2cef91a753de1d9ef0`

El APK empaqueta el bundle de producción vigente: `assets/www/main-JXVYDPZH.js`, SHA-256 `6d4fe7e0fbfe1521fccc4b50d164cc90bf441dde86dc49ae14d3ec46bcb8af30`, idéntico byte a byte al de `www/`. Comprobado con `unzip -p … | shasum -a 256`. Incluye la paginación de a 20 y el trabajo de `finish-remaining-ui`.

El AAB se firma vía `:app:bundleRelease` automáticamente.

El APK está publicado en el release [v1.0.0](https://github.com/PandaDesigner/to-do-pragma-test/releases/tag/v1.0.0). Descarga directa: [`todo-notebook-v1.0.0.apk`](https://github.com/PandaDesigner/to-do-pragma-test/releases/download/v1.0.0/todo-notebook-v1.0.0.apk), con su [`SHA256SUMS`](https://github.com/PandaDesigner/to-do-pragma-test/releases/download/v1.0.0/SHA256SUMS). El enlace no es a un IPA: **no hay IPA firmado**, y el motivo es la falta de Apple Developer Program, no una entrega pendiente. Ver [iOS](#ios-ipa-no-firmado-por-decision-de-entrega).

### iOS (IPA: no firmado, por decisión de entrega)

`cordova-ios 8` genera el workspace con el nombre fijo `App.xcworkspace` dentro de `platforms/ios/`, no a partir del nombre de la app (`Todo Notebook` solo aparece como `CFBundleDisplayName` en el `Info.plist`). Tras `cordova platform add ios`, ábrelo así:

```bash
open platforms/ios/App.xcworkspace
```

El bundle identifier es `io.github.pandadesigner.todonotebook` (de `config.xml`).

#### Estado real de la entrega iOS

**No se entrega IPA firmado, por decisión tomada y no por un fallo pendiente.** La cuenta de Apple de este proyecto es un Apple ID gratuito, sin inscripción en el [Apple Developer Program](https://developer.apple.com/programs/) (99 USD/año). Sin esa inscripción no existe un perfil de distribución, y por tanto no hay ningún `.ipa` instalable en un iPhone ajeno. Un IPA instalable exige una firma **Ad Hoc** (con los UDID registrados), **App Store / TestFlight** o **Enterprise**, y los tres los emite únicamente el Developer Program.

Lo que sí existe, y sí se entrega como prueba de que el código compila para iOS:

| Artefacto         | Ruta                                                    | Estado verificado                                                         |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| Archivo Xcode     | `platforms/ios/build/Release-iphoneos/App.xcarchive`    | `ARCHIVE SUCCEEDED`, 9,7 MB, contiene el bundle actual `main-JXVYDPZH.js` |
| App iOS dentro    | `App.xcarchive/Products/Applications/Todo Notebook.app` | `codesign`: `code object is not signed at all`                            |
| Bundle identifier | `io.github.pandadesigner.todonotebook`                  | versionCode 1, versionName 1.0.0, min iOS 15.0                            |

Regenerarlo (no necesita cuenta de Apple, corre sin firmar):

```bash
npm run build                                        # bundle web de producción
npx --no-install cordova prepare ios                 # copia el bundle a platforms/ios/www
cd platforms/ios
xcodebuild -workspace App.xcworkspace -scheme App \
  -configuration Release -destination generic/platform=iOS \
  -archivePath build/Release-iphoneos/App.xcarchive archive \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY=
```

> `npm run build:ios` **no** es equivalente en esta máquina: detecta las identidades `Apple Development` del Llavero y delega en `cordova build ios --release --device`, que exige Team ID y perfil de distribución y falla. El comando de arriba es el que realmente produce el `.xcarchive`.

#### Cómo verlo en un iPhone con la cuenta personal

El `.xcarchive` no se instala directamente. Para verlo en un iPhone hay que compilar desde Xcode con la Personal Team, que firma solo para el dispositivo conectado y durante **7 días**:

1. `npm run build && npx cordova prepare ios`, y abre `platforms/ios/App.xcworkspace` (el `.xcworkspace`, no el `.xcodeproj`, por CocoaPods).
2. En Xcode, _Settings → Accounts_ → añade el Apple ID y elige el Team «Pedro Fernandez (Personal Team)». Si Xcode dice que el bundle id está ocupado, cámbialo **solo localmente** y no lo commitees.
3. Conecta el iPhone por cable, desbloquéalo y acepta _Confiar_. Activa después _Ajustes → Privacidad y seguridad → Modo de desarrollador_ (el móvil se reinicia).
4. Elige el iPhone como destino y pulsa Run (⌘R). La primera vez, en el iPhone: _Ajustes → General → VPN y gestión de dispositivos_ → toca tu Apple ID → _Confiar_.
5. A los 7 días el perfil caduca y la app deja de abrir: hay que reinstalarla desde Xcode.

En un **simulador** no hace falta cuenta ninguna y es la vía más fiable para un revisor con Mac:

```bash
npx cordova build ios --emulator --debug
xcrun simctl install booted "platforms/ios/build/Debug-iphonesimulator/Todo Notebook.app"
xcrun simctl launch booted io.github.pandadesigner.todonotebook
```

#### Release publicado

El APK firmado está publicado en [v1.0.0](https://github.com/PandaDesigner/to-do-pragma-test/releases/tag/v1.0.0):

- [`todo-notebook-v1.0.0.apk`](https://github.com/PandaDesigner/to-do-pragma-test/releases/download/v1.0.0/todo-notebook-v1.0.0.apk) — 8.099.963 bytes, SHA-256 `15216c0468c96863b310472d19879dd39b708abd11ae2b2cef91a753de1d9ef0`
- [`SHA256SUMS`](https://github.com/PandaDesigner/to-do-pragma-test/releases/download/v1.0.0/SHA256SUMS) — el mismo hash del APK renombrado

El tag `v1.0.0` apunta al commit de merge del PR #49, que ya está en `develop`. El release publica solo esos dos archivos: no hay fuentes, ni el `.xcarchive`, ni claves ni certificados, ni `firebase-config.json`, ni ningún secreto. El APK local sigue siendo `platforms/android/app/build/outputs/apk/release/app-release.apk`.

**Lo único que no hay es el IPA firmado**, por la razón ya explicada en [iOS](#ios-ipa-no-firmado-por-decision-de-entrega): la cuenta es un Apple ID gratuito sin Apple Developer Program, así que no existe perfil de distribución. El `.xcarchive` sin firmar sigue disponible en el repositorio, en `platforms/ios/build/Release-iphoneos/App.xcarchive`, y no se publica como artefacto de instalación.

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
- **Lista de tareas en páginas de 20**: `visibleTasks` es la página actual. El pozo `.task-scroll` (máximo 60vh) incluye un scroll infinito que avanza una página. Si hay más de una página, el paginador muestra anterior, como máximo 3 números y siguiente. La lista de tareas no usa `cdk-virtual-scroll-viewport`. El debug de 5.000 tareas sigue disponible en desarrollo y no cambia ese modo de lista.
- **OnPush + trackBy en todas las páginas**: evita re-renderizados por referencia y reduce trabajo del change detector. `trackBy: trackById` está en `tasks.page.ts` y `categories.page.ts`.
- **Filtros y orden puros**: `filterTasks` y `sortTasksByDueDate` no mutan la entrada; los stores los componen sin alocar memoria extra.
- **Feature flag con timeout**: `RemoteConfigService.isCategoriesEnabled(port, 3000)` corta a 3 s, devuelve `true` por defecto ante fallo de red o timeout, y nunca aplica una respuesta tardía.

## Calidad y mantenibilidad

- **Cobertura por capa**: `jest.config.cjs` aplica thresholds por path — global 80%, `src/app/domain/` 95%, `src/app/data/` 90%, `src/app/store/` 90%. El workflow `verify` falla el build si no se cumplen.
- **LSP y tipado estricto**: `tsc --noEmit` se ejecuta en CI y en el script `typecheck`. Sin `any` salvo en adaptadores de infraestructura explícitamente comentados.
- **ESLint con `angular-eslint`**: reglas para standalone components, signals y decoradores. El linter pasa en todo el repo.
- **Prettier con configuración del proyecto**: `npm run format` aplica el formato; `format:check` lo verifica. CI falla si hay drift.
- **Tests RED→GREEN documentados en `verify-report.md`**: cada tarea de `tasks.md` deja evidencia de qué falla antes, qué pasa después y qué cobertura queda.
- **Dominio sin Angular ni Cordova**: `src/app/domain/` no importa `@angular/*` ni `cordova-*`. Verificado en revisión de código de cada tarea. Esto permite probar todo el dominio con Jest puro sin `TestBed`.
- **Contrato `Repository<T>` verificado contra dos implementaciones**: la misma suite de 5 pruebas corre contra InMemory y contra Ionic Storage con almacenamiento simulado. Si añades un nuevo repositorio (por ejemplo, REST), basta con implementar `list/save/remove` y la suite te dice si cumple el contrato.

## Auditoría de dependencias

El comando `npm audit` informa avisos heredados de `tar`, `@grpc/grpc-js`, `basic-ftp`, `braces`, `tmp` y `sprintf-js` (ver `openspec/changes/init/verify-report.md`). No afectan al bundle del navegador pero quedan pendientes de un cambio dedicado.

## Firebase y Remote Config

El proyecto de Firebase es `to-do-pragma`. Remote Config se lee una vez al arrancar. En producción el intervalo mínimo es `remoteConfigFetchIntervalMs` (60 000 ms). `ng serve` usa el entorno de desarrollo y muestra las acciones de debug. La build `--configuration production` las deja apagadas salvo que el valor remoto sea el booleano `true`.

| Parámetro            | Tipo    | Valor por defecto |
| -------------------- | ------- | ----------------- |
| enable_debug_actions | BOOLEAN | false             |
| enable_categories    | BOOLEAN | true              |

La app busca `src/assets/firebase-config.json`. Ese archivo está en `.gitignore`. Para una máquina local:

```bash
cp src/assets/firebase-config.example.json src/assets/firebase-config.json
```

Completá los campos públicos desde la consola de Firebase. No commitees el JSON. Un release sin ese archivo puede generarlo si existen `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID` y `FIREBASE_MESSAGING_SENDER_ID`. `FIREBASE_AUTH_DOMAIN` y `FIREBASE_STORAGE_BUCKET` son opcionales. En CI esos secretos también son opcionales: sin el archivo, la verificación sigue y Remote Config usa los valores por defecto (`enable_categories` queda en true).

Para la demo, abrí https://console.firebase.google.com/project/to-do-pragma/config, cambiá el parámetro, pulsá Publicar cambios, esperá `remoteConfigFetchIntervalMs` y reiniciá la app.

## Estado OpenSpec

Changes activos: `tasks-date-filter`. Convierte el badge HOY en un grupo de filtro por fecha: el botón rápido HOY, que ahora fija el día actual, más un icono de calendario al lado que abre un calendario de rango (desde/hasta) para filtrar las tareas por fecha. El rango vive en `TaskStore` como `setDateRange`, con el mismo patrón que `setCategory` y `setSection`, y reinicia la paginación a la página 1. El badge HOY deja de ocupar el ancho disponible del grupo. El change cierra además dos deudas reportadas: el título del día, que salía como `18.Sun` fijo en inglés y ahora se formatea con `Intl` en el idioma activo, y el texto del rail lateral, que se perdía en modo oscuro y ahora usa un token de tinta de pestaña propio.

Anteriormente: ninguno. `fix-chevron-icon-binding` quedó fusionado en `develop` el 2026-10-18 tras el PR #54: entrega el chevron del badge HOY como SVG importado de `ionicons/icons` en vez de por el atributo `name`, que no resolvía el icono y lo dejaba sin dibujar. `fix-ui-fidelity` quedó archivado el 2026-10-18 tras el PR #51: el empty state de Categories recupera la ilustración y el CTA, las acciones del sheet de categorías ponen el botón primario antes que el de cancelar y el chevron del badge HOY pasa a ser un `ion-icon` importado de `ionicons/icons` en lugar de un carácter dentro del texto traducible. `fix-app-09-spec-align` quedó archivado el 2026-10-18 en el PR #48: corrigió la spec `app-base` para que APP-09 describa la paginación real de `tasks` y el virtual scroll que vive en `categories`. `finish-remaining-ui` quedó archivado el 2026-10-18 en el PR #45, junto a `firebase-env-production`, `fix-delivery-functional` y `regularize-direct-commits`. Los cerrados están en `openspec/changes/archive/` (`init`, `app-base`, `theme-foundation`, `theme-aliases`, `i18n`, `todo-screen`, `tasks-crud`, `fix-tasks-fab-pager-layout`, `category-sheet`, `fix-delivery-functional`, `firebase-env-production`, `regularize-direct-commits`, `finish-remaining-ui`, `fix-app-09-spec-align`, `fix-ui-fidelity`). Las specs vigentes están en `openspec/specs/`. La matriz de escenarios está en `openspec/traceability.md`.

Las filas `registro` de F6 siguen abiertas a propósito: anotan nodos de Figma que todavía no tienen escenario. La evidencia visual del sheet de categorías y del pager quedó ausente porque esa máquina no tenía simulador firmado.
