# Reporte de verificación: tasks-crud (C1)

## Bloqueos previos

- C0.5 cerrado y archivado en `openspec/changes/archive/2026-10-17-theme-foundation/`.
- PR 6 fusionado a `develop` con merge commit `aa6d6b4`.
- Branch `feature/tasks-crud` creada desde `develop`.

## Reanudación

Sin bloqueos. La base de `TaskStore`, `Task`, `TaskStateMachine` y `IonicStorageTaskRepository` ya está en `develop`. C1 documenta la base, completa la cobertura de tests y verifica el comportamiento bajo TDD.

## Hallazgos de la inspección previa

- `src/app/store/task.ts` implementa `signalStore` con `refresh`, `upsert`, `upsertMany`, `remove`, `dispatch`, `setCategory`, `setStatuses`, `clearCategory`, `retry` y `actionsFor`.
- `src/app/store/task.spec.ts` cubre `refresh` con expiración, `upsert`/`upsertMany`, `dispatch` con `InvalidTransitionError`, `remove`, manejo de errores y `clearCategory`. Faltan el escenario e2e explícito y cobertura detallada de `setStatuses` + ordenación.
- `src/app/domain/task-state.ts` declara eventos pero `src/app/domain/task-state.spec.ts` no existe.
- `src/app/domain/task.spec.ts` cubre `TASK_STATUS` y la interfaz; sin archivo de spec detallado para `task-state`.

## Correcciones aplicadas en este cambio

- Cero correcciones de código de la app: la base ya cumple el contrato de C1.
- Se añade `src/app/domain/task-state.spec.ts` con cobertura de la máquina de estados.
- Se añade el escenario e2e a `src/app/store/task.spec.ts` para TSK-1+TSK-3+TSK-7+TSK-9.
- Se amplía `src/app/domain/task.spec.ts` con invariantes del dominio.

## Verificaciones finales

Pendiente de ejecutar al cerrar el cambio. Se esperan los siguientes resultados:

- `openspec validate tasks-crud --strict`: `Change 'tasks-crud' is valid`.
- `npm test`: 30+ suites y 205+ tests, exit 0.
- `npm run typecheck`: exit 0.
- `npm run lint`: `All files pass linting.`
- `npm run lint:styles`: exit 0.
- `npm run format:check`: `All matched files use Prettier code style!`
- `npm run build -- --configuration production`: exit 0; advertencia CommonJS esperada de `localforage`.

## Recomendación para el siguiente OpenSpec

C2 debería migrar los consumidores (`task-item`, `home`, `tasks`, `categories`) a `var(--app-*)` y `var(--ion-*)` con `lint:styles` exit 0; C3 debería añadir ordenación y búsqueda; C6 cubre `cordova prepare` y driver `cordova-sqlite`.
