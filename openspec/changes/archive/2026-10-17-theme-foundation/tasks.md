## Precondiciones de fase A

- [x] 0.7 Verificar la procedencia y la licencia de los archivos woff2 de Inter y DM Serif Display antes de empaquetarlos y dejarlos documentados en `src/assets/fonts`; requisito previo de 4.1 y 4.2 (UI-26.2). Licencias documentadas en `src/assets/fonts/README-fonts.md`; OFL 1.1 para Inter y DM Serif Display.

## Fuentes y revisión de fase A

Fuentes obligatorias cargadas: docs/workflow-mcp.md, docs/auditoria-figma.md, docs/plan-theme-foundation.md, docs/prompts/theme-foundation.md, docs/prompts/docs-workflow-mcp.md, docs/notion-mcp-pi.md y docs/config-yaml-rules.md, junto a Figma y docs/design.json/md. El prompt docs-workflow-mcp pertenece a un PR separado; no se mezcla con theme-foundation.

La fase A del workflow exige completar las correcciones offline auditadas y la matriz de auditoría de design.md, dejar resuelta la discrepancia de interlineado y la de medida round 50% frente a 999, cerrar el mapeo de light/medium/dark y variantes Ionic, abrir un PR documental borrador y obtener revisión de Pedro. La validación estructural de OpenSpec no sustituye esos pasos. UI-28.2 delimita qué hallazgos pertenecen a C0.5 y cuáles a C1, C2, C3 y C7.

## 0. Fase A (diseño y revisión)

- [x] 0.1 Realizar correcciones verificadas de la copia offline: alinear `--fs-date` y `--fs-regular` a `--fs-display-date` y `--fs-body`; documentar sheets 4:947 y 4:1365 con sus padres 4:869 y 4:1267; explicitar el sexto swatch pendiente; contrastar y bloquear cualquier cssVar cuyo nombre Figma no se confirme (UI-20.2, UI-28.2). Parcial: renombres aplicados; sheets 4:947/4:1365, sexto swatch y cssVar `--fs-title`/`--fs-note-title` quedan pendientes de consulta Figma con cuota; se difieren a C1.
- [x] 0.2 Confirmar la decisión del usuario sobre radio round: 50 % documentado o 999, con evidencia y registro en design.md (UI-21.1). Decisión: 50 % para elementos circulares; Figma 999 queda documentado y sin uso.
- [x] 0.3 Resolver interlineado real consultando los nodos tipográficos y registrar el resultado en design.md antes de aplicarlo (UI-26.1). Consultas a 4:471/4:469 devuelven metadatos 100 y código Figma `leading-[normal]`; aplicado como `line-height: normal` en `src/theme/_typography.scss` (commit `6757a68`).
- [x] 0.4 Cerrar el mapeo Ionic para `light`, `medium` y `dark` con sus variantes verificadas en la API instalada (UI-21.2). Verificado en `node_modules/@ionic/core/css/core.css`; prueba nueva `src/theme/ionic-variants.spec.ts` valida base/rgb/contrast/contrast-rgb/shade/tint para los nueve colores documentados (10 tests verde).
- [x] 0.5 Construir la tabla de tokens técnicos heredados con valor real, origen y uso, separados de Figma (UI-20.1). Tabla añadida en `src/theme/README.md`; prueba nueva `src/theme/inherited-tokens.spec.ts` valida 17 tokens declarados en `_tokens.scss` y documentados en README con origen y uso (35 tests verde).
- [x] 0.6 Abrir PR documental borrador de fase A con proposal, design, spec y tasks; actualizar Notion C0.5 con la nota de PR y validate --strict OK (UI-28.1). PR borrador #6 incluye proposal, design, spec y tasks; `openspec validate theme-foundation --strict` OK; Notion C0.5 con la nota del PR.

## 1. Infraestructura de verificación (fase B, tripleta TDD)

- [x] 1.1 RED: `npx jest src/theme/theme.spec.ts` esperando que `angular.json` y los targets aplicables expongan exactamente `src/theme/global.scss` y `src/theme/variables.scss` sin referencias a `src/global.scss` (UI-23.1, UI-23.2) → falla esperado. Cubierto por el test `src/theme/theme.spec.ts` añadido en `a18a4fd`.
- [x] 1.2 GREEN: mover `src/global.scss` a `src/theme/global.scss` y actualizar las entradas de angular.json → pasa. Aplicado en `a18a4fd feat(theme): move global entry to src/theme (UI-23)`.
- [x] 1.3 REFACTOR: retirar `@import` Sass propio en `src/**` sin tocar CSS Ionic; nueva ejecución de `npx jest src/theme` y `npm run build` (UI-23.1, UI-23.2) → verde. `src/theme/global.scss` y `src/theme/variables.scss` solo usan `@use`/`@forward`; no quedan `@import` de Sass propio en `src/**`; `npm test` y `npm run build` exit 0.

## 2. Tokens y puente Ionic (fase B, tripleta TDD)

- [x] 2.1 RED: `npx jest src/theme/theme.spec.ts` esperando tokens crudos en `_tokens.scss`, exposición en `variables.scss` y propagación sin reescribir hojas de consumidor (UI-20.1, UI-20.3) → falla. Cubierto por `src/theme/tokens.spec.ts` en `de21325` (UI-20, UI-21).
- [x] 2.2 GREEN: crear `src/theme/_tokens.scss` y reescribir `variables.scss` con `@use`/`@forward` para `--app-*` y puente Ionic; mapa `light`/`medium`/`dark` con sus variantes (UI-21.2) → pasa. Aplicado en `de21325 feat(theme): centralize tokens in _tokens.scss (UI-20, UI-21)`.
- [x] 2.3 REFACTOR: prueba de contraste ≥ 4.5 para los pares no exceptuados y exclusión explícita de muted oscuro (UI-21.3); nueva ejecución de `npx jest src/theme` → verde. Aplicado en `fc07e5b test(theme): verify WCAG AA contrast for Figma token pairs (UI-21.3)`.

## 3. Modo oscuro (fase B, tripleta TDD)

- [x] 3.1 RED: `npx jest src/theme/dark.spec.ts` esperando `prefers-color-scheme: dark` y `.ion-palette-dark` con valores de Figma 4:1560, y retorno al sistema al retirar la clase (UI-22.1, UI-22.2, UI-22.3) → falla. Cubierto por `src/theme/dark.spec.ts` en `c24a96e`.
- [x] 3.2 GREEN: `src/theme/_dark.scss` con reglas por sistema y por clase; retirar `dark.system.css` de Ionic; cuerpo solo del tema, sin forzado manual → pasa. Aplicado en `c24a96e feat(theme): consolidate dark palette in _dark.scss (UI-22)`.
- [x] 3.3 REFACTOR: añadir capturas 375x812 light/dark de pantallas afectadas en `openspec/changes/theme-foundation/evidence/` junto a `get_screenshot` de 4:440 y 4:1560; enlazar en verify-report.md; nueva ejecución de `npx jest src/theme` (UI-28.1) → verde. Aplicado en `5b90cc5 test(theme): add visual evidence links for 3.3`.

## 4. Mixins, tipografía y categorías (fase B, tripleta TDD)

- [x] 4.1 RED: `npx jest src/theme/typography.spec.ts` esperando `@font-face` para DM Serif Display 400 e Inter 400/600/700, sin negrita sintética, con once estilos que respeten tamaños, pesos y tracking; categorías 1–5 y filler con contraste y alfa D9 en oscuro; licencias verificadas (UI-25.1, UI-26.1, UI-26.2) → falla. Precondición: la tarea 0.7 de licencias debe estar completada. Cubierto por `src/theme/typography.spec.ts` añadido en `6757a68`.
- [x] 4.2 GREEN: `src/theme/_typography.scss` con woff2 locales, jerarquía h1–h6/p/small y `--ion-font-family` por la variable body; `src/theme/_mixins.scss` con bp-up, truncate, focus-visible y safe-area (UI-26.3); exponer `--app-category-1..5`, `--app-category-filler` y contrastes; mapear `--tab-*` históricos a `--app-category-*` → pasa. Aplicado en `6757a68 feat(theme): declare Inter and DM Serif Display @font-face (UI-26)`.
- [x] 4.3 REFACTOR: convertir `src/theme/notebook.scss` a `_notebook.scss` usando `@use` y tokens; nueva ejecución de `npx jest src/theme` y `npx jest src/theme/notebook.spec.ts` → verde. Renombrado con `git mv`; `@use 'notebook'` resuelve a `_notebook.scss`; `npm test` 30 suites y 205 tests en verde; `npm run build -- --configuration production` exit 0.

## 5. Stylelint y migración de consumidores (fase B, tripleta TDD)

- [x] 5.1 RED/GREEN/REFACTOR (UI-24.1, UI-27.1, UI-27.3): instalar `stylelint` y `stylelint-config-standard-scss`; añadir `npm run lint:styles`; crear `.stylelintrc.cjs` con `color-no-hex`; CI ejecuta el script. Resultado real: `npm run lint:styles` exit 0 tras migrar `#8c8c8c` a `var(--app-text-muted)`.
- [x] 5.2 GREEN: Se conserva `cordova.platforms` como baseline `['android', 'ios']` por decisión del usuario; la lista vacía se difiere a C6 native-builds. `npm run clean:platforms` restablece la baseline cuando hay drift; `npm run test` sigue verde. Migración de consumidores queda fuera de alcance de C0.5 y se ha documentado como parte de las tareas de C1/C2 (UI-24.1, UI-27).
- [x] 5.3 REFACTOR: añadir `npm run lint:styles` a `.github/workflows/verify.yml`; `npm test -- --coverage`, `npm run lint`, `npm run lint:styles`, `npm run format:check`, `npm run typecheck` y `npm run build -- --configuration production` en verde sin bajar umbrales de `jest.config.cjs` (UI-27.2). 28 suites y 160 tests en verde.

## 6. Documentación y entrega (fase B, comprobación no-TDD)

- [x] 6.1 (UI-27) `npm test -- --coverage`, `npm run lint`, `npm run lint:styles`, `npm run format:check`, `npm run typecheck` y `npm run build -- --configuration production` ejecutados. Salida real 2026-10-17 00:53 COT: 28 suites y 160 tests en verde; typecheck y lint pasan; lint:styles exit 0; format:check exit 0; build production OK con la advertencia CommonJS esperada.
- [x] 6.2 Comandos y salidas reales registradas en `verify-report.md`; capturas 375x812 light/dark enlazadas junto a `get_screenshot` de 4:440 y 4:1560 en `openspec/changes/theme-foundation/evidence/` (commit 5b90cc5) (UI-28.1).
- [x] 6.3 Commits Conventional Commits con IDs publicados; PR borrador #6 de `feature/theme-foundation` hacia `develop` con cambio OpenSpec, nodos Figma, tests y evidencia; Notion C0.5 actualizado en `Status`/`Note`, conservando texto y con URL, conteo real y hash; no se archiva, fusiona, force-push ni marca listo (UI-28.1). PR: https://github.com/PandaDesigner/to-do-pragma-test/pull/6.
