## Why

`init` deja el proyecto con scaffolding reproducible pero sin funcionalidad. La prueba técnica exige una app de tareas con categorías, persistencia local, configuración remota y cobertura por capa. Este cambio entrega esa app base, separada de init para limitar el tamaño del PR y permitir iterar capa por capa.

## What Changes

- Modelos de dominio: `Task` con `TaskStatus` y transiciones, `Category` con `CategoryKind`.
- Estrategias pure de filtro y orden de tareas.
- Puertos de repositorio (`InjectionToken`) para `Task` y `Category`.
- Repositorio `IonicStorageTaskRepository` con persistencia y `@Debounce(300)`.
- Stores con `@ngrx/signals` para tareas y categorías.
- Servicio `RemoteConfigService` con flag `enable_categories` (timeout 3 s, default `true`).
- Decoradores `@Debounce` y `@LogAction` con pruebas unitarias.
- Páginas `tasks` y `categories` con `OnPush`, `trackBy` y `cdk-virtual-scroll` desde 200 tareas.
- Botón debug que genera 5.000 tareas.
- Workflow CI con umbrales de cobertura: 80% global, 95% `domain`, 90% `data` y `store`.
- README con las 3 respuestas del PDF (retos, optimizaciones, calidad y mantenibilidad) y guía de build nativo y generación de APK firmado e IPA, sin versionar secretos.

## Capabilities

### New Capabilities

- `app-domain`: modelos puros, transiciones y estrategias de tareas.
- `app-data`: puertos de repositorio y adaptadores de persistencia.
- `app-store`: SignalStore de tareas y categorías.
- `app-shell`: layout con tabs y feature flag `enable_categories`.
- `app-remote-config`: lectura del flag con fallback seguro.
- `app-quality`: cobertura por capa y workflow dedicado.

## Impact

- Continuación autorizada: `feature/app-base-2` desde `develop`, un PR hacia `develop` sin fusionar ni archivar. Pedro aprueba el avance entre fases.
- Módulos afectados: `src/app/domain`, `src/app/data`, `src/app/store`, `src/app/pages`, `src/app/layout`, `src/app/core/config`, `src/app/core/decorators`, `src/app/core/di`, `.github/workflows`, `README.md`, `docs/ci-cd-propuesta.md`, `docs/plan-maximo-puntaje-pi.md`.
- La corrección de rumbo incorpora la máquina State de `docs/PROMPT.md`, APK firmado e IPA. Sigue excluido el despliegue de Firebase en producción. No publicar secretos ni sustituir la entrega de binarios por instrucciones sin firma.
