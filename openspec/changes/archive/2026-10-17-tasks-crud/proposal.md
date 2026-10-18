## Why

La base del CRUD de tareas ya existe en `develop` mediante `TaskStore`, `Task`, `TaskStateMachine` e `IonicStorageTaskRepository`. C0.5 fundó los tokens visuales. C1 cierra la base existente con un OpenSpec trazable, completa la cobertura de tests del store y del dominio, y aporta un escenario de extremo a extremo del flujo crear, completar y filtrar por categoría.

Sin un OpenSpec de C1, la base del CRUD queda sin documentar y la cobertura de tests del store es desigual. El siguiente OpenSpec no puede partir de un contrato verificable.

## What Changes

- Documentar la base del CRUD de tareas en `openspec/changes/tasks-crud/{proposal,design,tasks,verify-report}.md`.
- Declarar los requisitos `TSK-1` a `TSK-10` en `openspec/changes/tasks-crud/specs/tasks/spec.md` con escenarios normalizados a `TSK-n.m`.
- Sincronizar la spec `tasks` en `openspec/specs/tasks/spec.md` al archivar el cambio.
- Ampliar `src/app/store/task.spec.ts` con el escenario e2e crear → completar → filtrar.
- Crear `src/app/domain/task-state.spec.ts` con cobertura de la máquina de estados.
- Ampliar `src/app/domain/task.spec.ts` con invariantes del dominio.
- Cero cambios de código de la app: la base ya cumple el contrato de C1.

## Capabilities

### New Capabilities

- `tasks`: contrato del CRUD de tareas con requisitos `TSK-1` a `TSK-10`, escenarios de fallo y escenario e2e.

### Modified Capabilities

Ninguna. La capacidad `ui-shell` de C0.5 no se modifica.

## Impact

Afecta `src/app/store/task.spec.ts`, `src/app/domain/task-state.spec.ts` (nuevo), `src/app/domain/task.spec.ts` y los artefactos del OpenSpec. No se toca `src/app/store/task.ts`, `src/app/domain/task.ts`, `src/app/domain/task-state.ts`, `src/app/data/`, `src/app/core/`, `src/app/pages/` ni los consumidores.

Stack conservado: Ionic 8, Angular 22, `@ngrx/signals`, Cordova, Jest. Sin Capacitor, Vitest ni Bun. Sin cambios de persistencia, modelos o reglas funcionales.

Rama `feature/tasks-crud` creada desde develop. PR borrador hacia `develop`, un solo cambio OpenSpec. Seguimiento: Notion C1, página `3fbcb4419773815db397fe4678dec2f0` (misma página que C0.5, nueva sección C1). No archivar, fusionar, force-push ni marcar el PR como listo hasta revisión.
