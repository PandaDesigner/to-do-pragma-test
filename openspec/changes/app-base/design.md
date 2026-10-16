## Context

`init` ya deja Ionic 8 + Angular 22.2.3 standalone, Cordova con `cordova-sqlite-storage`, Jest 30 con `jest-preset-angular`, lint, formato, build de producción y CI. La prueba del PDF y `docs/PROMPT.md` describen el comportamiento mínimo: tareas y categorías, persistencia local, flag de categorías, rendimiento con 5.000 tareas, y respuestas a retos, optimizaciones, calidad y mantenibilidad.

## Goals / Non-Goals

**Goals**: app funcional sobre el scaffolding, decoradores con tests, CI con cobertura por capa, README que responda a las 3 preguntas del PDF.

**Non-Goals**: publicar o fusionar la entrega sin aprobación de Pedro. La corrección de rumbo incorpora APK firmado e IPA; no basta documentar builds sin firma.

## Decisions

- Los modelos siguen `docs/PROMPT.md`: `dueDate`, timestamps, categoría nullable y kind `list`. El usuario aprobó reemplazar el modelo anterior sin migración de datos ni compatibilidad con `dueAt`/`default`.
- Dominio contiene contratos State, reloj y errores puros, sin Angular ni dependencias de data. Las cuatro clases State y la máquina delegadora viven en `data/states/`. No se usa una tabla de destinos. `transitionTask({ task, event, clock })` es la entrada funcional en data.
- Las nueve transiciones válidas actualizan `updatedAt`; RESCHEDULE utiliza el día local del reloj inyectado. EXPIRE con fecha igual o posterior a hoy lanza `InvalidTransitionError`. Las futuras cargas del store deberán comprobar el vencimiento antes de despachar EXPIRE.
- Las estrategias `filterTasks` y `sortTasksByDueDate` son funciones puras; los stores las componen sobre el estado actual.
- Los contratos `Repository<T>`, `TaskRepository` y `CategoryRepository` permanecen en domain sin Angular. `TASK_REPOSITORY` y `CATEGORY_REPOSITORY` son `InjectionToken` definidos en `core/di`; los repositorios se inyectan desde esa capa. El mismo contrato `list/save/remove` se verifica contra InMemory y Storage mock. `IonicStorageTaskRepository` aplica `@Debounce(300)` a la persistencia para evitar escrituras repetitivas al generar 5.000 tareas.
- Las páginas `tasks` y `categories` usan `cdk-virtual-scroll` desde 200 tareas. A partir de 200 ítems se renderiza con `cdkVirtualFor`; por debajo, con `@for`.
- `RemoteConfigService` limita toda la consulta a 3000 ms, incluida la lectura del JSON y la carga diferida del SDK. Solo un false booleano deshabilita categorías. Pedro aprobó true ante fallo de red, con diagnóstico visible y reintento manual, sin reintentos automáticos. El resultado tardío no modifica el flag tras el timeout.
- Pedro aprobó cargar la configuración desde `assets/firebase-config.json`, ignorado por Git, para conservar el build sin environments privados. Se versiona únicamente un ejemplo sin valores reales. El adaptador usa Firebase modular y fetchAndActivate, defaultConfig true e intervalos de 60 s en desarrollo y 1 h en producción. No se inicializa Analytics.
- El workflow CI mantiene `verify` para PR a `develop` y `main`. La cobertura por capa se aplica con thresholds por path en `jest.config.cjs`.
- El flag `enable_categories` oculta la pestaña "Mis listas" y los chips de categoría cuando es `false`. La pestaña principal "Todas" sigue mostrando todas las tareas.

## Risks / Trade-offs

- Cobertura por capa: el porcentaje de `domain` (95%) requiere tests para transiciones inválidas y estrategias en casos límite. Lo cubrimos en este cambio.
- `cdk-virtual-scroll` exige importar `@angular/cdk/scrolling`, que ya está declarado en `package.json` por `init`.
- `RemoteConfigService` necesita un `RemoteConfigPort`; lo inyecta el `core/di`.
- Pedro aprobó que las llamadas agrupadas por `@Debounce(300)` esperen la escritura real y reciban su error. Las ejecuciones por instancia se serializan para impedir que una escritura antigua sobrescriba una nueva. El store mostrará el fallo y permitirá reintento manual; no habrá reintentos automáticos. Se conservan los exports lowercase de los decoradores por compatibilidad.
- La persistencia usa `cordova-sqlite-storage` con `localforage`; en navegador el driver degradado a LocalStorage para que los tests funcionen sin entorno Cordova.

## Migration Plan

El usuario confirmó que no se requiere conservar datos del modelo anterior. Cada tarea completa actualiza `tasks.md` y tiene su commit convencional. La continuación autorizada usa `feature/app-base-2` desde `develop`, con un único PR hacia `develop`. No fusionar ni archivar; detenerse al finalizar cada fase.

Para ejecutar la comprobación raíz con TypeScript 6 se retira `baseUrl`, se hacen relativos los `paths` y se declaran tipos Jest/Node en el tsconfig raíz. La configuración de app conserva `types: []`, sin introducir tipos de pruebas en el bundle.

## Open Questions

- ¿Nombre y orden de las tabs? Decidido: "Todas" (Tasks) y "Mis listas" (Categories). Confirmar con el usuario antes del último commit.
- ¿Generador de IDs para las tareas nuevas? Decidido: `nanoid` ligero con timestamp + random. Si prefieres UUID, se cambia en este cambio.
