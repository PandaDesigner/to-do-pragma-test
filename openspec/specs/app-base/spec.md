# app-base Specification

## Purpose

App funcional de Todo Notebook sobre el scaffolding de `init`. Cubre los dominios de tareas y categorías, estrategias pure de filtrado y orden, puertos de repositorio, persistencia local con Ionic Storage + driver SQLite, stores con `@ngrx/signals`, feature flag `enable_categories` vía Firebase Remote Config, decoradores `@Debounce` y `@LogAction`, UI con tabs, virtual scroll desde 200 tareas y botón de generación masiva de 5.000 tareas. Las versiones firmadas de Android e iOS quedan fuera.

## Requirements
### Requirement: APP-01 Modelos y transiciones de tareas

La app MUST definir `Task` con `TaskStatus` (`pending`, `completed`, `overdue`, `archived`) y transiciones explícitas en `transitionTask`. Transiciones inválidas MUST lanzar error con mensaje claro.

#### Scenario: APP-01-A Transición válida

- **GIVEN** una tarea con `status: 'pending'`
- **WHEN** se invoca `transitionTask(task, 'completed')`
- **THEN** devuelve un objeto nuevo con `status: 'completed'`.

#### Scenario: APP-01-B Transición inválida

- **GIVEN** una tarea con `status: 'archived'`
- **WHEN** se invoca `transitionTask(task, 'completed')`
- **THEN** lanza `Invalid task transition: archived -> completed`.

### Requirement: APP-02 Categorías con kinds

`Category` MUST exponer `CategoryKind` (`daily`, `shopping`, `default`) y validar con `isCategoryKind`. Valores desconocidos MUST devolver `false`.

#### Scenario: APP-02-A Kinds soportados

- **GIVEN** un valor `kind: 'daily' | 'shopping' | 'default'`
- **WHEN** se consulta `isCategoryKind`
- **THEN** devuelve `true`.
- **AND** un valor desconocido devuelve `false`.

### Requirement: APP-03 Estrategias de tareas

`filterTasks` y `sortTasksByDueAt` MUST ser funciones pure en `src/app/domain/`. `filterTasks` MUST aceptar un conjunto de estados y un `categoryId` opcional. `sortTasksByDueAt` MUST ordenar por `dueAt` ascendente y colocar al final las tareas sin fecha.

#### Scenario: APP-03-A Filtro combinado

- **GIVEN** tareas y un filtro `{ statuses: ['pending', 'overdue'], categoryId: 'cat-1' }`
- **WHEN** se invoca `filterTasks`
- **THEN** devuelve solo las tareas que cumplen el conjunto de estados y la categoría.

#### Scenario: APP-03-B Orden por fecha

- **GIVEN** tareas con y sin `dueAt`
- **WHEN** se invoca `sortTasksByDueAt` con `{ kind: 'dueAt' }`
- **THEN** ordena por `dueAt` ascendente y deja al final las tareas sin fecha.

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

`README.md` MUST responder a las 3 preguntas del PDF: retos encontrados, optimizaciones de rendimiento aplicadas, y decisiones de calidad/mantenibilidad. MUST incluir una sección de build nativo para APK e IPA con los comandos exactos, documentando la ausencia de firma.

#### Scenario: APP-13-A README verificable

- **GIVEN** `README.md` final
- **WHEN** se busca `## Retos`, `## Optimizaciones`, `## Calidad y mantenibilidad` y `## Build nativo`
- **THEN** las cuatro secciones existen.

