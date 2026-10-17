# Tareas: tasks-crud (C1)

## Precondiciones

- C0.5 fusionado en `develop` (PR 6, merge commit `aa6d6b4`).
- Branch `feature/tasks-crud` creada desde `develop`.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run lint:styles`, `npm run format:check` y `npm run build -- --configuration production` en verde en `develop` antes de empezar.

## 0. Documentación

- [ ] 0.1 Verificar que la batería de tests del store cubre `refresh`, `upsert`, `upsertMany`, `remove`, `dispatch`, `setCategory`, `setStatuses`, `clearCategory`, `retry` y casos de error. Añadir tests faltantes si los hay.
- [ ] 0.2 Añadir un escenario e2e en `task.spec.ts` que cubra crear → completar → filtrar por categoría → quitar filtro, alineado con TSK-1, TSK-3 y TSK-7.
- [ ] 0.3 Verificar que `task-state-machine` cubre `COMPLETE`, `EXPIRE`, `ARCHIVE`, `REOPEN`, `RESCHEDULE`, `RESTORE` y lanza `InvalidTransitionError` para transiciones inválidas.

## 1. Cobertura de dominio

- [ ] 1.1 RED: `npx jest src/app/domain/task.spec.ts` esperando invariantes de `Task` y `isTaskStatus` → falla si faltan.
- [ ] 1.2 GREEN: ampliar `src/app/domain/task.spec.ts` con casos para `isTaskStatus`, IDs únicos y campos obligatorios → pasa.
- [ ] 1.3 RED: `npx jest src/app/domain/task-state.spec.ts` esperando que cada `TaskState` declare sus eventos disponibles y aplique la transición correcta → falla si el archivo no existe.

## 2. Cobertura de la máquina de estados

- [ ] 2.1 GREEN: crear `src/app/domain/task-state.spec.ts` con tests para `PendingState`, `CompletedState`, `OverdueState`, `ArchivedState` y `updateTaskStatus`. Verificar `InvalidTransitionError` en transiciones no válidas → pasa.

## 3. Cobertura del store

- [ ] 3.1 RED: añadir a `src/app/store/task.spec.ts` el escenario e2e de TSK-1+TSK-3+TSK-7+TSK-9 → falla si no existe.
- [ ] 3.2 GREEN: el escenario pasa con `InMemoryRepository<Task>` y `CLOCK` fijos.
- [ ] 3.3 RED: test que verifica que `setStatuses([COMPLETED])` filtra `visibleTasks` y la ordenación por `dueDate` ascendente → falla si no hay cobertura.

## 4. Verificaciones

- [ ] 4.1 `openspec validate tasks-crud --strict` exit 0.
- [ ] 4.2 `npm test` 30+ suites y 205+ tests en verde; cobertura nueva ≥ 80 % para `domain/task.ts`, `domain/task-state.ts`, `store/task.ts`.
- [ ] 4.3 `npm run typecheck`, `npm run lint`, `npm run lint:styles`, `npm run format:check` y `npm run build -- --configuration production` exit 0.

## 5. Entrega

- [ ] 5.1 Commits Conventional Commits con IDs; abrir PR borrador de `feature/tasks-crud` hacia `develop` con el cambio OpenSpec, la spec, los tests y el reporte de verificación. Actualizar Notion C1 solo en `Status`/`Note`, conservando texto y añadiendo URL, conteo real y hash; no archivar, fusionar, force-push ni marcar listo hasta revisión.
