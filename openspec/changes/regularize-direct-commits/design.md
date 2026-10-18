## Context

Los 18 commits ya están en `origin/develop`. El usuario pidió documentarlos, no revertirlos.

## Commits

Sheets:

- `c2fca8d` present task and category editors as sheets
- `b651cee` open editor sheets at full height
- `82635c4` open editor sheets at 80 percent
- `aa4d3b7` open editor sheets at 90 percent

Lista y paginador:

- `72050b0` page the task list with infinite scroll
- `4805d67` enable debug actions in development
- `8c3cb1d` bound task infinite scroll to the pager slot
- `39041d1` cap the task scroll viewport at 60vw
- `6a38dab` page the task list twenty rows at a time
- `7d14419` separate the task scroll well from the filters
- `b69fa1f` show the task pager under the scroll well
- `db783ea` pin the task pager below the add button
- `2c1e409` keep the task pager on one fixed row

Fila:

- `323b8cf` keep every task row one line and drop the inline delete
- `8bedb02` pin task actions to the end of the row
- `af90c4e` keep the task copy column fixed and mark overflow
- `42ff551` strike completed titles and tail overflow with three letters
- `cffd11e` strike the completed title inside the task copy

## Decisions

- El estado vigente del sheet es 90 % (`initialBreakpoint` 0.9, `breakpoints` [0, 0.5, 0.9], `handleBehavior` cycle). Los commits de 100 % y 80 % quedaron reemplazados por `aa4d3b7`.
- `39041d1` dice 60vw en el mensaje. El CSS vigente es `60vh`. No se toca.
- `SWIPE-01.1` no se reutiliza para el swipe por puntero de `finish-remaining-ui`. Ese id ya es la opción `ion-item-option`. El escenario de puntero queda en `SWIPE-02.1`.
- El debug de desarrollo sigue porque `environment.ts` tiene `production: false`. La build de producción lo reemplaza. Eso lo cubre `firebase-env-production`, no este change.
- Un requisito y su escenario pueden compartir el id padre (`RC-01`). `SPEC-01.1` solo falla si el mismo id de requisito, o el mismo id de escenario, está definido dos veces.
- Excepciones de `SPEC-01.2`, títulos de test sin cabecera de spec: `DATA-SEC-01.1`, `NAV-SEC-01.1`, `NAV-SEC-01.2`, `NAV-SEC-01.3`, `CAT-SEC-02.1`, `NAV-SEC-02.1`, `SET-02.2`, `SHEET-05.5`, `FAB-01.1`, `FAB-01.2`, `FAB-01.3`, `FAB-01.4`, `TSK-19.2`. No se inventaron specs para ellos en este change.

## Figma

No se midió el nodo `4:440` en esta pasada. El comportamiento no se modificó. Si el sheet al 90 % o el pozo de `60vh` contradicen el frame, queda anotado para una decisión posterior. No hay corrección en este change.

## Rollback

Borrar este change y revertir el renombre `TODO-12` / `SWIPE-02.1` devolvería los ids duplicados. No revierte los 18 commits.
