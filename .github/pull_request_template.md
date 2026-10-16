## Cambio OpenSpec

- Cambios OpenSpec referenciados: `init`
- Escenarios cubiertos: INIT-01, INIT-02, INIT-03, INIT-04, INIT-05

## Comprobaciones

- [ ] `npm test` (Jest, suites y tests actualizados)
- [ ] `npm run lint`
- [ ] `npm run format:check`
- [ ] `npm run typecheck`
- [ ] `npm run build -- --configuration production`
- [ ] `openspec validate <cambio> --strict`

## Evidencia RED/GREEN

- Pruebas escritas antes de la implementación (RED) en este PR: …
- Resultado RED observado: …
- Resultado GREEN tras implementar: …

## Limitaciones y riesgos pendientes

- Auditoría de dependencias: ver `openspec/changes/init/verify-report.md`.
- Ámbito de `init`: scaffolding reproducible, no incluye CRUD, Firebase inicializado ni pantallas finales.
