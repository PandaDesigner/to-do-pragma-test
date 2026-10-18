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
- [ ] 2.8 Fila de Notion del change. Bloqueado: el conector de Notion no está disponible en este entorno.

## 3. Entrega

- [x] 3.1 PR a `develop` con sección Reutilización
- [ ] 3.2 Merge con merge commit y borrado de rama
- [ ] 3.3 `chore/archive-fix-ui-fidelity`, `openspec archive`, PR propio, checks y merge
- [ ] 3.4 Línea en `docs/progress-log.md`
