## ADDED Requirements

### Requirement: APP-01 Modelos y transiciones de tareas

La app MUST definir el modelo `Task` de `docs/PROMPT.md`: `dueDate` como día calendario, `categoryId: string | null`, `createdAt`, `updatedAt` y metadatos opcionales de hora, duración y recordatorio. `TaskStatus` MUST soportar `pending`, `completed`, `overdue` y `archived`. Los contratos y `InvalidTransitionError` MUST vivir en dominio puro; las clases State y `TaskStateMachine` MUST vivir en `data/states/`, sin tabla de destinos. `transitionTask` MUST recibir `{ task, event, clock }` y delegar en la máquina. No se requiere compatibilidad con `dueAt` ni datos del modelo anterior.

#### Scenario: APP-01-A Transición válida

- **GIVEN** una tarea con `status: 'pending'`
- **WHEN** se invoca `transitionTask({ task, event: 'COMPLETE', clock })`
- **THEN** devuelve un objeto nuevo con `status: 'completed'` y `updatedAt = clock.now()`, sin mutar la tarea original.

#### Scenario: APP-01-B Transición inválida

- **GIVEN** una tarea con `status: 'archived'`
- **WHEN** se invoca `transitionTask({ task, event: 'COMPLETE', clock })`
- **THEN** lanza `InvalidTransitionError` con mensaje `Invalid task transition: archived + COMPLETE`, sin mutar la tarea.

#### Scenario: APP-01-C Todas las transiciones documentadas

- **GIVEN** los cuatro estados y los seis eventos COMPLETE, EXPIRE, ARCHIVE, REOPEN, RESCHEDULE y RESTORE
- **WHEN** se prueban las 24 combinaciones
- **THEN** solo se permiten las nueve transiciones de `docs/PROMPT.md`, incluidas pending/completed a archived y archived a pending.
- **AND** cada transición válida devuelve un objeto nuevo y actualiza `updatedAt` con el reloj inyectado.

#### Scenario: APP-01-D Guard de vencimiento y reprogramación

- **GIVEN** una tarea pending con `dueDate` igual o posterior a `clock.today()`
- **WHEN** se despacha EXPIRE
- **THEN** lanza `InvalidTransitionError`; solo puede expirar cuando `dueDate < clock.today()`.
- **AND** RESCHEDULE desde overdue cambia `dueDate` al día local del reloj y el estado a pending.

### Requirement: APP-02 Categorías con kinds

`Category` MUST incluir `icon` y `colorToken`, exponer `CategoryKind` (`daily`, `shopping`, `list`) y validar con `isCategoryKind`. Valores desconocidos MUST devolver `false`.

#### Scenario: APP-02-A Kinds soportados

- **GIVEN** un valor `kind: 'daily' | 'shopping' | 'list'`
- **WHEN** se consulta `isCategoryKind`
- **THEN** devuelve `true`.
- **AND** un valor desconocido devuelve `false`.

### Requirement: APP-03 Estrategias de tareas

`filterTasks` y `sortTasksByDueDate` MUST ser funciones puras en `src/app/domain/`. `filterTasks` MUST aceptar un conjunto de estados y un `categoryId` opcional: omitido no filtra por categoría, `null` selecciona tareas sin categoría. Entradas vacías, estados vacíos y categorías inexistentes MUST devolver una colección vacía sin mutar la entrada. `sortTasksByDueDate` MUST ordenar por `dueDate` ascendente sin modificar la entrada; todas las tareas tienen fecha según el modelo canónico.

#### Scenario: APP-03-A Filtro combinado

- **GIVEN** tareas y un filtro `{ statuses: ['pending', 'overdue'], categoryId: 'cat-1' }`
- **WHEN** se invoca `filterTasks`
- **THEN** devuelve solo las tareas que cumplen el conjunto de estados y la categoría.

#### Scenario: APP-03-B Orden por fecha

- **GIVEN** tareas con `dueDate`
- **WHEN** se invoca `sortTasksByDueDate` con `{ kind: 'dueDate' }`
- **THEN** ordena por `dueDate` ascendente y mantiene el orden relativo entre fechas iguales.

### Requirement: APP-04 Puertos de repositorio

`TASK_REPOSITORY` y `CATEGORY_REPOSITORY` MUST ser `InjectionToken` que exponen un contrato `list/save/remove`. Los repositorios de infraestructura MUST satisfacer ese contrato sin salteralo.

#### Scenario: APP-04-A Contrato satisfecho

- **GIVEN** una implementación in-memory
- **WHEN** se ejecuta `repository.spec.ts`
- **THEN** las pruebas confirman `list` tras `save`, `remove` y la distinción de tokens.

### Requirement: APP-05 Persistencia con debounce

`IonicStorageTaskRepository` MUST guardar la lista completa de tareas en `cordova-sqlite-storage` con debounce 300 ms. Una ráfaga de `save` consecutivos MUST producir una sola escritura.

#### Scenario: APP-05-A Escritura con debounce

- **GIVEN** el repositorio inicializado
- **WHEN** se invocan tres `save` consecutivos en menos de 300 ms
- **THEN** se realiza una sola escritura tras 300 ms.
- **AND** la lista final contiene las tres tareas.

### Requirement: APP-06 Stores con @ngrx/signals

`TaskStore` y `CategoryStore` MUST exponer el estado como `Signal`, `refresh`, `upsert`, `remove` y `setStatuses` (solo `TaskStore`). Los stores MUST delegar la persistencia a los repositorios.

#### Scenario: APP-06-A Refresco de tareas

- **GIVEN** el repositorio con dos tareas
- **WHEN** se invoca `TaskStore.refresh()`
- **THEN** `tasks()` y `visibleTasks()` reflejan las dos tareas filtradas por defecto (`pending` y `overdue`).

#### Scenario: APP-06-B Cambio de filtro

- **GIVEN** el store con tareas `pending` y `completed`
- **WHEN** se invoca `setStatuses(['completed'])`
- **THEN** `visibleTasks()` contiene solo las tareas `completed`.

### Requirement: APP-07 RemoteConfig con flag enable_categories

`RemoteConfigService.isCategoriesEnabled(port, timeoutMs = 3000)` MUST resolver `true` por defecto si la consulta tarda más que `timeoutMs` o si la clave no existe. El flag MUST ser `false` solo cuando la consulta responde con `false` explícito.

#### Scenario: APP-07-A Default por timeout

- **GIVEN** un `port.fetch()` que nunca resuelve
- **WHEN** se invoca `isCategoriesEnabled(port, 10)`
- **THEN** resuelve `true` por timeout.

#### Scenario: APP-07-B Flag explícito en false

- **GIVEN** un `port.fetch()` que devuelve `{ enable_categories: false }`
- **WHEN** se invoca `isCategoriesEnabled(port, 10)`
- **THEN** resuelve `false`.

### Requirement: APP-08 Decoradores @Debounce y @LogAction

`@Debounce(ms)` MUST coalescer llamadas por instancia y `independent` entre instancias. `@LogAction` MUST registrar nombre y argumentos en consola.

#### Scenario: APP-08-A Debounce independiente

- **GIVEN** dos instancias independientes de una clase con `@Debounce(20)`
- **WHEN** se llama a sus métodos `fire` con valores distintos
- **THEN** cada instancia invoca el callback original con su último valor.

### Requirement: APP-09 Páginas tasks y categories con OnPush y trackBy

Las páginas `tasks` y `categories` MUST ser standalone con `OnPush`, usar `trackBy: trackById` y aplicar virtual scroll de CDK a partir de 200 tareas.

#### Scenario: APP-09-A Virtualización

- **GIVEN** la página `tasks` con 5 tareas
- **WHEN** `shouldVirtualize()` evalúa
- **THEN** devuelve `false` y se renderiza con `@for`.
- **WHEN** se generan 5.000 tareas
- **THEN** `shouldVirtualize()` devuelve `true` y se renderiza con `cdk-virtual-scroll-viewport`.

### Requirement: APP-10 Feature flag enable_categories en UI

Cuando `enable_categories` es `false`, la pestaña "Mis listas" y los chips de categoría MUST ocultarse; la pestaña "Todas" sigue mostrando todas las tareas.

#### Scenario: APP-10-A Flag en false

- **GIVEN** el shell con `enable_categories: false`
- **WHEN** se renderiza
- **THEN** la pestaña "Mis listas" no aparece.
- **AND** las tareas no muestran chip de categoría.

### Requirement: APP-11 Botón debug 5.000 tareas

La página `tasks` MUST exponer un botón que genera 5.000 tareas pendientes en bloque.

#### Scenario: APP-11-A Generación masiva

- **GIVEN** la página `tasks`
- **WHEN** se invoca `generateFiveThousand()`
- **THEN** `tasks()` pasa a tener 5.005 tareas y `shouldVirtualize()` devuelve `true`.

### Requirement: APP-12 Cobertura por capa y CI

`jest.config.cjs` MUST configurar thresholds: 80% global, 95% `src/app/domain/**`, 90% `src/app/data/**` y 90% `src/app/store/**`. El workflow CI MUST ejecutar `npm test -- --coverage` y fallar si los thresholds no se cumplen.

#### Scenario: APP-12-A Umbrales aplicados

- **GIVEN** los thresholds configurados
- **WHEN** se ejecuta `npm test -- --coverage`
- **THEN** la cobertura cumple los porcentajes por capa.

### Requirement: APP-13 README con respuestas del PDF y guía nativa

`README.md` MUST responder a las 3 preguntas del PDF: retos encontrados, optimizaciones de rendimiento aplicadas, y decisiones de calidad/mantenibilidad. MUST incluir una sección de build nativo para APK firmado e IPA con los comandos exactos y la configuración de firma sin secretos versionados. La entrega MUST producir ambos artefactos; la documentación no sustituye su generación.

#### Scenario: APP-13-A README verificable

- **GIVEN** `README.md` final
- **WHEN** se busca `## Retos`, `## Optimizaciones`, `## Calidad y mantenibilidad` y `## Build nativo`
- **THEN** las cuatro secciones existen.
