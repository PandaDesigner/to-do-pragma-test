# tasks Specification

## Purpose
TBD - created by archiving change tasks-crud. Update Purpose after archive.
## Requirements
### Requirement: TSK-1 Crear tarea

`TaskStore.upsert(task)` MUST añadir una tarea nueva al estado y al repositorio.

#### Scenario: TSK-1.1 Persistir una tarea nueva

- **GIVEN** una tarea con `id` que no existe en el estado
- **WHEN** se llama `upsert`
- **THEN** la tarea queda en `store.tasks()` y en el repositorio
- **AND** `categoryId` se conserva si no es nulo

### Requirement: TSK-2 Actualizar tarea

`TaskStore.upsert(task)` con un `id` existente MUST reemplazar la versión anterior sin duplicar.

#### Scenario: TSK-2.1 Actualizar campos sin duplicar

- **GIVEN** una tarea con `id` ya presente en el estado
- **WHEN** se llama `upsert` con ese `id`
- **THEN** los campos se reemplazan
- **AND** solo hay una entrada en `store.tasks()`
- **AND** `updatedAt` conserva el valor entregado por el llamador; `upsert` no lo genera

### Requirement: TSK-3 Completar tarea

`TaskStore.dispatch(id, TASK_EVENT.COMPLETE)` MUST cambiar el estado a `COMPLETED` cuando la tarea está en `PENDING` u `OVERDUE`.

#### Scenario: TSK-3.1 Completar tarea pendiente o vencida

- **GIVEN** una tarea en `PENDING` o `OVERDUE`
- **WHEN** se llama `dispatch` con `TASK_EVENT.COMPLETE`
- **THEN** la tarea pasa a `COMPLETED`

#### Scenario: TSK-3.2 Rechazar completar tarea ya completada o archivada

- **GIVEN** una tarea en `COMPLETED` o `ARCHIVED`
- **WHEN** se llama `dispatch` con `TASK_EVENT.COMPLETE`
- **THEN** se lanza `InvalidTransitionError`

### Requirement: TSK-4 Archivar tarea

`TaskStore.dispatch(id, TASK_EVENT.ARCHIVE)` MUST cambiar el estado a `ARCHIVED` cuando la tarea está en `COMPLETED`.

#### Scenario: TSK-4.1 Archivar tarea completada

- **GIVEN** una tarea en `COMPLETED`
- **WHEN** se llama `dispatch` con `TASK_EVENT.ARCHIVE`
- **THEN** la tarea pasa a `ARCHIVED`

#### Scenario: TSK-4.2 Rechazar archivar tarea ya archivada

- **GIVEN** una tarea en `ARCHIVED`
- **WHEN** se llama `dispatch` con `TASK_EVENT.ARCHIVE`
- **THEN** se lanza `InvalidTransitionError`

### Requirement: TSK-5 Eliminar tarea

`TaskStore.remove(id)` MUST borrar la tarea del estado y del repositorio cuando existe.

#### Scenario: TSK-5.1 Eliminar tarea existente

- **GIVEN** una tarea con `id` presente en el estado
- **WHEN** se llama `remove`
- **THEN** la tarea no aparece en `store.tasks()`
- **AND** el repositorio no la contiene

#### Scenario: TSK-5.2 Eliminar tarea inexistente sin lanzar

- **GIVEN** un `id` que no existe en el estado
- **WHEN** se llama `remove`
- **THEN** no se lanza excepción
- **AND** el estado no se altera

### Requirement: TSK-6 Asignar categoría

Una tarea MUST llevar `categoryId` y SHALL poder desasignarse masivamente por categoría.

#### Scenario: TSK-6.1 Mantener categoría al persistir

- **GIVEN** una tarea con `categoryId` no nulo
- **WHEN** se llama `upsert`
- **THEN** la tarea persistida mantiene ese `categoryId`

#### Scenario: TSK-6.2 Limpiar categoría de un conjunto

- **GIVEN** tareas con varias categorías, incluida `'c1'`
- **WHEN** se llama `clearCategory('c1')`
- **THEN** solo las tareas con `categoryId === 'c1'` quedan con `categoryId = null`
- **AND** el resto conserva su categoría

### Requirement: TSK-7 Filtrar por categoría

`TaskStore.setCategory(categoryId)` MUST limitar `visibleTasks` a esa categoría.

#### Scenario: TSK-7.1 Filtrar por categoría concreta

- **GIVEN** tareas con categorías `'work'` y `'home'`
- **WHEN** se llama `setCategory('work')`
- **THEN** `store.visibleTasks()` solo contiene tareas con `categoryId === 'work'`

#### Scenario: TSK-7.2 Quitar el filtro

- **GIVEN** un filtro de categoría activo
- **WHEN** se llama `setCategory(undefined)`
- **THEN** `store.visibleTasks()` contiene todas las tareas que pasan el resto de filtros

#### Scenario: TSK-7.3 Filtrar tareas sin categoría

- **GIVEN** tareas con categoría y tareas con `categoryId = null`
- **WHEN** se llama `setCategory(null)`
- **THEN** `store.visibleTasks()` solo contiene tareas sin categoría que pasan el resto de filtros

### Requirement: TSK-8 Persistencia

Las tareas MUST guardarse y cargarse a través de `TASK_REPOSITORY`.

#### Scenario: TSK-8.1 Guardar al crear o actualizar

- **GIVEN** el repositorio inyectado
- **WHEN** se llama `upsert` o `upsertMany`
- **THEN** el repositorio recibe las tareas con `save`

#### Scenario: TSK-8.2 Borrar del repositorio

- **GIVEN** una tarea existente
- **WHEN** se llama `remove`
- **THEN** el repositorio recibe la orden de borrado por id

#### Scenario: TSK-8.3 Refrescar y expirar pendientes

- **GIVEN** el repositorio con tareas, algunas `PENDING` con `dueDate < clock.today()`
- **WHEN** se llama `refresh`
- **THEN** el repositorio devuelve la lista
- **AND** esas tareas pasan a `OVERDUE`
- **AND** el repositorio persiste el cambio

### Requirement: TSK-9 Filtro por estado y ordenación

`TaskStore.setStatuses(statuses)` y `sortTasksByDueDate` MUST actuar sobre `visibleTasks`.

#### Scenario: TSK-9.1 Filtrar por estado

- **GIVEN** tareas en varios estados
- **WHEN** se llama `setStatuses([COMPLETED])`
- **THEN** `store.visibleTasks()` solo contiene tareas en `COMPLETED`

#### Scenario: TSK-9.2 Ordenación por fecha de vencimiento

- **GIVEN** tareas con `dueDate` distintas
- **WHEN** se consultan sin filtro adicional
- **THEN** `store.visibleTasks()` las devuelve ordenadas por `dueDate` ascendente

### Requirement: TSK-10 Manejo de errores

Los fallos del repositorio MUST exponerse sin alterar `store.tasks()` y MUST permitir reintentar la última operación fallida. No se garantiza una transacción de repositorio en operaciones de varias escrituras: una escritura anterior puede haber terminado antes del fallo de otra.

#### Scenario: TSK-10.1 Error de persistencia no altera el estado

- **GIVEN** el repositorio que lanza al guardar
- **WHEN** se llama `upsert`
- **THEN** `store.error()` expone el mensaje
- **AND** `store.tasks()` no cambia
- **AND** `store.busy()` vuelve a `false`

#### Scenario: TSK-10.2 Retry limpia el error

- **GIVEN** un error pendiente en el store
- **WHEN** se llama `store.retry()` y la operación tiene éxito
- **THEN** `store.error()` queda en `null`
