# Diseño: tasks-crud (C1)

## Contexto

C0.5 fundó los tokens visuales y dejó la base de tareas implementada en `develop` pero sin OpenSpec. Este cambio documenta la base existente y la cierra con la batería de tests completa.

## Arquitectura

Cuatro capas, dependencias hacia adentro:

```
pages/  ->  store/  ->  domain/  <-  data/states/
                              ^
                              |-- data/repositories/  ->  core/di/
```

- `domain/` (sin Angular): entidades puras, máquina de estados, estrategia de filtrado y ordenación.
- `data/states/`: implementaciones concretas de los estados de la máquina.
- `data/repositories/`: implementaciones de los puertos del dominio, incluido `InMemoryRepository` para tests.
- `store/`: `signalStore` con estado, selectores y métodos.
- `pages/`: solo consume selectores y dispara métodos; no toca repositorios.
- `core/di/`: tokens Angular y `IonicStorageTaskRepository` sobre `@ionic/storage-angular` con `localforage-cordovasqlitedriver` en móvil.

## Entidad Task

`Task` está en `src/app/domain/task.ts`. Campos:

- `id`: string obligatorio, proporcionado por el llamador; el repositorio y el store reemplazan por id sin duplicar entradas. La interfaz no genera ids.
- `title`: string obligatorio en el tipo; la interfaz no valida texto en ejecución.
- `status`: `TASK_STATUS` (`pending`, `completed`, `overdue`, `archived`).
- `categoryId`: id de categoría o `null`.
- `dueDate`: fecha `YYYY-MM-DD` (string) usada para filtrar y ordenar.
- `time`, `durationMin`, `reminderMin`: opcionales, documentados en dominio pero sin uso en UI en C1.
- `createdAt`, `updatedAt`: timestamp numérico en milisegundos.

## Máquina de estados

`TaskStateMachine` en `src/app/data/states/task-state-machine.ts` mapea cada `TaskStatus` a un `TaskState`. Eventos: `COMPLETE`, `EXPIRE`, `ARCHIVE`, `REOPEN`, `RESCHEDULE`, `RESTORE`. La transición no válida lanza `InvalidTransitionError`.

## Repositorio

Puerto `TaskRepository` en `src/app/domain/repository.ts`. Implementaciones:

- `InMemoryRepository<Task>` (tests).
- `IonicStorageTaskRepository` (producción) sobre `@ionic/storage-angular`; orden de drivers configurado: Cordova SQLite, IndexedDB y LocalStorage.

DI: `TASK_REPOSITORY` en `src/app/core/di/tokens.ts` enlazado a `IonicStorageTaskRepository` en `src/app/core/di/storage-initializer.ts`.

## Store

`TaskStore` en `src/app/store/task.ts` con `signalStore` raíz. Estado:

- `tasks: readonly Task[]`.
- `statuses: readonly TaskStatus[]` (filtro por estado, por defecto `[PENDING, OVERDUE]`).
- `categoryId: string | null | undefined` (filtro por categoría).
- `busy`, `error`: estado de operación.

Métodos públicos:

- `refresh()`: carga del repositorio, expira pendientes con `dueDate < today`.
- `upsert(task)`, `upsertMany(tasks)`: persistir y fusionar por id, conservando los timestamps recibidos.
- `remove(id)`: borrar del repositorio y del estado.
- `dispatch(id, event)`: aplicar transición de la máquina.
- `clearCategory(categoryId)`: pone `categoryId = null` a las tareas de esa categoría.
- `setStatuses(statuses)`, `setCategory(categoryId)`: filtros.
- `actionsFor(task)`: eventos disponibles según estado.
- `retry()`: reintenta la última operación fallida.

## Persistencia

`@ionic/storage-angular` 4.0 sobre `localforage`. Orden configurado: Cordova SQLite, IndexedDB y LocalStorage. En web se usa el primer driver disponible, no necesariamente LocalStorage. Inicialización en `src/app/core/di/storage-initializer.ts`.

## Decisiones

- `signalStore` con `providedIn: 'root'` y `withState`/`withComputed`/`withMethods`: encaja con Angular 22 y signals-first; evita `@ngrx/store` clásico.
- Las claves de estado se exponen como `TASK_STATUS` constantes; nunca literales sueltos.
- `InMemoryRepository` vive en `src/app/data/repositories/` para tests; `IonicStorageTaskRepository` para producción.
- El filtro de `categoryId` distingue `null` (solo tareas sin categoría), `undefined` (sin filtro) y un id real.
- Alcance confirmado al reanudar C1: corregir la spec para describir el código existente; cero cambios productivos. `dispatch` y `clearCategory` sí actualizan `updatedAt` con el reloj.
- `clearCategory` no elimina tareas: solo desasocia.
- `dueDate` se compara con `clock.today()` (string) y no con `Date.now()` para evitar zonas horarias.

## Riesgos

- El driver SQLite requiere el entorno Cordova y su plugin. Las pruebas de store con repositorio en memoria no validan el driver nativo.
- `TASK_REPOSITORY` debe estar enlazado antes del primer `inject(TaskStore)`; el `storageInitializer` lo asegura en `main.ts`.
- Los métodos de `TaskStore` no son cancelables ni incluyen una cola de operaciones. C1 prueba operaciones secuenciales, sin prometer serialización.
- Las escrituras de `upsertMany` y `refresh` se ejecutan con `Promise.all`, sin transacción ni rollback. Si fallan, la vista del store no se actualiza, pero el repositorio puede contener escrituras parciales.
- Los tests nuevos prueban comportamiento ya implementado. No se declara un ciclo RED retroactivo ni se cambia la app para provocar fallos artificiales.

## Verificación

- `npm test` 30+ suites y 205+ tests en verde.
- `openspec validate tasks-crud --strict` OK.
- `npm run typecheck`, `npm run lint`, `npm run lint:styles`, `npm run format:check` y `npm run build -- --configuration production` exit 0.
- PR borrador abierto contra `develop`, fusionado solo tras revisión.

## Trazabilidad

| Requisito                   | Implementación                             | Test                                    |
| --------------------------- | ------------------------------------------ | --------------------------------------- |
| TSK-1 crear                 | `TaskStore.upsert`                         | `task.spec.ts`                          |
| TSK-2 actualizar            | `TaskStore.upsert` con misma id            | `task.spec.ts`                          |
| TSK-3 completar             | `TaskStore.dispatch(COMPLETE)`             | `task.spec.ts`                          |
| TSK-4 archivar              | `TaskStore.dispatch(ARCHIVE)`              | `task.spec.ts`                          |
| TSK-5 eliminar              | `TaskStore.remove`                         | `task.spec.ts`                          |
| TSK-6 asignar categoría     | `TaskStore.upsert` con `categoryId`        | `task.spec.ts`                          |
| TSK-7 filtrar por categoría | `TaskStore.setCategory`                    | `task.spec.ts`                          |
| TSK-8 persistencia          | `IonicStorageTaskRepository`               | `task.spec.ts` con `InMemoryRepository` |
| TSK-9 estados y ordenación  | `TaskStore.setStatuses`, `visibleTasks`    | `store/task.spec.ts`                    |
| TSK-10 errores y reintento  | `createOperationRunner`, `TaskStore.retry` | `store/task.spec.ts`                    |
