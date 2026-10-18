# Verify — finish-remaining-ui

Fecha local: 2026-10-18. Rama de cierre `chore/archive-finish-remaining-ui`, sobre `develop` en `4341e9c` (merge del PR #44).

## Resultado

| Comando | Resultado |
| --- | --- |
| `npx jest --runInBand` | 55 suites, 492 tests, pass |
| `npx jest --runInBand --coverage` | pass, umbrales sin bajar |
| `npm run lint` | pass |
| `npm run lint:styles` | pass |
| `npm run format:check` | pass |
| `npm run typecheck` | pass |
| `npm run trace:check` | pass |
| `npx openspec validate --all --strict` | pass |
| `npm run build` | pass, con warnings de CommonJS y budget |

Cobertura de esta corrida: global 94.09 % statements, 87.9 % branches, 90.9 % functions, 93.96 % lines. Dominio 100 %. `store` y `shared` por encima de 90 %. No se bajaron umbrales ni se desactivó ninguna prueba.

## Cambio de alcance en el cierre

La spec de este change describía un gesto de puntero de 80 px con el id `SWIPE-02.1`. Ese gesto no existe en el código: la fila usa la opción final de `ion-item-sliding` desde `24d1016`, y `todo-screen` ya especifica ese comportamiento como `SWIPE-01.1` y `SWIPE-01.2`. El identificador `SWIPE-02.1` no aparecía en ningún `.spec.ts`, y `trace:check` pasaba solo porque la fila nunca se registró en la matriz.

La spec, el proposal y el design se reescribieron contra el código real. Se renombraron los requisitos a `FIN-01` a `FIN-04`, se conservaron `TODO-04.2` y `TODO-01.3` porque esos tests existen con ese nombre, y se añadió `I18N-01.3` para el rail en español. Se añadió `[FIN-01.1]` y `[I18N-01.3]` a las pruebas para que cada escenario tenga su identificador.

## Defecto encontrado y corregido en el cierre

La tarea 1.4 afirmaba que el rail, el shell, las categorías, el sheet, la fila y el editor leen sus etiquetas de los archivos de idioma, pero ningún test lo comprobaba. El test nuevo `src/app/core/settings/chrome-translations.spec.ts` falló contra el código real: los ocho `<option>` de duración (`15 min`, `1 h 15 min`, …), el enlace `Crear categoría` y los botones `Guardar cambios` / `Añadir tarea` / `Cancelar` del editor de tarea eran literales dentro de `tasks.page.html`.

Se corrigió en `bb9bbd3`: se añadieron `todo.editor.duration15` a `duration120`, más `newCategory`, `save`, `saveChanges` y `cancel` a `es.json` y `en.json`, y la plantilla los resuelve con el pipe. Los presets son lista fija y corta, así que una clave por valor es más simple que un pipe de formato.

## Evidencia visual

Ocho capturas en `evidence/`, todas a 375x812 exactas: `tasks-{light,dark}-{es,en}.png` y `tasks-notes-{light,dark}-{es,en}.png`. Son capturas de navegador del servidor `ng serve`, no de un simulador, y no son una diferencia de 2 px contra Figma. El nodo 4:617 conserva su fila de `registro` porque su marco no tiene comparación dentro de este change.

## Notion

No se actualizó. El conector de Notion no está autenticado en esta sesión, así que la tarea 2.5 sigue abierta y no se inventó fila.

## Reutilización

No se creó ningún componente nuevo en `shared`. `app-task-item` sigue siendo la única fila de tarea, nota y panel de pendientes: la variante de nota es un `input` más los estados que ya existían. El badge de hoy reutiliza el filtro del store en vez de un estado nuevo. El editor y el chrome siguen con `TranslatePipe`, y `DeletionConfirmation` sigue siendo la única vía de borrado.