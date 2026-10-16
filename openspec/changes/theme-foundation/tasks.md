## Fuentes y revisión de fase A

Fuentes obligatorias cargadas: docs/workflow-mcp.md, docs/auditoria-figma.md, docs/plan-theme-foundation.md, docs/prompts/theme-foundation.md, docs/prompts/docs-workflow-mcp.md, docs/notion-mcp-pi.md y docs/config-yaml-rules.md, junto a Figma y docs/design.json/md. El prompt docs-workflow-mcp pertenece a un PR separado; no se mezcla con theme-foundation.

La fase A del workflow exige completar las correcciones offline auditadas y la matriz de auditoría de design.md, dejar resuelta la discrepancia de interlineado y la de medida round 50% frente a 999, cerrar el mapeo de light/medium/dark y variantes Ionic, abrir un PR documental borrador y obtener revisión de Pedro. La validación estructural de OpenSpec no sustituye esos pasos. UI-28.2 delimita qué hallazgos pertenecen a C0.5 y cuáles a C1, C2, C3 y C7.

## 0. Fase A (diseño y revisión)

- [ ] 0.1 Realizar correcciones verificadas de la copia offline: alinear `--fs-date` y `--fs-regular` a `--fs-display-date` y `--fs-body`; documentar sheets 4:947 y 4:1365 con sus padres 4:869 y 4:1267; explicitar el sexto swatch pendiente (UI-28.2).
- [ ] 0.2 Confirmar la decisión del usuario sobre radio round: 50 % documentado o 999, con evidencia y registro en design.md (UI-21.1).
- [ ] 0.3 Resolver interlineado real consultando los nodos tipográficos y registrar el resultado en design.md antes de aplicarlo (UI-26.1).
- [ ] 0.4 Cerrar el mapeo Ionic para `light`, `medium` y `dark` con sus variantes verificadas en la API instalada (UI-21.2).
- [ ] 0.5 Construir la tabla de tokens técnicos heredados con valor real, origen y uso, separados de Figma (UI-20.1).
- [ ] 0.6 Abrir PR documental borrador de fase A con proposal, design, spec y tasks; actualizar Notion C0.5 con la nota de PR y validate --strict OK (UI-28.1).

## 1. Infraestructura de verificación (fase B, tripleta TDD)

- [ ] 1.1 RED: `npx jest src/theme/theme.spec.ts` esperando que `angular.json` y los targets aplicables expongan exactamente `src/theme/global.scss` y `src/theme/variables.scss` sin referencias a `src/global.scss` (UI-23.1, UI-23.2) → falla esperado.
- [ ] 1.2 GREEN: mover `src/global.scss` a `src/theme/global.scss` y actualizar las entradas de angular.json → pasa.
- [ ] 1.3 REFACTOR: retirar `@import` Sass propio en `src/**` sin tocar CSS Ionic; nueva ejecución de `npx jest src/theme` y `npm run build` (UI-23.1, UI-23.2) → verde.

## 2. Tokens y puente Ionic (fase B, tripleta TDD)

- [ ] 2.1 RED: `npx jest src/theme/theme.spec.ts` esperando tokens crudos en `_tokens.scss`, exposición en `variables.scss` y propagación sin reescribir hojas de consumidor (UI-20.1, UI-20.3) → falla.
- [ ] 2.2 GREEN: crear `src/theme/_tokens.scss` y reescribir `variables.scss` con `@use`/`@forward` para `--app-*` y puente Ionic; mapa `light`/`medium`/`dark` con sus variantes (UI-21.2) → pasa.
- [ ] 2.3 REFACTOR: prueba de contraste ≥ 4.5 para los pares no exceptuados y exclusión explícita de muted oscuro (UI-21.3); nueva ejecución de `npx jest src/theme` → verde.

## 3. Modo oscuro (fase B, tripleta TDD)

- [ ] 3.1 RED: `npx jest src/theme/dark.spec.ts` esperando `prefers-color-scheme: dark` y `.ion-palette-dark` con valores de Figma 4:1560, y retorno al sistema al retirar la clase (UI-22.1, UI-22.2, UI-22.3) → falla.
- [ ] 3.2 GREEN: `src/theme/_dark.scss` con reglas por sistema y por clase; retirar `dark.system.css` de Ionic; cuerpo solo del tema, sin forzado manual → pasa.
- [ ] 3.3 REFACTOR: añadir capturas 375x812 light/dark de pantallas afectadas en `openspec/changes/theme-foundation/evidence/` junto a `get_screenshot` de 4:440 y 4:1560; enlazar en verify-report.md; nueva ejecución de `npx jest src/theme` (UI-28.1) → verde.

## 4. Mixins, tipografía y categorías (fase B, tripleta TDD)

- [ ] 4.1 RED: `npx jest src/theme/typography.spec.ts` esperando `@font-face` para DM Serif Display 400 e Inter 400/600/700, sin negrita sintética, con once estilos que respeten tamaños, pesos y tracking; categorías 1–5 y filler con contraste y alfa D9 en oscuro (UI-25.1, UI-26.1, UI-26.2) → falla.
- [ ] 4.2 GREEN: `src/theme/_typography.scss` con woff2 locales, jerarquía h1–h6/p/small y `--ion-font-family` por la variable body; `src/theme/_mixins.scss` con bp-up, truncate, focus-visible y safe-area (UI-26.3); exponer `--app-category-1..5`, `--app-category-filler` y contrastes; mapear `--tab-*` históricos a `--app-category-*` → pasa.
- [ ] 4.3 REFACTOR: convertir `src/theme/notebook.scss` a `_notebook.scss` usando `@use` y tokens; nueva ejecución de `npx jest src/theme` y `npx jest src/theme/notebook.spec.ts` → verde.

## 5. Stylelint y migración de consumidores (fase B, tripleta TDD)

- [ ] 5.1 RED: instalar `stylelint`, `stylelint-config-standard-scss`, `stylelint-no-unsupported-browser-features` y crear `.stylelintrc.json`; añadir `npm run lint:styles`; `npx jest src/theme/styles.spec.ts` con un fixture que contiene `color:#fff` y debe fallar (UI-24.1, UI-27.1, UI-27.3) → falla.
- [ ] 5.2 GREEN: migrar `task-item`, `shell`, `categories`, `tasks` y `home` para consumir `var(--app-*)` o `var(--ion-*)`; checkbox y categorías conservan sus valores actuales como tokens técnicos hasta C1 y C2, sin alterar su apariencia; `npm run lint:styles` → 0 (UI-24.1) → pasa.
- [ ] 5.3 REFACTOR: añadir `npm run lint:styles` a `.github/workflows/verify.yml`; ejecutar `npm test -- --coverage`, `npm run lint`, `npm run lint:styles`, `npm run format:check`, `npm run typecheck` y `npm run build -- --configuration production`; corregir sin bajar umbrales de `jest.config.cjs` (UI-27.2) → verde.

## 6. Documentación y entrega (fase B, comprobación no-TDD)

- [ ] 6.1 `npx jest src/theme/docs.spec.ts` que comprueba que cada token de `_tokens.scss` aparece en `src/theme/README.md` con origen, valores claros/oscuros y uso, diferenciando técnicos de Figma (UI-28.3).
- [ ] 6.2 Guardar comandos y salidas reales en `verify-report.md`; enlazar capturas 375x812 light/dark junto a `get_screenshot` de 4:440 y 4:1560 (UI-28.1).
- [ ] 6.3 Crear commits Conventional Commits con IDs; abrir PR borrador de `feature/theme-foundation` hacia `develop` con cambio OpenSpec, nodos Figma, tests y evidencia; actualizar Notion C0.5 solo en `Status`/`Note`, conservando texto y añadiendo URL, conteo real y hash; no archivar, fusionar, force-push ni marcar listo (UI-28.1).
