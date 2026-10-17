# Reporte de verificación: i18n

## Resultado

El PR #11 está fusionado en `develop` (`ddb4ee0`). Los escenarios SET-01.1, SET-01.2, I18N-01.1 e I18N-01.2 pasan. La pantalla no cumple la tolerancia de 2 px frente a Figma 4:1496.

Esa diferencia no se corrige en este archivo. El change solo añadió el modo oscuro y el idioma. El rail de cinco pestañas, las filas de categorías y el panel de depuración quedan para los changes siguientes. Pedro fijó que el siguiente es `todo-screen`.

## Evidencia visual

Capturas de `http://127.0.0.1:8101/tabs/settings` a 375x812. El marco de Figma se descargó con `get_screenshot` del nodo 4:1496 y coincide con `docs/mocks/more-settings.png`: 0 px por encima de 2.

| Archivo | Qué muestra |
| --- | --- |
| evidence/figma-4-1496.png | Marco de Figma 4:1496 |
| evidence/more-settings-light-en.png | App en claro e inglés |
| evidence/more-settings-light-es.png | App en claro y español |
| evidence/more-settings-dark-en.png | App en oscuro e inglés |
| evidence/more-settings-dark-es.png | App en oscuro y español |
| evidence/more-settings-diff-light-en.png | Píxeles de la app en claro e inglés que se apartan más de 2 del marco |

Comparación del claro inglés contra el marco: 32.278 de 304.500 px (10,6 %) superan 2. El claro español sube a 21,5 % porque el texto cambia y aparece el aviso de Remote Config. El oscuro no tiene marco propio en 4:1496; el fondo medido es #1E1A2B.

El aviso de Remote Config sale porque Firebase no está disponible en este navegador. No forma parte de los escenarios de este change.

## Verificaciones

| Comando | Resultado |
| --- | --- |
| `npx jest --runInBand src/app/pages/settings/settings.page.spec.ts src/app/core/settings/translations.spec.ts src/theme/theme-preference.spec.ts` | 3 suites, 8 pruebas |
| `npx jest --runInBand --coverage` | 34 suites, 257 pruebas; umbrales cumplidos. Líneas 92,53 % |
| `npm run typecheck` | correcto |
| `npm run lint` | correcto |
| `npm run lint:styles` | correcto |
| `npm run format:check` | correcto |
| `npm run trace:check` | correcto |
| `openspec validate i18n --strict` | correcto |
| `npm run build -- --configuration production` | correcto. Avisa CommonJS de `localforage` y su driver |

Watchman avisa de un recrawl. No cambia el resultado.
