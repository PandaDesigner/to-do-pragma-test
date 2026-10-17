# Spec: tasks (C1)

## ADDED Requirements

### Requirement: TSK-1 Crear tarea

`TaskStore.upsert(task)` MUST añadir una tarea nueva al estado y al repositorio.

#### Scenario: Persistir una tarea nueva

- **GIVEN** una tarea con `id` que no existe en el estado
- **WHEN** se llama `upsert`
- **THEN** la tarea queda en `store.tasks()` y en el repositorio
- **AND** `categoryId` se conserva si no es nulo

### Requirement: TSK-2 Actualizar tarea

`TaskStore.upsert(task)` con un `id` existente MUST reemplazar la versión anterior sin duplicar.

#### Scenario: Actualizar campos sin duplicar

- **GIVEN** una tarea con `id` ya presente en el estado
- **WHEN** se llama `upsert` con ese `id`
- **THEN** los campos se reemplazan
- **AND** solo hay una entrada en `store.tasks()`
- **AND** `updatedAt` pasa al reloj inyectado

### Requirement: TSK-3 Completar tarea

`TaskStore.dispatch(id, TASK_EVENT.COMPLETE)` MUST cambiar el estado a `COMPLETED` cuando la tarea está en `PENDING` u `OVERDUE`.

#### Scenario: Completar tarea pendiente o vencida

- **GIVEN** una tarea en `PENDING` o `OVERDUE`
- **WHEN** se llama `dispatch` con `TASK_EVENT.COMPLETE`
- **THEN** la tarea pasa a `COMPLETED`

#### Scenario: Rechazar completar tarea ya completada o archivada

- **GIVEN** una tarea en `COMPLETED` o `ARCHIVED`
- **WHEN** se llama `dispatch` con `TASK_EVENT.COMPLETE`
- **THEN** se lanza `InvalidTransitionError`

### Requirement: TSK-4 Archivar tarea

`TaskStore.dispatch(id, TASK_EVENT.ARCHIVE)` MUST cambiar el estado a `ARCHIVED` cuando la tarea está en `COMPLETED`.

#### Scenario: Archivar tarea completada

- **GIVEN** una tarea en `COMPLETED`
- **WHEN** se llama `dispatch` con `TASK_EVENT.ARCHIVE`
- **THEN** la tarea pasa a `ARCHIVED`

#### Scenario: Rechazar archivar tarea ya archivada

- **GIVEN** una tarea en `ARCHIVED`
- **WHEN** se llama `dispatch` con `TASK_EVENT.ARCHIVE`
- **THEN** se lanza `InvalidTransitionError`

### Requirement: TSK-5 Eliminar tarea

`TaskStore.remove(id)` MUST borrar la tarea del estado y del repositorio cuando existe.

#### Scenario: Eliminar tarea existente

- **GIVEN** una tarea con `id` presente en el estado
- **WHEN** se llama `remove`
- **THEN** la tarea no aparece en `store.tasks()`
- **AND** el repositorio no la contiene

#### Scenario: Eliminar tarea inexistente sin lanzar

- **GIVEN** un `id` que no existe en el estado
- **WHEN** se llama `remove`
- **THEN** no se lanza excepción
- **AND** el estado no se altera

### Requirement: TSK-6 Asignar categoría

Una tarea MUST llevar `categoryId` y SHALL poder desasignarse masivamente por categoría.

#### Scenario: Mantener categoría al persistir

- **GIVEN** una tarea con `categoryId` no nulo
- **WHEN** se llama `upsert`
- **THEN** la tarea persistida mantiene ese `categoryId`

#### Scenario: Limpiar categoría de un conjunto

- **GIVEN** tareas con varias categorías, incluida `'c1'`
- **WHEN** se llama `clearCategory('c1')`
- **THEN** solo las tareas con `categoryId === 'c1'` quedan con `categoryId = null`
- **AND** el resto conserva su categoría

### Requirement: TSK-7 Filtrar por categoría

`TaskStore.setCategory(categoryId)` MUST limitar `visibleTasks` a esa categoría.

#### Scenario: Filtrar por categoría concreta

- **GIVEN** tareas con categorías `'work'` y `'home'`
- **WHEN** se llama `setCategory('work')`
- **THEN** `store.visibleTasks()` solo contiene tareas con `categoryId === 'work'`

#### Scenario: Quitar el filtro

- **GIVEN** un filtro de categoría activo
- **WHEN** se llama `setCategory(null)` o `setCategory(undefined)`
- **THEN** `store.visibleTasks()` contiene todas las tareas que pasan el resto de filtros

### Requirement: TSK-8 Persistencia

Las tareas MUST guardarse y cargarse a través de `TASK_REPOSITORY`.

#### Scenario: Guardar al crear o actualizar

- **GIVEN** el repositorio inyectado
- **WHEN** se llama `upsert` o `upsertMany`
- **THEN** el repositorio recibe las tareas con `save`

#### Scenario: Borrar del repositorio

- **GIVEN** una tarea existente
- **WHEN** se llama `remove`
- **THEN** el repositorio recibe la orden de borrado por id

#### Scenario: Refrescar y expirar pendientes

- **GIVEN** el repositorio con tareas, algunas `PENDING` con `dueDate < clock.today()`
- **WHEN** se llama `refresh`
- **THEN** el repositorio devuelve la lista
- **AND** esas tareas pasan a `OVERDUE`
- **AND** el repositorio persiste el cambio

### Requirement: TSK-9 Filtro por estado y ordenación

`TaskStore.setStatuses(statuses)` y `sortTasksByDueDate` MUST actuar sobre `visibleTasks`.

#### Scenario: Filtrar por estado

- **GIVEN** tareas en varios estados
- **WHEN** se llama `setStatuses([COMPLETED])`
- **THEN** `store.visibleTasks()` solo contiene tareas en `COMPLETED`

#### Scenario: Ordenación por fecha de vencimiento

- **GIVEN** tareas con `dueDate` distintas
- **WHEN** se consultan sin filtro adicional
- **THEN** `store.visibleTasks()` las devuelve ordenadas por `dueDate` ascendente

### Requirement: TSK-10 Manejo de errores

Los fallos del repositorio MUST exponerse sin alterar el estado ni perder la última operación.

#### Scenario: Error de persistencia no altera el estado

- **GIVEN** el repositorio que lanza al guardar
- **WHEN** se llama `upsert`
- **THEN** `store.error()` expone el mensaje
- **AND** `store.tasks()` no cambia
- **AND** `store.busy()` vuelve a `false`

#### Scenario: Retry limpia el error

- **GIVEN** un error pendiente en el store
- **WHEN** se llama `store.retry()` y la operación tiene éxito
- **THEN** `store.error()` queda en `null`

## Escenario e2e

Cubierto en `src/app/store/task.spec.ts` con `InMemoryRepository<Task>` y `CLOCK` fijos:

1. Crear dos tareas: una con `categoryId = 'work'`, otra con `categoryId = 'home'`.
2. Completar la de `work`.
3. Filtrar por `work`: solo aparece la completada.
4. Filtrar por `home`: solo aparece la pendiente.
5. Quitar el filtro: aparecen las dos, ordenadas por `dueDate`.
