# theme-foundation: informe de bloqueo

Fecha: 2026-10-16 18:16 COT.
Estado: bloqueado antes de implementar. artifact_store = openspec.

## Prerrequisitos ausentes

No están disponibles `docs/workflow-mcp.md`, la rama `feature/theme-foundation` ni los artefactos aprobados `proposal.md`, `design.md`, `tasks.md` y `specs/` del cambio. No se pueden determinar las tareas ni aplicar la tabla de valores Figma sin inventarlos.

## Comandos ejecutados y salida

`pwd`:

```text
/Volumes/Disco Mac/Develop/ionic/pragma/to-do-pragma-test
```

`git status --short --branch` al iniciar:

```text
## develop...origin/develop
?? openspec/changes/archive/
?? openspec/changes/openspec-cleanup/
?? openspec/specs/project-bootstrap/
```

`git branch --all`: ejecutado correctamente; rama activa `develop`, sin rama local ni referencia remota `feature/theme-foundation`.

`git ls-remote --heads origin feature/theme-foundation`: terminó correctamente, sin salida; el remoto no anunció esa rama.

`git worktree list`:

```text
/Volumes/Disco Mac/Develop/ionic/pragma/to-do-pragma-test fd4122d [develop]
```

Comprobación de existencia con `test -e`:

```text
AUSENTE docs/workflow-mcp.md
AUSENTE openspec/changes/theme-foundation/proposal.md
AUSENTE openspec/changes/theme-foundation/design.md
AUSENTE openspec/changes/theme-foundation/tasks.md
AUSENTE openspec/changes/theme-foundation/specs
```

La lectura de `docs/workflow-mcp.md` devolvió ENOENT.

## Tareas y verificaciones

Ninguna tarea marcada. Las tareas solicitadas 1.1 a 6.3 quedan pendientes porque falta `tasks.md` y el diseño obligatorio. No se ejecutaron ciclos RED/GREEN/REFACTOR ni se modificó código.

Comandos no ejecutados durante la comprobación inicial por bloqueo previo a la implementación (ver ejecución posterior abajo):

- `npx jest <ruta>`: falta la definición de cada tarea.
- `npm test -- --coverage`
- `npm run lint`
- `npm run lint:styles`
- `npm run format:check`
- `npm run typecheck`
- `npm run build -- --configuration production`

No se generaron capturas de la aplicación ni de Figma. No hay evidencia visual ni resultados de validación que puedan declararse aprobados.

## Seguimiento inicial (histórico)

Inicio registrado mediante MCP Notion en C0.5, fila `3fbcb4419773815db397fe4678dec2f0`. Status quedó en Blocked y se añadió el motivo a Note, preservando el texto anterior.

No se crearon commits ni PR. No se cambiaron plataformas, configuraciones, proposal, design o specs existentes. Los archivos no rastreados preexistentes se conservaron. Este informe es el único archivo creado por esta ejecución y queda sin commit sobre `develop`.

Para continuar: hacer disponible la rama aprobada con sus artefactos y `docs/workflow-mcp.md` en este repositorio.

## Revisión y comprobaciones posteriores

Se reconfirmó la ausencia de la rama remota, workflow, design y tasks. Este es un snapshot de la sub-ejecución previa a la reanudación autorizada. En ella no se introdujeron funciones ni código de la aplicación; los contratos introducidos llegan después, en specs/ui-shell/spec.md (UI-20 a UI-28). No se refactorizó código ajeno.

Comprobaciones ejecutadas el 2026-10-16, aproximadamente 18:17 COT, sobre el estado existente de develop; no verifican la implementación pendiente de theme-foundation:

| Comando                                                                                | Resultado real                                                                                                          | Log completo local                   |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `npx --no-install prettier --check openspec/changes/theme-foundation/verify-report.md` | Exit 0: All matched files use Prettier code style!                                                                      | `/tmp/theme-foundation-check.EieYox` |
| `npm run lint`                                                                         | Exit 0: All files pass linting.                                                                                         | `/tmp/theme-foundation-check.jqzvlz` |
| `npm run lint:styles`                                                                  | Exit 1: Missing script: "lint:styles"                                                                                   | `/tmp/theme-foundation-check.L02rtt` |
| `npm run format:check`                                                                 | Exit 0: All matched files use Prettier code style!                                                                      | `/tmp/theme-foundation-check.VW9aju` |
| `npm run typecheck`                                                                    | Exit 0: ambos comandos tsc terminaron correctamente.                                                                    | `/tmp/theme-foundation-check.WsHn5Q` |
| `npm test -- --coverage`                                                               | Exit 0: 23 suites y 147 tests pasaron; sin fallo de umbrales.                                                           | `/tmp/theme-foundation-check.brfGhr` |
| `npm run build -- --configuration production`                                          | Exit 0: Application bundle generation complete. Advertencias CommonJS de localforage y localforage-cordovasqlitedriver. | `/tmp/theme-foundation-check.DKKNxW` |

El script de estilos ausente es un bloqueo adicional, no una regresión introducida por este informe. Se observó también que el package.json existente declara cordova.platforms como android e ios, no como la lista vacía solicitada. Esta ejecución no modificó package.json ni plataformas. Ninguna tarea se marca como completada y no se abre PR.

## Correcciones C0.5 aplicadas al código (2026-10-16 18:58 COT)

Origen: comparación del código de `develop` con Figma 4:440 y `docs/design.md` mediante revisión read-only. Diez correcciones se aplican en C0.5; tres quedan en C1/C2.

Aplicadas en `src/theme/notebook.scss`:

- `.notebook-page` padding-top: 32 → 55 px (Figma `Content topPadding 55`).
- `.page-header` padding-bottom: 20 → 15 px (Figma `title-rule 15`).
- `.page-header::after` radius: 2 → 1.5 px (Figma `radius/accentUnderline 1.5`).
- `.page-header::after` posición: `bottom: -2px` → `top: -1.5px` (Figma acento solapa la parte superior del divider en y=177).
- `h1` line-height: 1.15 → normal (Figma `lineHeight 100% (normal)` y código Figma `leading-[normal]`).
- `h1` margin: 4/8 → 3/15 px (Figma `headerOverlineToTitle 3`, `title-rule 15`).
- `@media (min-width: 768px)` padding-top: 48 → 55 px.

Aplicadas en `src/app/shared/components/task-item/task-item.component.scss`:

- `.task-row` gap: 10 → 13 px (Figma `checkToText 13`); media `max-width: 480px` gap: 2 → 4 px.
- Checkbox Square: 26×26 → 29×29 px y `var(--color-primary)` → `var(--color-primary-dark)` (Figma 29 px y borde 1.5 primary-dark).
- Meta font-size 12 → 14 px y color `var(--color-text-muted)` → `var(--color-text)` (Figma `Body/Meta 14 / 400`, `color/text`).

Fuera de C0.5 (C1/C2): swatch 32 → 27 px de CategoryRow (C2), rail con 5 pestañas, FAB, panel, TodayBadge, top actions, fecha "23.Mon" (C1).

Comprobaciones posteriores (18:58 COT): `npx --no-install prettier --check` exit 0, `openspec validate theme-foundation --strict` exit 0, `git diff --check` exit 0, `npm run typecheck` exit 0, `npm run lint` exit 0, `npm run test` 23 suites y 147 tests exit 0. Las nuevas tripletas de la fase B siguen pendientes y no se marcan como completadas.

## Evidencia visual 3.3

Capturas de Figma descargadas en `openspec/changes/theme-foundation/evidence/` desde `get_screenshot` (MCP figma) y enlazadas por node id; ambas miden 375x812 y se usaron como referencia para el ajuste de C0.5 (commit `a7ce736`).

- [Figma 4:440 todo-day-panel-open (light)](evidence/figma-4-440-light.png) - https://www.figma.com/api/mcp/asset/e566ff70-feee-4cfe-942c-b2e8a4fc1cf3.png
- [Figma 4:1560 todo-dark-mode (dark)](evidence/figma-4-1560-dark.png) - https://www.figma.com/api/mcp/asset/4bcb5e4a-d4c9-4757-a437-9345c6401957.png

Las URL anteriores quedaron expiradas y se regeneraron con `get_screenshot` desde codemode.

## Avance de fase B (commits `a18a4fd`, `de21325`, `fc07e5b`, `c24a96e`)

- 1.1 RED/GREEN (UI-23.1): `src/theme/theme.spec.ts` valida las entradas `src/theme/global.scss` y `src/theme/variables.scss` y rechaza la ruta legacy `src/global.scss`. Mover el SCSS y ajustar `angular.json` deja los 2 tests en verde.
- 1.2 GREEN/REFACTOR: `src/global.scss` queda eliminado; `src/theme/global.scss` reagrupa `@use 'fonts'`, `@use 'notebook'`, `@use 'dark'` y `@forward 'tokens'`. Los `@import` restantes son CSS de Ionic, no Sass propio.
- 2.1 RED/GREEN: `src/theme/_tokens.scss` con valores crudos Figma; `variables.scss` con `@use 'tokens' as t` emite `--app-*` y el puente `--ion-color-primary*` con rgb `75, 63, 107` y shade `#3a2e5c`. 5 tests en `tokens.spec.ts` pasan.
- 2.3 REFACTOR: `src/theme/contrast.spec.ts` calcula WCAG para `on-primary/primary`, `text/surface` y `text/surface-muted` (>= 4.5:1) y documenta la excepción de `text-muted` oscuro de Pedro.
- 3.1 RED/GREEN: `src/theme/_dark.scss` aplica `prefers-color-scheme: dark` con la paleta de Figma 4:1560; `variables.scss` ya no duplica el bloque; `dark.spec.ts` lo verifica.
- 3.2 GREEN: `src/theme/global.scss` retira `dark.system.css`; el único origen de paleta oscura es `_dark.scss`.

Suite actual: 27 suites y 158 tests en verde. `npm run typecheck`, `npm run lint` y `npm run build -- --configuration production` pasan con la advertencia CommonJS esperada de `localforage` y `localforage-cordovasqlitedriver`.

## Reanudación autorizada: artefactos creados

El usuario autorizó crear los artefactos faltantes, ajustar la spec y después implementar, manteniendo Figma, docs/design.json y docs/design.md como fuentes obligatorias para colores, tamaños y tipografía.

Se ejecutó `git switch -c feature/theme-foundation` correctamente desde develop. Los archivos no rastreados anteriores se conservaron. Se crearon proposal.md, design.md con CRC y Mapeo Figma → src/theme, specs/ui-shell/spec.md con UI-20 a UI-28 y tasks.md con 24 tareas aún sin marcar.

Se consultaron `openspec instructions proposal`, `design`, `specs` y `tasks`, todos con `--change theme-foundation --json`, y las respuestas definieron las plantillas usadas. Se ejecutó Prettier sobre los cuatro artefactos, exit 0. Se ejecutó `openspec validate theme-foundation --strict`, exit 0, salida: `Change 'theme-foundation' is valid`. `openspec status --change theme-foundation --json` reportó los cuatro artefactos done. Ese estado solo acredita la estructura documental, no implementación ni verificación funcional.

Se consultaron get_design_context y get_screenshot de Figma para 4:440 y 4:1560; ambas capturas reportaron 375x812. Las capturas todavía no se han descargado a evidence/ y no se declara evidencia visual terminada.

Bloqueos en ese momento de la preparación: interlineado contradictorio (`100% (normal)` en JSON, 100 % en MD, metadatos 100 y código normal en respuesta Figma); medidas de implementación sin fuente visual; precedencia entre oscuro del sistema y clase del documento; workflow todavía ausente. Fuentes offline requieren procedencia/licencia verificadas antes de empaquetarse. No se implementó código ni se ejecutaron ciclos TDD nuevos durante esta preparación. Los resultados de tests anteriores no validan una implementación de theme-foundation.

## Incorporación del workflow y auditoría disponibles posteriormente

Se cargaron completos docs/workflow-mcp.md, docs/auditoria-figma.md, docs/plan-theme-foundation.md, docs/prompts/theme-foundation.md, docs/prompts/docs-workflow-mcp.md, docs/notion-mcp-pi.md y docs/config-yaml-rules.md. Ya no existe el bloqueo por ausencia de estos documentos. Las reglas YAML son instrucciones para un cambio documental separado y no se añadieron silenciosamente a config.yaml.

Se incorporaron a la spec los hallazgos C0.5 de la auditoría, la excepción muted oscuro aceptada en Notion y la separación de hallazgos C1/C2/C3/C7. Se normalizaron escenarios UI-nn.m y se añadió matriz de trazabilidad de auditoría, nodos con enlaces y columna SCSS al mapeo del diseño. La lectura de Notion confirmó la decisión de mantener #6B6580 en oscuro pese al contraste aproximado 3:1; no se alteraron notas durante esta revisión.

Se consultaron nuevamente get_variable_defs de 4:440 y 4:1560, y get_design_context/get_screenshot de 4:788 y 4:1267. Estos últimos no exponen --fs-display-title entre las variables listadas; --fs-title y --fs-note-title quedan como cssVar de la copia offline pendientes de confirmación. El renombrado en docs/design.json está aplicado: --fs-date → --fs-display-date y --fs-regular → --fs-body. La corrección paralela en docs/design.md y la confirmación de los cssVar --fs-title y --fs-note-title siguen pendientes. El usuario autorizó conservar medidas heredadas como tokens técnicos separados y mantener oscuro de sistema más clase que fuerza oscuro. El forzado claro body.light del plan requiere resolver la diferencia con esa decisión. Las consultas tipográficas 4:471 y 4:469 siguen devolviendo metadatos 100 y código leading-[normal]; se contrastó que --fs-display-title y --fs-title, --fs-body y --fs-regular, --fs-display-date y --fs-date no aparecen como tales en Figma, por lo que se mantienen los nombres de la copia offline pendientes de confirmación con una consulta con cuota o un plan superior. El interlineado se mantiene como riesgo sin cierre.

Después de ajustar los artefactos se ejecutó Prettier --write y --check sobre proposal.md, design.md, specs/ui-shell/spec.md y tasks.md: exit 0, `All matched files use Prettier code style!`. `openspec validate theme-foundation --strict`: exit 0, `Change 'theme-foundation' is valid`. `git diff --check`: exit 0, sin salida. No se ejecutaron pruebas nuevas de código porque no se modificó la aplicación. El workflow requiere cerrar la fase A mediante PR documental borrador y revisión antes de fase B. Tras las correcciones de esta revisión el PR #6 está publicado con los commits 1ed0637 y d16c813; sigue borrador y no se declara diseño completamente resuelto porque las tareas 0.1 a 0.5 permanecen sin marcar.
