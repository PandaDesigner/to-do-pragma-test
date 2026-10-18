## 1. Comportamiento

- [x] 1.1 `TODAY-UI-01.5`: `TasksPage` expone el SVG `chevronForward` importado de `ionicons/icons`
- [x] 1.2 `TODAY-UI-01.6`: el `ion-icon` recibe el SVG por `[icon]` y sin atributo `name`
- [x] 1.3 `TODAY-UI-01.7`: el nombre `chevron-forward` no aparece en el marcado renderizado
- [x] 1.4 `TODAY-UI-01.1` corregido: deja de exigir `name = 'chevron-forward'` y pasa a exigir `[icon]`

## 2. Verificación

- [x] 2.1 `TODAY-UI-01.2`, `01.3` y `01.4` siguen en verde: no se tocaron traducción ni estilos del badge
- [x] 2.2 `today-badge-render.spec.ts` con los tres escenarios del render
- [x] 2.3 `npm test` con cobertura; umbrales intactos. 57 suites, 515 tests, 0 fallos
- [x] 2.4 `npm run lint`, `lint:styles`, `format:check` y `typecheck`. Los cuatro en verde
- [x] 2.5 `npm run trace:check` y `npx openspec validate --all --strict`. EXIT=0 y 18/18
- [x] 2.6 Evidencia visual: el chevron pintado dentro del badge, light y dark, 375x812
- [x] 2.7 Fila de Notion del change: `3fdcb44197738192a2fbc8be37c68a2b`, Status = In progress

## 3. Entrega

- [x] 3.1 PR a `develop` con sección Reutilización. https://github.com/PandaDesigner/to-do-pragma-test/pull/54
- [x] 3.2 Merge con merge commit y borrado de rama. Hecho: PR #54 fusionado en `5fca61c`; la rama se borra al archivar este change
- [x] 3.3 `chore/archive-fix-chevron-icon-binding`, `openspec archive`, PR propio, checks y merge. Archivado con `openspec archive fix-chevron-icon-binding` en este mismo PR
- [x] 3.4 Línea en `docs/progress-log.md`