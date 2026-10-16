## ADDED Requirements

### Requirement: INIT-06 Modelos y estado de dominio

Los modelos `Task` y `Category` MUST definir tipos puros con campos mínimos (id, title/name, status, kind) y transiciones de estado explícitas para tareas. Los datos MUST validarse en el límite del dominio; las capas exteriores confían en esa validación. Las transiciones inválidas MUST lanzar un error con mensaje explícito.

#### Scenario: INIT-06-A Estados de tarea

- **GIVEN** una tarea con `status: pending`
- **WHEN** se invoca `transitionTask(task, 'completed')`
- **THEN** devuelve un objeto nuevo con `status: completed` y la transición se acepta.
- **WHEN** se invoca `transitionTask(task, 'archived')`
- **THEN** lanza `Invalid task transition: pending -> archived`.

#### Scenario: INIT-06-B Categorías y kinds

- **GIVEN** un valor desconocido, p. ej. `kind: 'work'`
- **WHEN** se consulta `isCategoryKind`
- **THEN** devuelve `false`.
- **AND** los kinds permitidos son `daily`, `shopping`, `default`.

### Requirement: INIT-07 Estrategias de tareas

Las funciones puras de filtro y orden MUST vivir en `src/app/domain/` y depender solo de tipos del dominio. MUST permitir filtrar por un conjunto de estados y por id de categoría, y ordenar por `dueAt` con tareas sin fecha al final.

#### Scenario: INIT-07-A Filtro y orden combinados

- **GIVEN** una colección de tareas y un filtro `{ statuses: ['pending', 'overdue'], categoryId: 'cat-1' }`
- **WHEN** se invoca `filterTasks`
- **THEN** devuelve únicamente las tareas que cumplen el conjunto de estados y la categoría.
- **WHEN** se invoca `sortTasksByDueAt` con `{ kind: 'dueAt' }`
- **THEN** las tareas con `dueAt` se ordenan ascendente y las que no tienen fecha van al final.

### Requirement: INIT-08 Puertos de repositorios

`TASK_REPOSITORY` y `CATEGORY_REPOSITORY` MUST ser `InjectionToken` que exponen un contrato `list/save/remove`. Las implementaciones de dominio MUST satisfacer ese contrato; los repositorios de infraestructura no pueden saltárselo.

#### Scenario: INIT-08-A Contrato satisfecho

- **GIVEN** una implementación de prueba del contrato
- **WHEN** se ejecuta `repository.spec.ts`
- **THEN** las pruebas confirman `list` tras `save`, `remove` y distinción de tokens.

El proyecto MUST usar Ionic 8, Angular standalone 18 o superior compatible con Node, TypeScript strict y un lockfile npm. MUST instalar SignalStore, Ionic Storage, driver SQLite, Firebase y CDK sin activar servicios externos. MUST conservar `docs/` y OpenSpec.

#### Scenario: INIT-01-A Instalación limpia

- **GIVEN** una copia del repositorio con la versión de Node documentada
- **WHEN** se ejecuta `npm ci`
- **THEN** las dependencias se instalan sin ignorar conflictos de peer dependencies.

### Requirement: INIT-02 Cordova sin Capacitor

La configuración MUST habilitar Cordova, incluir CLI local y plugin SQLite, y excluir dependencias Capacitor. Las plataformas generadas MUST quedar fuera de Git.

#### Scenario: INIT-02-A Integración elegida

- **GIVEN** la configuración inicial
- **WHEN** se ejecutan los tests de configuración
- **THEN** confirman Cordova, identificador de app y plugin SQLite sin Capacitor.

### Requirement: INIT-03 Arranque mínimo

La app MUST montar `ion-app`, resolver la ruta inicial mediante carga diferida y mostrar una página mínima de Todo Notebook. Sus componentes MUST ser standalone y OnPush. No MUST afirmar funcionalidad CRUD todavía inexistente.

#### Scenario: INIT-03-A Página inicial

- **GIVEN** el componente raíz y las rutas configuradas
- **WHEN** se monta la app y se abre la ruta inicial
- **THEN** existe el contenedor Ionic y se muestra Todo Notebook sin requerir credenciales Firebase.

### Requirement: INIT-04 Calidad antes de publicar

El proyecto MUST ofrecer comandos de tests Jest sin navegador, lint, formato, tipos y build de producción. Los alias de capas MUST coincidir con la guía. La configuración propia MUST desarrollarse con un fallo observado antes de su implementación; el scaffolding generado se valida sin atribuirle TDD retroactivo.

#### Scenario: INIT-04-A Verificación local y CI

- **GIVEN** dependencias instaladas
- **WHEN** se ejecutan los comandos documentados
- **THEN** pruebas, lint, formato, tipos y build pasan; CI repite estos controles para PR a develop y main.

#### Scenario: INIT-04-B Prueba de configuración detecta regresión

- **GIVEN** el test de configuración y una integración Cordova ausente
- **WHEN** se ejecuta ese test antes de configurar la integración
- **THEN** falla por el requisito ausente y pasa después de implementarlo.

### Requirement: INIT-05 Publicación trazable y segura

Git MUST usar `main`, `develop` y `feature/init` con historia común y remoto HTTPS al repositorio público autorizado. El PR MUST apuntar a `develop`, enlazar este cambio y detallar escenarios, comprobaciones y limitaciones. MUST excluir dependencias instaladas, builds, entornos privados y credenciales.

#### Scenario: INIT-05-A Avance publicado

- **GIVEN** el repositorio público PandaDesigner/to-do-pragma-test
- **WHEN** se publica el cambio init
- **THEN** las ramas remotas existen y un PR feature/init hacia develop describe INIT-01 a INIT-05 y su evidencia.

#### Scenario: INIT-05-B Entornos privados excluidos

- **GIVEN** archivos locales de entorno y plataformas generadas
- **WHEN** se comprueba la lista de archivos versionados
- **THEN** no incluye esos archivos ni secretos; incluye ejemplos sin credenciales.
