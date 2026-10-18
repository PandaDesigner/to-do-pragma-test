# Tareas: tasks-crud (C1)

## Precondiciones

- C0.5 fusionado en `develop` (PR 6, merge commit `aa6d6b4`).
- Branch `feature/tasks-crud` creada desde `develop`.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run lint:styles`, `npm run format:check` y `npm run build -- --configuration production` en verde en `develop` antes de empezar.

## 0. Documentación

- [x] 0.1 Verificar que la batería de tests del store cubre `refresh`, `upsert`, `upsertMany`, `remove`, `dispatch`, `setCategory`, `setStatuses`, `clearCategory`, `retry` y casos de error. Añadir tests faltantes si los hay.
- [x] 0.2 Añadir un escenario e2e en `task.spec.ts` que cubra crear → completar → filtrar por categoría → quitar filtro, alineado con TSK-1, TSK-3 y TSK-7.
- [x] 0.3 Verificar que `task-state-machine` cubre `COMPLETE`, `EXPIRE`, `ARCHIVE`, `REOPEN`, `RESCHEDULE`, `RESTORE` y lanza `InvalidTransitionError` para transiciones inválidas.

## 1. Cobertura de dominio

- [x] 1.1 Auditar la cobertura previa de `Task` e `isTaskStatus` y ejecutar la línea base. Registrar que no hubo RED: el comportamiento y los tests ya existían al reanudar.
- [x] 1.2 Ampliar `src/app/domain/task.spec.ts` con casos para `isTaskStatus`, identidad proporcionada por el llamador, campos obligatorios en el tipo y opcionales; verificar reemplazo sin duplicados en el store. Pruebas en verde.
- [x] 1.3 Auditar `src/app/domain/task-state.spec.ts`, ya existente al reanudar, e identificar la cobertura directa faltante de los cuatro estados. No declarar RED por archivo ausente.

## 2. Cobertura de la máquina de estados

- [x] 2.1 Ampliar `src/app/domain/task-state.spec.ts` con tests para `PendingState`, `CompletedState`, `OverdueState`, `ArchivedState` y `updateTaskStatus`. Verificar `InvalidTransitionError` en transiciones no válidas → pasa.

## 3. Cobertura del store

- [x] 3.1 Revisar y corregir el escenario integrado de TSK-1+TSK-3+TSK-7+TSK-9, ya existente: habilitar pendientes y completadas, comprobar ambos filtros y quitar el filtro con `undefined`.
- [x] 3.2 Verificar: el escenario pasa con `InMemoryRepository<Task>` y `CLOCK` fijos.
- [x] 3.3 Añadir y ejecutar un test explícito de `setStatuses([COMPLETED])` con varias fechas, orden ascendente, copia del filtro y lista vacía. Pruebas en verde.

## 4. Verificaciones

- [x] 4.1 `openspec validate tasks-crud --strict` exit 0.
- [x] 4.2 `npm test -- --coverage --coverageReporters=json-summary --coverageReporters=text`: 31 suites y 248 tests en verde; cobertura del 100 % en sentencias, ramas, funciones y líneas para `domain/task.ts`, `domain/task-state.ts`, `store/task.ts`.
- [x] 4.3 `npm run typecheck`, `npm run lint`, `npm run lint:styles`, `npm run format:check` y `npm run build -- --configuration production` exit 0.

## 5. Entrega

- [x] 5.1 Commits Conventional Commits con IDs; abrir PR borrador de `feature/tasks-crud` hacia `develop` con el cambio OpenSpec, la spec, los tests y el reporte de verificación. Actualizar Notion C1 solo en `Status`/`Note`, conservando texto y añadiendo URL, conteo real y hash; no archivar, fusionar, force-push ni marcar listo hasta revisión.
