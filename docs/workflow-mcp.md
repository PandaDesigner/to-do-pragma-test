# Flujo con MCP: Figma (diseño) y Notion (progreso)

Este documento es obligatorio para todo cambio OpenSpec que toque UI y complementa `openspec/config.yaml` y `AGENTS.md`.
Modelo de trabajo: **MiniMax** (MiniMax-M3) es el **agente** y **pi** es el **harness** donde se ejecuta. No son dos agentes: cada cambio se trabaja en fases, cada una en una sesión de MiniMax dentro de pi.

| Fase                            | Quién                                               | Qué hace                                                                                                                      |
| ------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **A. Sesión de diseño**         | MiniMax en pi                                       | `openspec new change`, proposal, spec delta, design.md (CRC + Figma), tasks; `openspec validate --strict`; commit `docs(...)` |
| **B. Sesión de implementación** | MiniMax en pi, con el skill `sdd-apply`             | TDD estricto RED, GREEN y REFACTOR; primero commit `test(...)` y después implementación                                       |
| **Verificación**                | MiniMax en pi, con `sdd-verify`                     | revisa el PR contra escenarios, design.md, cobertura y evidencia                                                              |
| **Merge**                       | MiniMax en pi, con autorización permanente de Pedro | fusiona a develop con merge commit cuando el PR esté verde, limpio y sin conflictos                                           |
| **Archivo**                     | después del merge                                   | rama `chore/archive-<cambio>`, `openspec archive <cambio>`, PR propio, checks y merge                                         |

Las dos sesiones ocurren dentro del mismo bucle y no requieren confirmación intermedia. No se usa force-push ni se reescribe historial. En la sesión B no se archiva.

## 1. Fuente de diseño: Figma

- Archivo aprobado: https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA (fileKey `F6ztYiRO9b0xYZA38xSTIA`).
  - Página **Tokens & Components**: variables, 11 text styles y componentes con variantes.
  - Página **Screens**: 13 frames de 375×812.
- La copia offline está en `docs/design.json` (tokens, pantallas con node ids), `docs/design.md` y `docs/mocks/*.png`.
- Precedencia: el PDF manda en funcionalidad y Figma manda en lo visual. Si Figma y `design.json` no coinciden, se usa el valor de Figma y se actualiza `design.json` en el mismo cambio.
- Servidor MCP: `figma` (`https://mcp.figma.com/mcp`, OAuth). Ya está declarado en `.pi/mcp.json`. Iniciar sesión con `pi mcp login figma` y comprobar con `pi mcp list`.

### Pantallas y nodos

| Pantalla                  | Node id | Mock                                |
| ------------------------- | ------- | ----------------------------------- |
| todo-day-panel-open       | 4:440   | mocks/todo-day-panel-open.png       |
| todo-panel-closed         | 4:520   | mocks/todo-panel-closed.png         |
| my-notes-shopping         | 4:617   | mocks/my-notes-shopping.png         |
| todo-completed-task       | 4:664   | mocks/todo-completed-task.png       |
| categories-list           | 4:788   | mocks/categories-list.png           |
| categories-form-sheet     | 4:869   | mocks/categories-form-sheet.png     |
| todo-filtered-by-category | 4:973   | mocks/todo-filtered-by-category.png |
| todo-empty-state          | 4:1062  | mocks/todo-empty-state.png          |
| todo-categories-flag-off  | 4:1113  | mocks/todo-categories-flag-off.png  |
| new-task-modal            | 4:1267  | mocks/new-task-modal.png            |
| todo-swipe-delete-confirm | 4:1404  | mocks/todo-swipe-delete-confirm.png |
| more-settings             | 4:1496  | mocks/more-settings.png             |
| todo-dark-mode            | 4:1560  | mocks/todo-dark-mode.png            |

URL de un nodo: `https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440` (el `:` se sustituye por `-`).

### Fase A: cómo consulta Figma MiniMax (al escribir design.md)

1. **`get_variable_defs`** sobre la página Tokens & Components o sobre el frame afectado. Se obtienen las variables (color/_, tab/_, radius, space, font, shadow, motion) en modo light y dark.
2. **`get_design_context`** sobre cada nodo que el cambio crea o modifica. Se obtienen la estructura, el auto layout, los tamaños y los componentes.
3. **`get_screenshot`** de esos nodos, como referencia visual que se cita en design.md.
4. Registrar en `design.md` la sección **"Fuente Figma"**:
   ```md
   ## Fuente Figma

   | Nodo                                                                       | Pantalla/Componente | Escenarios        | Notas           |
   | -------------------------------------------------------------------------- | ------------------- | ----------------- | --------------- |
   | [4:788](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-788) | categories-list     | CAT-03.1, UI-05.2 | lista con chips |
   ```
5. **Mapeo de variables a tokens** (obligatorio si cambia algún valor visual). Una fila por variable usada:
   ```md
   ## Mapeo Figma → src/theme

   | Variable Figma | Light   | Dark    | Token SCSS (_tokens.scss) | CSS var             |
   | -------------- | ------- | ------- | ------------------------- | ------------------- |
   | color/primary  | #4B3F6B | #8B7FC0 | $color-primary            | --ion-color-primary |
   | tab/todo       | #B8CFA8 | —       | $category-1               | --app-category-1    |
   | radius/md      | 10      | 10      | $radius-md                | --app-radius-md     |
   ```
   - Ningún componente usa valores literales; todo sale de `src/theme` (`var(--ion-*)` / `var(--app-*)`).
   - Una variable nueva en Figma se añade primero a `_tokens.scss` y a `src/theme/README.md`.

### Fase B: uso de Figma durante la implementación

- En la sesión B, MiniMax puede leer con `get_design_context` y `get_screenshot` los nodos citados en design.md para ajustar el maquetado. **No** puede elegir valores nuevos: si algo falta en design.md, se detiene, marca la fila como Blocked y pide volver a la fase A.
- **Evidencia visual en el PR** (obligatoria en cambios UI):
  - capturas a 375×812 en light y dark de cada pantalla afectada, junto al `get_screenshot` del nodo de Figma;
  - las capturas se guardan en `openspec/changes/<cambio>/evidence/<pantalla>-{light,dark}.png` y se enlazan en `verify-report.md` y en la descripción del PR.

## 2. Progreso: Notion

- Servidor MCP: `notion` (`https://mcp.notion.com/mcp`, OAuth; va en `~/.pi/agent/mcp.json` del usuario, no en el repo).
- Base Tasks `a831b37ad5994d3f82bf40bdc5178af5`; proyecto `3fbcb441977381289ce4e197cc5e274b`.

### Una fila por cambio (actualizar solo la fila del cambio en curso)

| Cambio                     | ¿Toca UI?                                                 | Página Notion                    |
| -------------------------- | --------------------------------------------------------- | -------------------------------- |
| C0 restructure-specs       | No                                                        | 3fbcb44197738101a10cea41102607dd |
| C0.5 theme-foundation      | **Sí** (tokens, dark mode)                                | 3fbcb4419773815db397fe4678dec2f0 |
| C1 tasks-crud              | **Sí** (tasks, new-task-modal, empty, swipe-delete)       | 3fbcb441977381efa398f06405c4fa40 |
| C2 categories              | **Sí** (categories-list, form-sheet, filtro)              | 3fbcb441977381f1b398ff3fe1b668a6 |
| C3 feature-flag-categories | **Sí, en parte** (todo-categories-flag-off, ocultar "My") | 3fbcb44197738190817ee816ac16b092 |
| C4 performance             | Sí, en parte (virtual scroll, botón debug 5.000)          | 3fbcb4419773812b9151cb4d7b63d299 |
| C5 quality-ci              | No                                                        | 3fbcb441977381188eacc35a2fee6a2e |
| C6 native-builds           | No (iconos y splash ya definidos)                         | 3fbcb44197738114ae6bdc9eeb915073 |
| C7 docs-delivery           | **Sí** (capturas para el README)                          | 3fbcb4419773817e8a53d35d4e0facd2 |
| fix-ui-fidelity            | **Sí** (empty state, sheet, badge HOY)                    | 3fdcb44197738178aa3bc47f035f60ce |
| fix-qc-audit-findings     | **Sí** (filtro por rango, `lang`, secciones, cabecera)      | 3fdcb441977381658727fb5d86177859 |

### Reglas de actualización

- **Al empezar** (primera tarea RED): Status = In progress. Añadir al Note `[MiniMax/pi YYYY-MM-DD HH:MM COT] inicio <fase> <rama>`.
- **Al abrir el PR borrador**: añadir `[MiniMax/pi …] PR <url> · tareas x/y · <hash corto>`.
- **PR listo** (CI verde y todas las tareas verificadas): Status = Done, con `[MiniMax/pi …] Done · PR <url> · <hash>`. El agente fusiona si se cumplen las reglas de `AGENTS.md` y archiva después en un PR separado.
- **Bloqueo**: Status = Blocked, con `[MiniMax/pi …] Blocked: <motivo y qué se necesita>`.
- **Al cerrar la sesión de diseño (fase A)**: añadir `[MiniMax/pi …] diseño <rama> · PR <url> · validate --strict OK`. Status sigue Not started (o In progress si la fase B empieza enseguida).
- Nunca borrar, mover ni duplicar filas, ni poner Status = Archived. Si el change no tiene fila, crearla con las propiedades del tablero y registrar su identificador aquí.
- Solo se editan Status y Note, y en el Note solo se añade al final. No se tocan Task name, Orden, Phase, Prioridad, Project ni Bot.
- Horas en America/Bogota (COT). Releer la fila antes de escribir.
- **Sincronización horaria**: la rutina de Projects Manager conserva las líneas `[MiniMax/pi …]` y no baja un Status sin evidencia en el repo. La página del proyecto y la línea "Última sincronización" solo las modifica esa rutina.

## 3. Checklist de un cambio UI

- [ ] design.md incluye "Fuente Figma" (nodos con enlace) y "Mapeo Figma → src/theme".
- [ ] tasks.md incluye la tarea de lectura Figma (fase A), las tripletas TDD, la evidencia visual light/dark y los pasos Notion de inicio, PR y Done.
- [ ] El PR enlaza los nodos de Figma, las capturas y la fila de Notion.
- [ ] `openspec validate <cambio> --strict` pasa.
