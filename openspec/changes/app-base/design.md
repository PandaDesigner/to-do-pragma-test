## Context

`init` ya deja Ionic 8 + Angular 22.2.3 standalone, Cordova con `cordova-sqlite-storage`, Jest 30 con `jest-preset-angular`, lint, formato, build de producción y CI. La prueba del PDF y `docs/PROMPT.md` describen el comportamiento mínimo: tareas y categorías, persistencia local, flag de categorías, rendimiento con 5.000 tareas, y respuestas a retos, optimizaciones, calidad y mantenibilidad.

## Goals / Non-Goals

**Goals**: app funcional sobre el scaffolding, decoradores con tests, CI con cobertura por capa, README que responda a las 3 preguntas del PDF.

**Non-Goals**: Remote Config contra un proyecto Firebase real, builds nativos firmados, sin plataformas Android/iOS.

## Decisions

- Los modelos viven en `src/app/domain/` y son tipos puros sin dependencias de Angular. Transiciones codificadas en `transitionTask` y validadas en el límite del dominio.
- Las estrategias `filterTasks` y `sortTasksByDueAt` son funciones pure; los stores las componen sobre el estado actual.
- `TASK_REPOSITORY` y `CATEGORY_REPOSITORY` son `InjectionToken`; los repositorios se inyectan desde `core/di`. `IonicStorageTaskRepository` aplica `@Debounce(300)` a la persistencia para evitar escrituras repetitivas al generar 5.000 tareas.
- Las páginas `tasks` y `categories` usan `cdk-virtual-scroll` desde 200 tareas. A partir de 200 ítems se renderiza con `cdkVirtualFor`; por debajo, con `@for`.
- `RemoteConfigService` aplica una carrera entre `port.fetch()` y `setTimeout(3000)`. Si el fetch gana, devuelve su valor; si no, devuelve `true` por defecto.
- El workflow CI mantiene `verify` para PR a `develop` y `main`. La cobertura por capa se aplica con thresholds por path en `jest.config.cjs`.
- El flag `enable_categories` oculta la pestaña "Mis listas" y los chips de categoría cuando es `false`. La pestaña principal "Todas" sigue mostrando todas las tareas.

## Risks / Trade-offs

- Cobertura por capa: el porcentaje de `domain` (95%) requiere tests para transiciones inválidas y estrategias en casos límite. Lo cubrimos en este cambio.
- `cdk-virtual-scroll` exige importar `@angular/cdk/scrolling`, que ya está declarado en `package.json` por `init`.
- `RemoteConfigService` necesita un `RemoteConfigPort`; lo inyecta el `core/di`.
- La persistencia usa `cordova-sqlite-storage` con `localforage`; en navegador el driver degradado a LocalStorage para que los tests funcionen sin entorno Cordova.

## Migration Plan

No hay datos que migrar. `init` deja la app en estado vacío. Cada fase agrega un commit y actualiza `tasks.md`.

## Open Questions

- ¿Nombre y orden de las tabs? Decidido: "Todas" (Tasks) y "Mis listas" (Categories). Confirmar con el usuario antes del último commit.
- ¿Generador de IDs para las tareas nuevas? Decidido: `nanoid` ligero con timestamp + random. Si prefieres UUID, se cambia en este cambio.
