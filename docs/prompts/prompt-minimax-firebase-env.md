# Prompt: Firebase, entornos y build entregable · Todo Notebook

> Para MiniMax en el harness pi (es un solo agente: primero diseño y después implementación). Copia desde `<role>` hasta el final.
> Lo redactó jarvis el 18-oct-2026 a las 04:30 (UTC-5, Bogotá), con el código real de `develop` = **`36f3fd0`** (merge del PR #38).
> Este prompt **complementa** `/workspace/prueba/prompt-minimax-entrega-prueba.md` (fases 1 y 2, P-xx). No repite sus tareas, solo las cita.

---

<role>
Eres un **ingeniero senior de Ionic/Angular y DevOps de builds móviles**. Trabajas con **SDD (OpenSpec 1.3.1) y TDD estricto** en el repo `PandaDesigner/to-do-pragma-test` (Todo Notebook, prueba técnica de Pragma). Conoces Firebase Remote Config en el SDK web modular, los `fileReplacements` de Angular, Cordova 13 y GitHub Actions.
Escribes el mínimo código de producción, siempre con el test primero, y mantienes la trazabilidad completa: requisito → escenario → test → evidencia → Notion.
No improvisas el alcance, no adivinas datos y te detienes en cada PARADA. Respondes y documentas en **español**. El código, los nombres de archivo y los commits siguen las convenciones del repo (Conventional Commits).
</role>

<context>

### Producto y meta
- La app es "Todo Notebook": Ionic 8.8, Angular 22 standalone con signals, `@ngrx/signals`, Cordova 13 (Android ^15.1, iOS ^8.1.1, sin Capacitor), Jest 30 con `jest-preset-angular`, OpenSpec 1.3.1 y `firebase` **13.0.0** (`@firebase/remote-config` **0.9.3** en el lockfile).
- La prueba pide (PDF, p. 2-3): configurar Firebase desde una cuenta personal (R-12); un feature flag con Remote Config que active o desactive una funcionalidad (R-13) y una demo de ese flag (R-14); compilar para ambas plataformas con Cordova (R-10); y un APK e IPA "con la aplicación demo configurada" (R-18, R-19).
- Firebase ya está listo y **no se toca**: el proyecto es `to-do-pragma` y tiene una sola app web, `appId 1:545919746457:web:0af198b8d3cd2f88ef1308`. La plantilla de Remote Config **v1** ya está publicada con:

  | Parámetro | Tipo | Valor por defecto | Efecto en la app |
  |---|---|---|---|
  | `enable_debug_actions` | BOOLEAN | `false` | En `true` aparecen "Generar 5.000" y "Borrar todo" en Ajustes |
  | `enable_categories` | BOOLEAN | `true` | En `false` se ocultan las categorías y el guard bloquea su ruta |

### Lo que hay hoy en el código (verificado en `36f3fd0`)
- `src/app/core/config/remote-config.ts:2` importa `../../../environments/environment` (commit `4805d67`, entró directo a `develop`). `resolveDebugActions()` (`:9-14`) devuelve **`true` siempre que `environment.production` sea `false`**, sin importar lo que diga Remote Config.
- `.gitignore:22-23` ignora `src/environments/environment.ts` **y** `src/environments/environment.prod.ts`. En el repo solo está `src/environments/environment.example.ts`, con `{ production: false }`. `environment.prod.ts` no existe.
- El PR #38 (`49fba59`, `8f89c74`) dejó el CI en verde ([run 39114427597](https://github.com/PandaDesigner/to-do-pragma-test/actions/runs/39114427597)). Lo hizo con `scripts/ensure-environment.cjs`, que copia el ejemplo cuando falta el archivo, y con los hooks `pretest`, `prebuild` y `pretypecheck` de `package.json`. **Consecuencia:** en un clon nuevo, en el CI y en el APK que compile cualquiera que no sea Pedro, la build `--configuration production` sale con `production: false`, y los botones de debug **siempre** se ven. El rojo del [run 39112674154](https://github.com/PandaDesigner/to-do-pragma-test/actions/runs/39112674154) se tapó, pero la causa (NUEVA-01) sigue ahí.
- `angular.json`: la configuración `production` (que es la `defaultConfiguration`) solo tiene `budgets` y `outputHashing`, sin `fileReplacements`. También existen `development` y `ci`. Los targets son solo `build`, `serve`, `extract-i18n` y `lint`: **no hay `ionic-cordova-build`**.
- `src/project-config.spec.ts:17` tiene el test `builds without ignored private environment files`, que exige que `angular.json` **no** contenga `src/environments/environment`. Ese test choca con los `fileReplacements`. Lo reescribes en el RED de T1 y lo justificas en `design.md`. `:72` exige que exista `environment.example.ts`.
- `src/app/core/config/remote-config.spec.ts:2,8-15,69` muta `environment.production` en el test.
- `src/app/core/config/firebase-remote-config-port.ts`:
  - `:17` define `FETCH_INTERVAL = { DEVELOPMENT: 60_000, PRODUCTION: 3_600_000 }`.
  - `:79-84` arma `settings = { fetchTimeoutMillis: REMOTE_CONFIG_TIMEOUT_MS (3000), minimumFetchIntervalMillis: isDevMode() ? … }`. Ojo: el modo sale de **`isDevMode()`** y no de `environment`, así que hay dos fuentes de verdad.
  - `:75-78` pone `defaultConfig { enable_categories: true, enable_debug_actions: false }`.
  - `:85` hace un solo `fetchAndActivate`, y `:87-90` aplica la regla "solo un valor remoto explícito".
  - La config web se lee en tiempo de ejecución desde `assets/firebase-config.json` (`:10`, `:30-52`). Un 404 hace que se usen los valores por defecto, sin error visible (`remote-config.ts:22-25,64-74`, test `[RC-04]`).
- `firebase-remote-config-port.spec.ts:105-108` exige `minimumFetchIntervalMillis: 60000`, que es el valor de dev en Jest.
- `firebase/remote-config` 0.9.3 **sí exporta `onConfigUpdate(remoteConfig, observer): Unsubscribe`** (`dist/remote-config-public.d.ts:316`). Necesita la API "Firebase Remote Config Realtime" habilitada en el proyecto. Comprueba si lo está y no la habilites tú.
- `package.json` (versión `0.0.1`):
  - `build:android` = `ng build && cordova build android --debug`
  - `build:android:release` = `ng build --configuration production && ionic cordova build android --release …`
  - `ionic:build` → `scripts/ionic-build.cjs`, que hace `npx ng build --configuration production`
  - `ionic:build:android` → `scripts/build-android-release.cjs`, que hace `npx ng build --configuration production`, luego `ionic cordova build android --release --device`, luego `gradlew :app:assembleRelease`, y lee la firma de `.env.local`
  - `build:ios` → `scripts/build-ios-archive.cjs`, que **no** compila la web
  - Los `npx ng build` de los scripts **no** disparan `prebuild`.
- `.github/workflows/verify.yml`:
  - job `verify`: `npm ci`, `npm test -- --coverage`, `lint`, `lint:styles`, `format:check`, `typecheck`, `trace:check` y `npm run build -- --configuration production`
  - jobs `android` e `ios`: `npm run build`, luego `cordova platform add`, luego `build:android` o `build:ios`
  - No hay secretos de Firebase, y los artefactos salen sin `firebase-config.json`.
- `.gitignore` ignora `.env`, `.env.*` (menos `.env.example`), `src/assets/firebase-config.json` y `*.keystore`. Existe `src/assets/firebase-config.example.json`, con placeholders.
- `.nvmrc` = `24.15.0`. Usa siempre `source ~/.nvm/nvm.sh && nvm use 24`, porque el zsh normal de Pedro da Node 22.
- OpenSpec:
  - Changes activos: `fix-delivery-functional` (8/8 tareas `[x]`, con `verify-report.md`, sin archivar) y `finish-remaining-ui` (tareas 2.4, 2.5, 2.6 y 3.1 abiertas).
  - `fix-delivery-functional/specs/todo-screen/spec.md:22` define `TODO-09 Cada pestaña conserva su sección`, que **choca** con `openspec/specs/todo-screen/spec.md:142` `TODO-09 Alta con categoría de la sección`.
  - `finish-remaining-ui/proposal.md` (Known limit) avisa que `TODO-10.1` choca y que hay que renombrarlo a `SWIPE-01.1`.
  - El test `tasks.page.spec.ts:289` se titula `[TODO-09.1] keeps a cached tab…`.
  - Formato de spec del repo: `## ADDED Requirements` → `### Requirement: <ID> <título>` → `#### Scenario: [<ID>.<n>] …` con **GIVEN/WHEN/THEN**. Las reglas están en `openspec/config.yaml` (gana `AGENTS.md`).
- 18 commits directos a `develop` sin PR, sin change y sin CI verde en su momento (NUEVA-02), de `c2fca8d` a `cffd11e`:
  - editores como sheet, primero a altura completa, luego al 80 % y al final al 90 % (`c2fca8d`, `b651cee`, `82635c4`, `aa4d3b7`)
  - `ion-infinite-scroll` y la página de 20 (`72050b0`, `8c3cb1d`, `6a38dab`)
  - debug en desarrollo (`4805d67`)
  - el pozo de scroll al 60vw y luego bajo los filtros (`39041d1`, `7d14419`)
  - el paginador fijo bajo el FAB y en una fila (`b69fa1f`, `db783ea`, `2c1e409`)
  - filas de una línea, sin borrar inline, con acciones al final, el tachado y el desborde con tres letras (`323b8cf`, `8bedb02`, `af90c4e`, `42ff551`, `cffd11e`)
- `README.md` (201 líneas):
  - `95a930a` ya corrigió el "virtual scroll" de la lista (`:178`) y el aviso de `enable_categories` (`:53`, `:78`).
  - **Sigue mal** `:199`, que dice "No hay changes activos" cuando hay dos.
  - `src/assets/i18n/es.json:11` y `en.json:11` (`debugHint`) dicen "virtual scroll", y eso es falso.
  - No hay ninguna sección de Firebase.

### Fuentes que lees antes de empezar (si contradicen este prompt, gana la fuente y lo reportas)
| Fuente | Para qué |
|---|---|
| `AGENTS.md`, `openspec/config.yaml`, `docs/workflow-mcp.md` | Reglas del repo, convención SDD y flujo Notion |
| `/workspace/prueba/trazabilidad-evidencias.md` | Las brechas NUEVA-01 y NUEVA-02 (§3, puntos 1-2), las filas R-10 a R-14 y R-21, y los textos obsoletos del README |
| `/workspace/prueba/prompt-minimax-entrega-prueba.md` | Las tareas F1/F2 que ya existen. **No las dupliques**: T5 cubre solo la parte de Firebase de `F2-P28-E2` y los textos de `F2-P28-E5` que se listan abajo. El resto de F2-T2 sigue en ese prompt |
| `src/app/core/config/*`, `src/environments/*`, `angular.json`, `package.json`, `scripts/*`, `.github/workflows/verify.yml`, `.gitignore`, `README.md`, `openspec/` | Código real |
</context>

<objective>
Que `develop` quede **entregable para la prueba** en lo que toca a Firebase y al build:
1. Una build `--configuration production` sale **siempre** con `production: true`, en el Mac de Pedro, en un clon nuevo y en el CI, sin copiar ejemplos.
2. Los flags de Remote Config cambian en la app tras reiniciarla, en menos de un minuto desde que se publica el cambio en la consola. La demo R-14 se puede grabar.
3. Las builds de release fallan con un mensaje claro si falta `firebase-config.json` (o lo generan desde variables `FIREBASE_*`). Las builds de verificación y la app siguen funcionando sin ese archivo (P-07).
4. Los 18 commits directos quedan regularizados en OpenSpec y no hay IDs de requisito duplicados.
5. El README explica Firebase y Remote Config y no tiene textos falsos.

Hay dos changes OpenSpec, cada uno con su rama. Ninguno se commitea, se pushea ni abre PR sin que Pedro lo pida:

| Orden | Change | Rama local sugerida | Tareas | Brechas |
|---|---|---|---|---|
| A | `firebase-env-production` | `fix/firebase-env-production` | T1, T2, T3, T5 | NUEVA-01, R-10, R-12, R-13, R-14, R-18, R-11 y E-01 (parte de Firebase) |
| B | `regularize-direct-commits` | `chore/regularize-direct-commits` | T4 | NUEVA-02, R-16, R-27 |

Va primero A (WIP=1). Si en la PARADA 1 Pedro pide otro orden u otra forma de partir el trabajo, sigues su decisión.
</objective>

<tasks>

Reglas comunes:
- Cada escenario Gherkin corresponde 1:1 con un test RED. El título del test empieza por `[<ID-escenario>]`, y el mismo ID va en la spec (`#### Scenario: [<ID>] …`) y en `tasks.md`.
- Los tests viven en `src/**/*.spec.ts`, porque `jest.config.js` solo busca ahí. Los scripts `.cjs` se prueban con `require()` sobre funciones exportadas o con `spawnSync(process.execPath, [script])` en un directorio temporal (`os.tmpdir()`). Nunca usan el `src/assets/firebase-config.json` real.
- Ningún test ni log imprime valores de configuración reales.
- Ninguna tarea toca estilos. Si alguna lo necesitara, solo se permiten `var(--ion-*)` y `var(--app-*)` con Sass `@use`, igual que en Figma. Si ves que hace falta, detente y pregunta.

---

### T1 · NUEVA-01 (Crítico, M) · Entornos versionados sin secretos y `fileReplacements` de producción
- **Refs:** NUEVA-01 · R-10, R-13, R-25 · `remote-config.ts:2,9-14` · `.gitignore:22-23` · `angular.json` (`configurations.production`) · `scripts/ensure-environment.cjs` · `package.json` (`pre*`, `build:*`) · `project-config.spec.ts:17,72` · runs 39112674154 (rojo) y 39114427597 (verde con `production: false`).
- **Cambio esperado:**
  - Versionar `src/environments/environment.ts` (`production: false`) y `src/environments/environment.prod.ts` (`production: true`), sin secretos. Solo llevan `production` y el valor de T2 (`remoteConfigFetchIntervalMs`), ambos con la misma forma (un tipo `AppEnvironment` exportado).
  - Quitar las dos líneas del `.gitignore`.
  - Añadir `fileReplacements` (`environment.ts` → `environment.prod.ts`) **solo** en `production`.
  - Retirar `ensure-environment.cjs`, `environment.example.ts` y los hooks `pretest`, `prebuild` y `pretypecheck`. Si decides conservar algo, lo justificas en `design.md`.
  - Hacer explícito `--configuration production` en todos los scripts de release (`build:android:release`, `ionic:build`, `ionic:build:android`). Para la web de `build:ios` y del debug Android, decide en el diseño si van con `production` o con `development` y explícalo.
  - `firebase-config.json` **sigue** ignorado.

```gherkin
# language: es
Característica: Entornos de build versionados y producción real (NUEVA-01)

  Escenario: [ENV-01.1] La build de producción reemplaza el entorno
    Dado el archivo angular.json del proyecto
    Cuando leo build.configurations.production.fileReplacements
    Entonces contiene el reemplazo de "src/environments/environment.ts" por "src/environments/environment.prod.ts"

  Escenario: [ENV-01.2] La build de desarrollo no reemplaza el entorno
    Dado el archivo angular.json del proyecto
    Cuando leo build.configurations.development
    Entonces no declara fileReplacements

  Escenario: [ENV-01.3] Los entornos están versionados y solo tienen valores públicos
    Dado los archivos environment.ts y environment.prod.ts
    Cuando reviso .gitignore y el contenido de ambos archivos
    Entonces ninguno de los dos está ignorado
    Y environment.ts declara production false y environment.prod.ts declara production true
    Y ninguno contiene "apiKey", "AIza", "appId", "password" ni "secret"

  Escenario: [ENV-01.4] Los archivos con secretos siguen fuera de git
    Dado el archivo .gitignore
    Cuando lo leo
    Entonces ignora "src/assets/firebase-config.json", ".env.local" (vía ".env.*") y "*.keystore"

  Escenario: [ENV-01.5] Los scripts de release compilan la web en modo producción
    Dado package.json y los scripts build-android-release.cjs e ionic-build.cjs
    Cuando leo los comandos de "build:android:release", "ionic:build" e "ionic:build:android"
    Entonces cada uno ejecuta "ng build --configuration production" antes de Cordova

  Escenario: [ENV-01.6] El modo sale de una sola fuente de verdad
    Dado el código de src/app/core/config
    Cuando busco cómo se decide el modo producción
    Entonces se usa "environment.production" y no "isDevMode()"

  Escenario: [ENV-01.7] El CI compila producción sin copiar ejemplos
    Dado .github/workflows/verify.yml y package.json
    Cuando leo el job "verify" y los scripts "pretest", "prebuild" y "pretypecheck"
    Entonces el job ejecuta "npm run build -- --configuration production"
    Y ningún script copia "environment.example.ts" sobre "environment.ts"
```

| Escenario | Test RED (archivo › nombre) |
|---|---|
| ENV-01.1 | `src/project-config.spec.ts` › `[ENV-01.1] production replaces environment.ts with environment.prod.ts` (sustituye a `builds without ignored private environment files`) |
| ENV-01.2 | `src/project-config.spec.ts` › `[ENV-01.2] development keeps environment.ts without fileReplacements` |
| ENV-01.3 | `src/environments/environment.spec.ts` › `[ENV-01.3] environment files are tracked, typed and credential-free` (sustituye a `provides a credential-free environment example`) |
| ENV-01.4 | `src/project-config.spec.ts` › `[ENV-01.4] gitignore keeps firebase-config, env files and keystores out of git` |
| ENV-01.5 | `src/build-scripts.spec.ts` › `[ENV-01.5] release scripts build the web bundle with --configuration production` |
| ENV-01.6 | `src/app/core/config/firebase-remote-config-port.spec.ts` › `[ENV-01.6] reads the build mode from environment, not isDevMode` |
| ENV-01.7 | `src/project-config.spec.ts` › `[ENV-01.7] CI builds production without copying an environment example` |

Para `ENV-01.6`, mockea `../../../environments/environment` con `jest.mock` y comprueba que, con `production: true`, el intervalo es el de producción **aunque `isDevMode()` devuelva `true`** en Jest. Cambia también `remote-config.spec.ts` para que use ese mock en lugar de mutar el objeto, si el diseño lo permite.

---

### T2 · Remote Config para la demo (Alto, S) · Intervalo configurable y corto
- **Refs:** R-13, R-14 · `firebase-remote-config-port.ts:17,79-85` · `firebase-remote-config-port.spec.ts:105-108` · `remote-config.ts` (timeout de 3 s, `[RC-01]` una sola consulta, P-06 ya hecha en el PR #37).
- **Cambio esperado:**
  - Añadir `remoteConfigFetchIntervalMs` a `AppEnvironment` y usarlo como `minimumFetchIntervalMillis`. Se elimina `FETCH_INTERVAL`.
  - **Propuesta para la PARADA 1:** producción `60_000` (60 s) y desarrollo `0`.
  - **Justificación de los 60 s:**
    - La app hace **una** sola llamada a `fetchAndActivate` por arranque (P-06), así que aun con `0` el volumen sería de un fetch por apertura.
    - Firebase recomienda no bajar de lo necesario en producción y **limita (throttling) a los clientes que piden demasiado**. Si eso pasa, el SDK lanza un error de throttling y la app se queda con los últimos valores activados.
    - 60 s cumple la demo: publicas, esperas 1 minuto, cierras la app, la abres y se ve el cambio. No arriesga cuota.
    - Usar `0` en producción solo se justifica para un build exclusivo de la demo. Lo decide Pedro.
  - Se mantienen el timeout de 3 s con los valores por defecto, `defaultConfig` (`enable_debug_actions: false`, `enable_categories: true`), la regla "solo un valor remoto explícito" y la **única** llamada a `fetchAndActivate` en el arranque.
  - **Opcional (solo si Pedro lo aprueba en la PARADA 1):** `onConfigUpdate`, que existe en 0.9.3. Al recibir una actualización con las claves de los flags, llama a `activate` y actualiza las signals sin reiniciar. Si el listener falla, se queda con los valores del arranque y no muestra error. Antes, verifica en la documentación oficial (Context7 o la web) que el SDK web 13 lo soporta en un WebView de Cordova y que necesita la API Realtime. Si no lo puedes confirmar, lo descartas y lo dejas escrito en `design.md`.

```gherkin
# language: es
Característica: Remote Config con intervalo corto para la demo (R-13, R-14)

  Escenario: [RC-06.1] El intervalo mínimo sale del entorno
    Dado un entorno con remoteConfigFetchIntervalMs igual a 60000
    Cuando el port consulta Remote Config
    Entonces settings.minimumFetchIntervalMillis es 60000

  Escenario: [RC-06.2] Producción usa un intervalo corto y acotado
    Dado el archivo environment.prod.ts
    Cuando leo remoteConfigFetchIntervalMs
    Entonces es un entero entre 0 y 60000 ms

  Escenario: [RC-06.3] El timeout y los valores por defecto no cambian
    Dado el port de Remote Config con el nuevo intervalo
    Cuando consulta Remote Config
    Entonces settings.fetchTimeoutMillis es 3000
    Y defaultConfig es enable_categories true y enable_debug_actions false

  Escenario: [RC-06.4] Un valor publicado nuevo se aplica al reiniciar la app
    Dado un primer arranque en producción en el que Remote Config devuelve enable_debug_actions false
    Y se publica enable_debug_actions true
    Cuando la app arranca otra vez con el intervalo vencido
    Entonces debugActionsEnabled es true

  Escenario: [RC-06.5] Una sola activación por arranque
    Dado el servicio de Remote Config
    Cuando se inicializa la app
    Entonces fetchAndActivate se llama exactamente una vez

  # Solo si Pedro aprueba onConfigUpdate en la PARADA 1
  Escenario: [RC-07.1] Un cambio en tiempo real actualiza los flags sin reiniciar
    Dado la app arrancada con enable_categories true
    Cuando onConfigUpdate notifica una actualización que incluye "enable_categories" y el valor activado es false
    Entonces categoriesEnabled pasa a false sin otra llamada a fetchAndActivate

  Escenario: [RC-07.2] Un fallo del listener en tiempo real no rompe la app
    Dado la app arrancada con los valores del primer fetch
    Cuando onConfigUpdate informa un error
    Entonces los flags conservan sus valores y error sigue en null
```

| Escenario | Test RED (archivo › nombre) |
|---|---|
| RC-06.1 | `src/app/core/config/firebase-remote-config-port.spec.ts` › `[RC-06.1] uses environment.remoteConfigFetchIntervalMs as minimumFetchIntervalMillis` (reemplaza el `60000` fijo de `:105-108`) |
| RC-06.2 | `src/environments/environment.spec.ts` › `[RC-06.2] production fetch interval is an integer between 0 and 60000 ms` |
| RC-06.3 | `src/app/core/config/firebase-remote-config-port.spec.ts` › `[RC-06.3] keeps the 3000 ms timeout and safe defaults` |
| RC-06.4 | `src/app/core/config/remote-config.spec.ts` › `[RC-06.4] applies a newly published value on the next production start` |
| RC-06.5 | `src/app/core/config/firebase-remote-config-port.spec.ts` › `[RC-06.5] calls fetchAndActivate exactly once per fetch` |
| RC-07.1 (opc.) | `src/app/core/config/remote-config.spec.ts` › `[RC-07.1] real-time update toggles categories without refetching` |
| RC-07.2 (opc.) | `src/app/core/config/remote-config.spec.ts` › `[RC-07.2] real-time listener errors keep current flags` |

> Para RC-06.5: si `[RC-01]` ya cubre la parte de `port.fetch`, el test nuevo cubre el port (el SDK). Si pasa en verde a la primera, aplica la **Nota TDD** del prompt de entrega (F1-T10): lo registras como "verificación sin RED posible" y demuestras que el test detecta el fallo rompiendo la implementación en local.

---

### T3 · Builds reproducibles con Firebase (Alto, S) · `scripts/ensure-firebase-config.cjs`
- **Refs:** R-12, R-18 · P-07 (`[RC-04]`, el arranque sin config) · `.gitignore:24` · `src/assets/firebase-config.example.json` · `build-android-release.cjs` · `build-ios-archive.cjs` · `verify.yml`.
- **Cambio esperado:** un script con una función pura exportada, `ensureFirebaseConfig({ root, env, require, log })`, y una CLI:
  - Si `src/assets/firebase-config.json` existe, **no lo toca**.
  - Si no existe y están **todas** las variables `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN` (opcional), `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET` (opcional), `FIREBASE_MESSAGING_SENDER_ID` y `FIREBASE_APP_ID`, genera el JSON. Las obligatorias son las mismas que `REQUIRED_CONFIG_FIELDS`.
  - Si no existe y no hay variables:
    - con `--require` (release): sale con código 1 y un mensaje en español que nombra la ruta, el `cp` desde el `.example` y las variables;
    - sin `--require` (verify, CI y debug): avisa y sale con 0, porque la app arranca con los valores por defecto (P-07).
  - Si las variables están incompletas, falla y nombra **solo las claves** que faltan.
  - **Nunca** imprime valores.
- Se engancha con `--require` en `build-android-release.cjs`, en `build:android:release` y en la build web de iOS de release. Sin `--require` va en el CI.
- En el README (T5) se documenta la opción de secretos de CI (`FIREBASE_*` como *repository secrets* y un paso `env:` en el job). **No es obligatoria y no la configuras en GitHub.**

```gherkin
# language: es
Característica: Config de Firebase garantizada en builds de release (R-12, R-18, P-07)

  Escenario: [FBCFG-01.1] La build de release falla sin la config
    Dado un proyecto sin src/assets/firebase-config.json y sin variables FIREBASE_*
    Cuando ejecuto ensure-firebase-config con --require
    Entonces termina con código 1
    Y el mensaje nombra "src/assets/firebase-config.json", "firebase-config.example.json" y las variables FIREBASE_*

  Escenario: [FBCFG-01.2] La config se genera desde variables de entorno
    Dado un proyecto sin firebase-config.json
    Y las variables FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_APP_ID y FIREBASE_MESSAGING_SENDER_ID definidas con valores de prueba
    Cuando ejecuto ensure-firebase-config con --require
    Entonces se crea firebase-config.json con apiKey, projectId, appId y messagingSenderId
    Y termina con código 0

  Escenario: [FBCFG-01.3] Una config existente no se sobrescribe
    Dado un firebase-config.json existente con contenido conocido
    Y variables FIREBASE_* con otros valores
    Cuando ejecuto ensure-firebase-config
    Entonces el archivo conserva su contenido original

  Escenario: [FBCFG-01.4] Las builds de verificación siguen sin config
    Dado un proyecto sin firebase-config.json y sin variables FIREBASE_*
    Cuando ejecuto ensure-firebase-config sin --require
    Entonces termina con código 0
    Y avisa que la app usará los valores por defecto de Remote Config

  Escenario: [FBCFG-01.5] Ningún valor de configuración aparece en la salida
    Dado variables FIREBASE_* con valores centinela
    Cuando ejecuto ensure-firebase-config en cualquier modo
    Entonces ni stdout ni stderr contienen los valores centinela

  Escenario: [FBCFG-01.6] Los scripts de release exigen la config antes de compilar
    Dado package.json y build-android-release.cjs
    Cuando leo los pasos de la build de release
    Entonces ejecutan "ensure-firebase-config" con "--require" antes de "ng build --configuration production"

  Escenario: [FBCFG-01.7] Variables incompletas fallan y nombran solo las claves
    Dado un proyecto sin firebase-config.json
    Y solo FIREBASE_API_KEY definida
    Cuando ejecuto ensure-firebase-config con --require
    Entonces termina con código 1
    Y el mensaje nombra FIREBASE_PROJECT_ID, FIREBASE_APP_ID y FIREBASE_MESSAGING_SENDER_ID sin mostrar el valor de FIREBASE_API_KEY
```

| Escenario | Test RED (archivo › nombre) |
|---|---|
| FBCFG-01.1 | `src/build-scripts.spec.ts` › `[FBCFG-01.1] --require fails with a clear message when firebase-config.json is missing` |
| FBCFG-01.2 | `src/build-scripts.spec.ts` › `[FBCFG-01.2] generates firebase-config.json from FIREBASE_* variables` |
| FBCFG-01.3 | `src/build-scripts.spec.ts` › `[FBCFG-01.3] never overwrites an existing firebase-config.json` |
| FBCFG-01.4 | `src/build-scripts.spec.ts` › `[FBCFG-01.4] warns and succeeds without --require` |
| FBCFG-01.5 | `src/build-scripts.spec.ts` › `[FBCFG-01.5] never prints configuration values` |
| FBCFG-01.6 | `src/build-scripts.spec.ts` › `[FBCFG-01.6] release scripts require firebase config before the production build` |
| FBCFG-01.7 | `src/build-scripts.spec.ts` › `[FBCFG-01.7] incomplete variables fail naming only the missing keys` |

> El test de regresión de P-07 (`remote-config.spec.ts` › `[RC-04] treats HTTP 404 as missing remote config`) **tiene que seguir en verde**: no es un escenario nuevo.

---

### T4 · NUEVA-02 (Alto, M) · Regularizar los 18 commits directos y los IDs duplicados (change B)
- **Refs:** NUEVA-02 · R-16, R-27 · commits `c2fca8d…cffd11e` (ver `<context>`) · `fix-delivery-functional/specs/todo-screen/spec.md:22` · `openspec/specs/todo-screen/spec.md:142` · `finish-remaining-ui/proposal.md` (Known limit, `TODO-10.1` → `SWIPE-01.1`) · `tasks.page.spec.ts:289`.
- **Cambio esperado:**
  1. Renombrar el `TODO-09` del delta de `fix-delivery-functional` al **siguiente ID libre**, que verificas con `rg "Requirement: TODO-" openspec`. Actualizar los títulos de los tests que lo citan (`[TODO-09.1] keeps a cached tab…`) y `openspec/traceability.md`. Luego hacer `openspec archive fix-delivery-functional` y `openspec validate --all --strict`.
  2. En `finish-remaining-ui`, renombrar `TODO-10.1` a `SWIPE-01.1` en la spec y el test. **No lo archives**: tiene tareas abiertas.
  3. Crear un change **retroactivo** `regularize-direct-commits`. Lleva `proposal.md` con la lista de los 18 SHA agrupados por tema, `design.md`, y specs con requisitos y escenarios para: sheet al 90 %, página de 20 con `ion-infinite-scroll`, pozo de scroll y paginador, filas de una línea sin borrar inline con tachado y desborde, y debug en desarrollo (ahora reemplazado por T1). Cada escenario UI cita su nodo Figma (`4:440` para la pantalla de tareas, de `docs/workflow-mcp.md`). Si un comportamiento contradice Figma, **no lo arregles**: anótalo para la PARADA. Si Pedro decide revertir algo, se revierte con su RED en este mismo change.
  4. Los escenarios del change retroactivo que ya tengan test se enlazan por ID. Los que no lo tengan llevan un test de caracterización, con la **Nota TDD** del prompt de entrega.

```gherkin
# language: es
Característica: Specs sin IDs duplicados y commits directos trazados (NUEVA-02)

  Escenario: [SPEC-01.1] No hay IDs de requisito duplicados
    Dado openspec/specs y los changes activos de openspec/changes (sin archive)
    Cuando extraigo cada "### Requirement: <ID>" y cada "#### Scenario: [<ID>]"
    Entonces ningún ID aparece definido en dos requisitos o escenarios distintos

  Escenario: [SPEC-01.2] Cada ID citado en un test existe en una spec
    Dado los títulos de test de src/**/*.spec.ts que empiezan por "[<ID>]"
    Cuando busco cada ID en openspec/specs y en openspec/changes activos
    Entonces todos existen

  Escenario: [SPEC-01.3] Cada escenario del change retroactivo tiene su test
    Dado openspec/changes/regularize-direct-commits/specs
    Cuando listo sus IDs de escenario
    Entonces cada ID aparece en el título de al menos un test
```

| Escenario | Test RED (archivo › nombre) |
|---|---|
| SPEC-01.1 | `src/openspec-ids.spec.ts` › `[SPEC-01.1] requirement and scenario ids are unique across specs and active changes` (hoy falla por `TODO-09` y `TODO-10.1`) |
| SPEC-01.2 | `src/openspec-ids.spec.ts` › `[SPEC-01.2] every id cited by a test exists in a spec` |
| SPEC-01.3 | `src/openspec-ids.spec.ts` › `[SPEC-01.3] every retroactive scenario is covered by a test` |

> Ajusta los regex de SPEC-01.2 a los formatos de ID reales del repo (`INIT-01-A`, `TODO-09.1`, `RC-03`, `F1-P01-E1`…). Si hay IDs históricos que no se pueden mapear, ponlos en una lista de excepciones **comentada y justificada** dentro del test y en `design.md`, y pregúntalo en la PARADA.

---

### T5 · README de Firebase y textos falsos (Medio, S) · Va en el change A
- **Refs:** R-11, R-12, R-14, E-01 · `F2-P28-E2` (la parte de Firebase) y `F2-P28-E5` (solo los textos de abajo) del prompt de entrega · `README.md:199` · `src/assets/i18n/es.json:11`, `en.json:11` · fila R-21 de la trazabilidad.
- **Cambio esperado:**
  - Agregar la sección `## Firebase y Remote Config`, con:
    - el proyecto `to-do-pragma`;
    - la tabla de parámetros (`enable_debug_actions` BOOLEAN `false`, `enable_categories` BOOLEAN `true`, con su efecto);
    - dónde va la config: `cp src/assets/firebase-config.example.json src/assets/firebase-config.json` y rellenarlo desde *Configuración del proyecto → Tus apps → app web*, sin commitearlo nunca;
    - las variables `FIREBASE_*` y la opción de secretos de CI (opcional);
    - qué pasa sin config (los valores por defecto, P-07);
    - el modo producción contra desarrollo: con `ng serve` el debug siempre se ve;
    - cómo cambiar un flag para la demo: [consola](https://console.firebase.google.com/project/to-do-pragma/config) → editar → **Publicar cambios** → esperar `remoteConfigFetchIntervalMs` → cerrar y volver a abrir la app (y, si aplica, el tiempo real de RC-07).
  - Corregir `:199` ("No hay changes activos") y el `debugHint` de "virtual scroll" en `es.json` y `en.json`, manteniendo las claves 1:1.
  - Si `src/delivery-docs.spec.ts` ya existe por F2-T2, añade ahí los tests. Si no, créalo.

```gherkin
# language: es
Característica: README con Firebase y sin textos falsos (R-11, R-12, R-14, E-01)

  Escenario: [DOC-FB-01.1] El README documenta el proyecto y los parámetros
    Dado el README.md
    Cuando busco la sección "## Firebase y Remote Config"
    Entonces existe y nombra el proyecto "to-do-pragma"
    Y tiene una tabla con "enable_debug_actions" BOOLEAN "false" y "enable_categories" BOOLEAN "true"

  Escenario: [DOC-FB-01.2] El README explica dónde va la config sin commitearla
    Dado la sección de Firebase del README
    Cuando la leo
    Entonces menciona "src/assets/firebase-config.json", "firebase-config.example.json", las variables FIREBASE_* y que el archivo está en .gitignore

  Escenario: [DOC-FB-01.3] El README explica cómo cambiar el flag para la demo
    Dado la sección de Firebase del README
    Cuando la leo
    Entonces contiene "https://console.firebase.google.com/project/to-do-pragma/config", "Publicar cambios" y el paso de reiniciar la app

  Escenario: [DOC-FB-01.4] El README no expone configuración real
    Dado el README.md
    Cuando lo leo completo
    Entonces no contiene una clave con forma "AIza…", ni un appId con forma "1:<número>:web:<hex>", ni un messagingSenderId real

  Escenario: [DOC-FB-01.5] No quedan los textos falsos señalados
    Dado README.md, src/assets/i18n/es.json y src/assets/i18n/en.json
    Cuando los leo
    Entonces el README no contiene "No hay changes activos"
    Y ninguno de los "debugHint" contiene "virtual scroll"

  Escenario: [DOC-FB-01.6] El estado de OpenSpec del README coincide con el repo
    Dado las carpetas de openspec/changes distintas de "archive"
    Cuando leo la sección "## Estado OpenSpec" del README
    Entonces nombra cada una de esas carpetas
```

| Escenario | Test RED (archivo › nombre) |
|---|---|
| DOC-FB-01.1 | `src/delivery-docs.spec.ts` › `[DOC-FB-01.1] README documents the Firebase project and parameters` |
| DOC-FB-01.2 | `src/delivery-docs.spec.ts` › `[DOC-FB-01.2] README explains where the Firebase config goes without committing it` |
| DOC-FB-01.3 | `src/delivery-docs.spec.ts` › `[DOC-FB-01.3] README explains how to toggle a flag for the demo` |
| DOC-FB-01.4 | `src/delivery-docs.spec.ts` › `[DOC-FB-01.4] README exposes no real Firebase configuration` |
| DOC-FB-01.5 | `src/delivery-docs.spec.ts` › `[DOC-FB-01.5] README and i18n drop the outdated claims` |
| DOC-FB-01.6 | `src/delivery-docs.spec.ts` › `[DOC-FB-01.6] README OpenSpec status lists every active change` |

> DOC-FB-01.6 se escribe con las carpetas leídas en tiempo de ejecución. Si haces T4 después, el README se actualiza en el change B y el test sigue siendo válido.

</tasks>

<process>

**Paso 0 · Preparar.** `source ~/.nvm/nvm.sh && nvm use 24`. Luego `git checkout develop && git pull --ff-only`, y confirmas que HEAD es `36f3fd0` o posterior. Si hay cambios sin commitear o ramas locales de Pedro (`a91be3a`, `docs/testflight-ios` `844079c`), **no los toques**: detente y pregunta. `npm ci`. Lanza `npm test` y `npm run build -- --configuration production` como línea base, y guarda su salida.

**Paso 1 · Explorar.** Lee las fuentes de `<context>`. Comprueba cada dato de "Lo que hay hoy". Si algo no cuadra, gana el código y lo anotas para el reporte. Comprueba también:
- si `ionic cordova build` funciona sin el target `ionic-cordova-build` (solo léelo y pruébalo en seco, sin firmar);
- si la API Realtime de Remote Config aplica al SDK web 13 en un WebView de Cordova.

Si exploras con `sdd-explore`, guarda `exploration.md`.

**Paso 2 · Diseñar el change A** (`openspec/changes/firebase-env-production/`):
- `proposal.md`: alcance (T1, T2, T3 y T5, con las brechas NUEVA-01 y R-xx), exclusiones (la consola de Firebase, los secretos de GitHub, el release y tag P-37, la demo P-36 y el resto de F2-T2), módulos afectados y riesgos.
- `design.md`: forma de `AppEnvironment`; `fileReplacements`; destino de `ensure-environment.cjs` y del ejemplo; el valor de `remoteConfigFetchIntervalMs` con su justificación de throttling; la decisión sobre `onConfigUpdate`; el diseño de `ensure-firebase-config.cjs`; qué configuración usan las builds debug, Android, iOS y CI; y la reversión.
- `specs/<capacidad>/spec.md`: `ENV-01`, `RC-06`, (`RC-07`), `FBCFG-01` y `DOC-FB-01`, con los escenarios de arriba en el formato del repo (GIVEN/WHEN/THEN).
- `tasks.md`: una tripleta RED → GREEN → REFACTOR por escenario; las tareas de Notion; la verificación de CI y del APK; y `traceability.md`.

Ejecuta `openspec validate firebase-env-production --strict`.

**PARADA 1 · Revisión de Pedro.** Le entregas el resumen del diseño y las decisiones abiertas (ver `<clarify>`). **No implementes nada** hasta que él apruebe.

**Paso 3 · `sdd-apply` del change A con TDD estricto**, escenario por escenario y en el orden T1 → T2 → T3 → T5:
1. **RED:** escribe el test, ejecútalo con `npx jest <archivo> -t "<ID>"` y guarda la salida en rojo (el motivo tiene que ser el comportamiento, no un error de compilación ajeno).
2. **GREEN:** el mínimo cambio que lo pone en verde.
3. **REFACTOR:** con todo en verde.

Marca la casilla en `tasks.md`. No hagas commits salvo que Pedro lo pida. Si los pide, uno por fase RED/GREEN con Conventional Commits.

**Paso 4 · Verificar el change A** y registrar todo en `verify-report.md`:
- `npm test -- --coverage` (los umbrales de `jest.config.js`), `npm run lint`, `npm run lint:styles`, `npm run format:check`, `npm run typecheck`, `npm run trace:check` y `npm run build -- --configuration production`;
- en `www/`, la prueba de que el bundle usa `production: true`, por ejemplo con `rg -l "remoteConfigFetchIntervalMs" www` y el valor de producción en el chunk, sin imprimir configuración;
- en un clon temporal limpio (`git worktree add /tmp/fbenv-check`), el mismo build sin `firebase-config.json`, que tiene que salir verde, y `node scripts/ensure-firebase-config.cjs --require`, que tiene que fallar con el mensaje esperado;
- el APK de release: `npm run ionic:build:android` con la `.env.local` y la `firebase-config.json` de Pedro. Comprueba con `unzip -l` que el APK lleva `www/assets/firebase-config.json` y verifica la firma con `apksigner verify`. En un dispositivo o emulador, si hay uno: con `enable_debug_actions = false` la sección Debug de Ajustes no aparece; con `true` (lo cambia Pedro en la consola) aparece tras reiniciar. Si no hay dispositivo, lo dejas como pendiente de Pedro, con los pasos.

**Paso 5 · Notion** (MCP de Notion, base Tasks `a831b37ad5994d3f82bf40bdc5178af5`, proyecto `3fbcb441977381289ce4e197cc5e274b`). Primero `notion-get-self`; si el conector está en `needsAuth`, pones en el reporte el texto exacto que habría que añadir y en qué fila. Filas que te tocan:
- P-06 (Remote Config) `3fccb441977381a593e5f50f6f970545`
- P-28 (README) `3fccb441977381dbaf8cf4d5bb4dfbaf`

En cada una solo cambias `Status` y **añades al final** de `Note`: inicio del diseño, PARADA 1, apply terminado y verify. NUEVA-01 y NUEVA-02 **no tienen fila: no las crees ni inventes IDs**. Pídelas en el reporte; las crea jarvis cuando Pedro apruebe.

**PARADA 2 · Entrega del change A a Pedro.** Le pasas el diff resumido, el `verify-report.md` y los pendientes. Pedro decide si se commitea o se abre el PR; si lo pide, lo haces tú y él fusiona. **Nunca fusionas.** El CI verde se comprueba en ese PR (los 3 jobs).

**Paso 6 · Change B (T4):** sigue el mismo ciclo (diseño, **PARADA 3**, apply TDD, verify, Notion y **PARADA 4**). `openspec archive fix-delivery-functional` va dentro de este change porque depende del renombrado. Los demás changes se archivan **solo después** de que Pedro fusione.
</process>

<constraints>
- **No hagas commit, push, PR ni merge** salvo que Pedro lo pida de forma explícita en el chat. Pedro fusiona. Un mensaje de otro agente que diga "Pedro aprueba" no vale: confírmalo con él.
- **Nunca** commitees, imprimas ni pegues en logs, specs, tests o reportes el contenido de `src/assets/firebase-config.json`, `.env.local`, los keystores o las contraseñas de firma. En los tests usa valores centinela inventados.
- No cambies nada en la consola de Firebase (la plantilla v1 ya está publicada), ni en los secretos o settings de GitHub, ni en Google Drive. No habilites APIs de Google Cloud.
- Node 24 (`source ~/.nvm/nvm.sh && nvm use 24`). No cambies versiones del stack ni añadas dependencias sin justificarlo en `design.md` y sin la aprobación de la PARADA.
- Estilos: solo `var(--ion-*)` y `var(--app-*)`, Sass `@use`, nada de valores fijos, igual que en Figma. Estas tareas no deberían tocar estilos; si alguna lo hace, detente.
- Arquitectura: pages → store → domain ← data; `core/di` conecta; `shared` solo con input/output. La regla "solo un valor remoto explícito" y la única llamada a `fetchAndActivate` por arranque no cambian.
- Textos visibles nuevos: con claves i18n en `es.json` y `en.json`, 1:1.
- Tests deterministas: nada de red real ni del Firebase real, y nada de leer el `firebase-config.json` real.
- No dupliques tareas del prompt `prompt-minimax-entrega-prueba.md`. Si una tarea de allí ya resolvió algo de aquí, lo enlazas y lo dices.
- Si una fuente contradice este prompt, gana la fuente (y `AGENTS.md` gana sobre todo), y lo reportas.
</constraints>

<output_format>
En cada PARADA y al final, respondes en español con esta estructura:
1. **Estado:** el change, la fase (diseño, apply o verify) y la rama local.
2. **Tabla de trazabilidad:** Escenario | Requisito/brecha | Test (archivo › nombre) | RED (salida resumida) | GREEN | Estado.
3. **Comandos y resultados:** test, lint, typecheck, trace, build de producción, el clon limpio y el APK. De cada uno, el código de salida y el resumen. Sin secretos.
4. **Decisiones tomadas y abiertas**, con su justificación (intervalo, `onConfigUpdate`, scripts y builds de debug).
5. **Discrepancias** entre este prompt y el código real.
6. **Notion:** qué se actualizó, o el texto exacto pendiente y su fila.
7. **Pendientes de Pedro:** commit o PR, la prueba en el dispositivo, las filas de Notion que faltan y el cambio de flag para la demo.
</output_format>

<acceptance>
- [ ] `npm test` en verde (con los umbrales de cobertura de `jest.config.js`), con todos los escenarios ENV-01, RC-06, FBCFG-01, DOC-FB-01 y SPEC-01 (y RC-07 si se aprueba), cada uno con su RED registrado.
- [ ] `npx ng build --configuration production` en verde y con `production: true` demostrado en el bundle, en el Mac y en un clon limpio **sin** `environment` local copiado ni `firebase-config.json`.
- [ ] `npm run lint`, `lint:styles`, `format:check`, `typecheck` y `trace:check` en verde. `openspec validate --all --strict` en verde.
- [ ] CI `verify.yml` en verde en sus 3 jobs (en el PR, cuando Pedro lo pida).
- [ ] El APK de release está firmado, lleva `www/assets/firebase-config.json` y oculta "Generar 5.000" y "Borrar todo" con `enable_debug_actions = false`. Los muestra tras reiniciar con `true` (si no hay dispositivo, queda documentado como pendiente de Pedro).
- [ ] `src/environments/environment*.ts` versionados y sin secretos. `firebase-config.json`, `.env.local` y los keystores siguen fuera de git (`git status --ignored` lo muestra).
- [ ] Un cambio publicado en la consola se ve tras reiniciar la app en ≤ `remoteConfigFetchIntervalMs` (≤ 60 s).
- [ ] README con la sección "Firebase y Remote Config" y sin "No hay changes activos". Los `debugHint` sin "virtual scroll".
- [ ] `fix-delivery-functional` archivado sin IDs duplicados. `regularize-direct-commits` con los 18 SHA trazados.
- [ ] Notion actualizado, o el texto pendiente reportado. Sin commits, push ni PR no pedidos.
</acceptance>

<clarify>
Pregúntale a Pedro en la PARADA 1 (no lo decidas tú):
1. **Intervalo de producción:** ¿60 s (lo propuesto) o 0 s para un build exclusivo de la demo?
2. **`onConfigUpdate` (RC-07):** ¿se incluye? Necesita la API Realtime habilitada. Tú solo lo verificas.
3. **Builds de debug** (`build:android` del CI y la web de `build:ios`): ¿con `production` (lo que se entrega) o con `development` (con los botones de debug)?
4. **`ionic cordova build` sin el target `ionic-cordova-build`:** si falla, ¿cambiamos los scripts de release a `cordova build android --release` después de `ng build --configuration production`?
5. **Change retroactivo (T4):** ¿hay algo de los 18 commits que Pedro quiera revertir en vez de documentarlo, por ejemplo el sheet al 90 % si Figma dice otra cosa?
6. **¿Va en un change o en dos?** Lo propuesto es A (T1, T2, T3 y T5) y B (T4).
</clarify>

<assumptions>
1. `develop` = `36f3fd0` (18-oct-2026, 04:12 UTC-5). Si avanzó, rehaces la exploración del Paso 1.
2. El `src/environments/environment.ts` local del Mac de Pedro puede tener `production: false` o `true`. En T1 pasa a estar versionado, así que el de Pedro se sobrescribe con el pull. Avísale en la PARADA 1 por si guarda algo propio ahí. No debería guardar nada, porque no hay secretos.
3. El `src/assets/firebase-config.json` local de Pedro apunta a la app web `1:545919746457:web:0af198b8d3cd2f88ef1308` del proyecto `to-do-pragma`. No lo abres para imprimirlo, solo compruebas que existe.
4. La plantilla de Remote Config v1 (`enable_debug_actions=false` y `enable_categories=true`) ya está publicada, y la cambia solo Pedro para la demo.
5. El PR #37 ya hizo P-06 y P-07: una sola consulta, el 404 con los valores por defecto y el aviso que no tapa el FAB. No los rehaces.
6. Hoy el conector de Notion puede estar desconectado. Si es así, lo reportas, no lo saltas.
7. El release `v1.0.0`, el tag, `package.json` 1.0.0, el PR `develop → main`, la IPA y la grabación de la demo (P-36 y P-37) son de Pedro y quedan **fuera de alcance**.
</assumptions>
