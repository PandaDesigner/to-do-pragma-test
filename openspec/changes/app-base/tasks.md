## 1. Dominio y estrategias

- [x] 1.1 Modelos canónicos de PROMPT (`dueDate`, timestamps, categoría nullable y kind `list`), máquina con clases State en `data/states/`, seis eventos, guard e `InvalidTransitionError`; tests RED→GREEN de las nueve transiciones válidas y todas las inválidas.
- [x] 1.2 Estrategias puras `filterTasks` y `sortTasksByDueDate` con tests de casos límite.
- [x] 1.3 Contratos puros en domain y tokens `TASK_REPOSITORY` y `CATEGORY_REPOSITORY` en core/di, con tests de inyección y contrato.

## 2. Persistencia y stores

- [x] 2.1 `IonicStorageTaskRepository` con persistencia y `@Debounce(300)` aplicado a `persist`.
- [x] 2.2 Stores con `@ngrx/signals` para tareas y categorías.

## 3. Configuración y decoradores

- [x] 3.1 `RemoteConfigService` con flag `enable_categories` (timeout 3 s, default `true`).
- [x] 3.2 Decoradores `@Debounce` y `@LogAction` con tests unitarios.

## 4. UI funcional

- [x] 4.1 Páginas `tasks` y `categories` con `OnPush`, `trackBy` y virtual scroll de CDK desde 200 tareas.
- [x] 4.2 Shell con tabs y ocultación de "Mis listas" cuando `enable_categories=false`.
- [x] 4.3 Botón debug que genera 5.000 tareas.
- [x] 4.4 README con las tres respuestas del PDF, configuración de firma sin secretos y APK firmado e IPA generados.

## 5. Calidad y entrega

- [x] 5.1 `jest.config.cjs` con thresholds 80/95/90/90.
- [x] 5.2 `.github/workflows/verify.yml` con job `verify` según la propuesta CI, ejecutando `npm test -- --coverage` y build de producción.
- [x] 5.3 `verify-report.md` con evidencia real.
- [x] 5.4 PR `feature/app-base-2 → develop` abierto, sin fusionar ni archivar.

## 6. Cierre de la configuración nativa Cordova

- [x] 6.1 `config.xml` con versiones (`1.0.0` / `android-versionCode=1` / `ios-CFBundleVersion=1`), `<access origin="*"/>`, `<allow-navigation href="*"/>`, `<allow-intent>` para `http`, `https`, `tel`, `sms`, `mailto`, `geo`, preferencias `scheme=app` y `hostname=localhost`, y los bloques `<platform name="android">` / `<platform name="ios">` con SDK y theme de la app.
- [x] 6.2 Iconos y splash desde `resources/` (Android adaptive con foreground/background y iOS cubriendo todos los tamaños requeridos); `<preference name="android-targetSdkVersion" value="36"/>` por compatibilidad con `cordova-android@15`.
- [x] 6.3 `package.json` con `cordova.platforms: ["android", "ios"]`; spec `INIT-04` acepta el array en lugar de vaciarlo, `scripts/clean-cordova-platforms.cjs` lo restaura a la baseline declarada.
- [x] 6.4 Scripts npm `build:android`, `build:android:release`, `build:ios` y `requirements`.
- [x] 6.5 `.github/workflows/verify.yml` con jobs `android` (debug APK) e `ios` (`CODE_SIGNING_ALLOWED=NO`).
- [x] 6.6 `README.md`: requisitos del Mac, nombre correcto del workspace (`App.xcworkspace`), keystore unificado con `.gitignore` (`pragmadev-appbase.jks`) y guía de IPA firmado con Apple Developer.
- [ ] 6.7 CI en verde (`verify.yml` `android` + `ios`) en push al PR — pendiente de ejecutar en GitHub Actions.
