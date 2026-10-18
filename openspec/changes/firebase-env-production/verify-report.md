# Verify report — firebase-env-production

Fecha: 2026-10-18. Rama `fix/firebase-env-production`. Este informe es el del commit del change A. El change B queda fuera de este commit.

## Resultado

La build `--configuration production` queda con `production: true` y `remoteConfigFetchIntervalMs` 60000 aunque no exista `firebase-config.json`. El release exige ese archivo. El CI no.

## RED

Fallaron antes de implementar: ENV-01.1, ENV-01.3, ENV-01.7, ENV-01.6, RC-06.1, RC-06.2, FBCFG-01.1 a FBCFG-01.7, DOC-FB-01.1, DOC-FB-01.2, DOC-FB-01.3, DOC-FB-01.5, DOC-FB-01.6.

Verificación sin RED posible, porque el comportamiento ya estaba: ENV-01.2, ENV-01.4, ENV-01.5, RC-06.3, RC-06.4, RC-06.5, DOC-FB-01.4. ENV-01.5 lee los tres scripts que ya tenían `--configuration production`.

## Comandos

| Comando | Exit |
| --- | --- |
| `npx jest --coverage` | 0. 52 suites, 468 tests. Statements 94.09, branches 87.9, functions 90.9, lines 93.96. Los umbrales de Jest no fallaron. |
| `npm run lint` | 0 |
| `npm run lint:styles` | 0 |
| `npm run format:check` | 0 después de Prettier |
| `npm run typecheck` | 0 |
| `npm run trace:check` | 0 |
| `openspec validate firebase-env-production --strict` | 0 |
| `openspec validate --all --strict` | 0, 13 items, sin el change B |
| `node scripts/ensure-firebase-config.cjs` sin archivo | 0, avisa valores por defecto |
| `node scripts/ensure-firebase-config.cjs --require` sin archivo | 1, nombra la ruta y el example |
| `npm run build -- --configuration production` sin el JSON local | 0 |

El bundle de `www/` tuvo una coincidencia de producción verdadera y una del intervalo 60000. Ninguna de producción falsa. No se imprimió la config.

## Decisiones

- Intervalo de producción 60000 ms. Desarrollo 0.
- Sin `onConfigUpdate`.
- `ng serve` sigue en development. CI, Android debug web e iOS archive usan la configuración production por default o por flag explícito.
- No se lanzó un APK firmado.
- Los 18 commits no se revirtieron. Quedaron en el change B.

## Límites

`npm ci` no se reejecutó en esta pasada. La base es el `node_modules` ya instalado. Los warnings de budget de `tasks.page.scss` y `task-item.component.scss` siguen. No se subieron los umbrales.
