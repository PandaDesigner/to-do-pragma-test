## 1. Comportamiento

- [x] 1.1 Empty state de Categories con ilustración y CTA, con `[CAT-UI-01.1]`, `[CAT-UI-01.2]` y `[CAT-UI-01.3]` en `categories.page.spec.ts`
- [x] 1.2 Chevron del badge HOY como `ion-icon` y `›` fuera de la traducción, con `[TODAY-UI-01.1]`, `[TODAY-UI-01.2]`, `[TODAY-UI-01.3]` y `[TODAY-UI-01.4]` en `tasks.page.spec.ts` y `chrome-translations.spec.ts`
- [x] 1.3 Orden de las acciones del sheet: primario antes que cancelar, con `[SHEET-UI-01.1]`, `[SHEET-UI-01.2]` y `[SHEET-UI-01.3]`. Solo se reordena el DOM; el SCSS no se toca.
- [x] 1.4 Trazabilidad con escenario real para `4:440`, `4:520`, `4:869` y `4:1062`, con `[TRACE-UI-01.1]`

## 2. Verificación

- [x] 2.1 `npm test` con cobertura; umbrales intactos (80 global, 95 domain, 90 data/store/shared)
- [x] 2.2 `npm run lint`, `npm run lint:styles` y `npm run format:check`
- [x] 2.3 `npm run typecheck`
- [x] 2.4 `npm run trace:check`
- [x] 2.5 `npx openspec validate fix-ui-fidelity --strict` y `npx openspec validate --all --strict`
- [x] 2.6 Comparación pixel a pixel contra `docs/mocks/` para los tres puntos, registrada en `verify-report.md`
- [x] 2.7 Capturas reales en `evidence/`: 10 PNG a 375x812, light/dark es/en, de `today-badge`, `categories-empty` y `categories-sheet`. Capturadas con CDP sobre el build real servido en `localhost:8100` a 375x812. Son de navegador, no de simulador nativo y no son un diff de 2 px.
- [x] 2.8 Fila de Notion del change. Fila creada el 2026-10-18: `3fdcb44197738178aa3bc47f035f60ce`, Status = Done con PR #51. Registrada en `docs/workflow-mcp.md`.

## 3. Entrega

- [x] 3.1 PR a `develop` con sección Reutilización
- [x] 3.2 Merge y borrado de rama. PR #51 fusionado en `develop`. Desviación: se usó squash (`4e73ce9`) en lugar del merge commit que pide `AGENTS.md`; el historial de la rama no queda en `develop`. La rama `fix-ui-fidelity` se borra tras el archivado.
- [x] 3.3 `chore/archive-fix-ui-fidelity`, `openspec archive`, PR propio, checks y merge. Rama creada desde `develop` actualizado, `openspec archive fix-ui-fidelity` aplicado (4 requisitos a `openspec/specs/fix-ui-fidelity/spec.md`) y PR propio abierto. Checks locales en verde: 56 suites y 512 tests, cobertura global 94.09 % con los umbrales intactos, lint, lint:styles, format:check, typecheck, `trace:check` y `openspec validate --all --strict` (17/17).
- [x] 3.4 Línea en `docs/progress-log.md`. Registrada con los cuatro requisitos, el arreglo del chevron y la desviación del squash.
