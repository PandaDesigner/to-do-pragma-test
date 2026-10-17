## ADDED Requirements

### Requirement: TSK-16 FAB anclado a la columna del notebook

`<ion-fab>` y `<ion-fab-button>` que abren el sheet de Nueva tarea MUST quedar anclados a la columna del notebook: `right: 50px` desde el borde derecho de `.notebook-page` y `bottom: calc(var(--app-pager-height) + 16px + env(safe-area-inset-bottom))`. No MUST usar la propiedad `left`. No MUST usar `slot="fixed"` para que el FAB no se coloque contra el viewport cuando el notebook está centrado. El icono MUST ser `<ion-icon name="add" aria-hidden="true">` y el `aria-label` MUST venir de la clave i18n `tasks.fab.new`.

#### Scenario: [TSK-16.1] El FAB está a la derecha

- **GIVEN** estoy en `/tabs/tasks` con viewport 375x812 o 1280x800
- **AND** el render aplica el cambio de layout
- **THEN** la regla CSS resuelta del `<ion-fab>` contiene `right: 50px`
- **AND** no contiene `left:` en la declaración del FAB
- **AND** la regla resuelve `bottom` con `var(--app-pager-height)` y un fallback ≥ 16 px

#### Scenario: [TSK-16.2] El FAB no tapa el paginador ni la última fila

- **GIVEN** la página tiene 45 tareas visibles (filtradas y paginadas)
- **WHEN** hago scroll hasta el final de la lista
- **THEN** la última fila se ve completa y queda a `>= 24 px` por encima del FAB
- **AND** el FAB queda por encima del paginador sin cruzarse porque `.task-list` lleva `padding-bottom: calc(var(--app-fab-size) + 24px)`

### Requirement: TSK-17 Paginación numérica solo cuando hace falta

El paginador numérico MUST mostrarse únicamente cuando la lista filtrada excede el tamaño de página (`pageCount > 1`). Cuando se muestra, su `position: sticky; bottom: 0` lo ancla al final del área visible de `.task-list` independientemente del scroll. La función pura `pageCount(total: number, size: number)` vive en `src/app/domain/pagination.ts` y devuelve `Math.ceil(total / size)` con `0` como caso base a `1` para no dividir entre cero.

#### Scenario Outline: [TSK-17.1] Cuándo aparece el paginador

- **GIVEN** hay `<total>` tareas visibles tras aplicar filtros
- **WHEN** consulto el resultado de `pageCount` y la rama de UI
- **THEN** el paginador `<visible>` con `<paginas>` páginas

  | total | visible   | paginas |
  | ----- | --------- | ------- |
  | 0     | no se ve  | 0       |
  | 20    | no se ve  | 1       |
  | 21    | se ve     | 2       |
  | 40    | se ve     | 2       |
  | 41    | se ve     | 3       |
  | 61    | se ve     | 4       |

#### Scenario: [TSK-17.2] Una página muestra como máximo 20 tareas

- **GIVEN** hay 41 tareas
- **WHEN** voy a la página 3
- **THEN** la lista muestra 1 tarea (41 − 2·20 = 1)
- **AND** el scroll del `.task-list` queda en `top: 0`

#### Scenario: [TSK-17.3] Filtrar reinicia la paginación

- **GIVEN** estoy en la página 2
- **WHEN** filtro por una categoría (o cambio estatus o sección)
- **THEN** el store vuelve a la página 1
- **AND** `pageCount` se recalcula sobre la lista filtrada

#### Scenario: [TSK-17.4] Borrar la última tarea de la última página

- **GIVEN** hay 21 tareas y estoy en la página 2
- **WHEN** borro esa tarea
- **THEN** paso a la página 1 automáticamente
- **AND** el paginador se oculta porque ahora `pageCount === 1`

### Requirement: TSK-18 Solo la lista hace scroll; header y paginador quedan fijos

El contenedor scrollable único MUST ser `.task-list`. `.notebook-page` es un flex column 100% dentro de `<ion-content [fullscreen]="false">`. El header (`<app-page-header>`) y el paginador (cuando existe) MUST tener `flex: none`. La posición del scroll MUST aislarse al `.task-list` para que ni header ni paginador se desplacen con el contenido.

#### Scenario: [TSK-18.1] Header y paginador no se mueven

- **GIVEN** la lista tiene ≥ 20 tareas en una pantalla de 812 px de alto
- **WHEN** hago scroll programático sobre `.task-list`
- **THEN** el header permanece en su posición original
- **AND** el paginador permanece anclado al fondo del área visible
- **AND** solo `.task-list` cambia su `scrollTop`
