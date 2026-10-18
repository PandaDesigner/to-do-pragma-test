## 1. Behavior

- [x] 1.1 Swipe reveal on `TaskItemComponent` — implemented as the Ionic end option, covered by `[SWIPE-01.1]` in `todo-screen`
- [x] 1.2 Shopping notes header and note rows with `[TODO-04.2]`
- [x] 1.3 TODAY reset with `[TODO-01.3]`
- [x] 1.4 Locale keys for rail, shell, categories, sheet, row, and editor, with `[I18N-01.4]` and `[I18N-01.3]`

## 2. Verification

- [x] 2.1 `npx jest --runInBand --coverage` — thresholds held
- [x] 2.2 `node scripts/trace-check.mjs` passed
- [x] 2.3 Prettier and stylelint on the touched files
- [x] 2.4 Visual captures at 375x812 light/dark es/en in `evidence/`. Browser captures of the task screen and the shopping-notes state, not a 2px Figma diff and not a simulator.
- [ ] 2.5 Notion row — el conector de Notion autenticó el 2026-10-18 y se escribieron las notas de cierre en las filas de `todo-screen`. La fila propia de este change no se pudo crear: la propiedad de título de la base es `Task name` y el MCP truncaría la clave al serializar el espacio. Queda pendiente crearla a mano en el tablero.
- [x] 2.6 Browser pass of TODAY, shopping notes, swipe confirm, and task create on `ng serve`

## 3. Delivery

- [x] 3.1 Implementation merged into `develop` by PR #44 (merge commit `4341e9c`)