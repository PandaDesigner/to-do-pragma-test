## 1. Comportamiento

- [x] 1.1 `TODAY-UI-01.5`: `TasksPage` expone el SVG `chevronForward` importado de `ionicons/icons`
- [x] 1.2 `TODAY-UI-01.6`: el `ion-icon` recibe el SVG por `[icon]` y sin atributo `name`
- [x] 1.3 `TODAY-UI-01.7`: el nombre `chevron-forward` no aparece en el marcado renderizado
- [x] 1.4 `TODAY-UI-01.1` corregido: deja de exigir `name = 'chevron-forward'` y pasa a exigir `[icon]`

## 2. Verificación

- [x] 2.1 `TODAY-UI-01.2`, `01.3` y `01.4` siguen en verde: no se tocaron traducción ni estilos del badge
- [x] 2.2 `today-badge-render.spec.ts` con los tres escenarios del render
- [ ] 2.3 `npm test` con cobertura; umbrales intactos
- [ ] 2.4 `npm run lint`, `lint:styles`, `format:check` y `typecheck`
- [ ] 2.5 `npm run trace:check` y `npx openspec validate --all --strict`
- [ ] 2.6 Evidencia visual: el chevron pintado dentro del badge, light y dark
- [ ] 2.7 Fila de Notion del change