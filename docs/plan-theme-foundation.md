# Plan: cambio `theme-foundation` (C0.5)

Fecha: 16-oct-2026, 17:40 (COT). Basado en el Mac de Pedro (solo lectura), rama `develop` en `77a878f` (17:32 COT; PR #4 ya fusionado).

## 0. Estado actual relevante
- **OpenSpec.** `specs/` contiene `app-base` y `project-bootstrap`. En `changes/` están `app-base` e `init`, más **sin commitear**: `changes/archive/` (2026-10-16-app-base, 2026-10-16-init) y el cambio `openspec-cleanup` (solo proposal.md, rama `chore/openspec-cleanup`). Esa limpieza debe cerrarse antes de C0.
- **angular.json** `styles`: `["src/global.scss", "src/theme/variables.scss"]`. `src/global.scss` está en la raíz de src, no en `src/theme/`. Hace `@use './theme/notebook'` y además usa **`@import`** para el CSS de Ionic y `dark.system.css`.
- **src/theme/**: `variables.scss` (36 líneas) define tokens `--color-*`, `--tab-*` (5 colores de pestañas) y `--ion-color-primary*`, con primary **#4b3f6b**, shade #3a2e5c y tint #5d527a. Ya incluye un bloque `prefers-color-scheme: dark` y `--ion-font-family: 'Inter'`. `notebook.scss` (140 líneas) usa var() pero con tamaños en px.
- **Valores fijos en componentes**: 67 coincidencias de hex/rgba/px en `src/app` (task-item 25, shell 21, categories 11, tasks 5, home 5). Solo hay 1 hex, en `home.page.scss`. El resto son px.
- **Lint**: `ng lint` (ESLint). **No hay Stylelint.** El CI `verify.yml` ejecuta test+coverage → lint → format:check → typecheck → build.
- **Paleta = Figma** (aprobado por Pedro el 16-oct). Fuente: archivo F6ztYiRO9b0xYZA38xSTIA, colecciones Color · Light y Color · Dark, leídas con `get_variable_defs` en los nodos 4:440 (light) y 4:1560 (dark) y coincidentes con `docs/design.json`. Primary **#4B3F6B** (dark #8B7FC0), que es **el mismo que ya está en variables.scss**: el color primario no cambia. La paleta del icono (#5D527A/#3A2E5C/#3CCF8E) se usa **solo para el icono** (resources/), no en el tema.

## 1. Orden de cambios actualizado
| # | Cambio | Rama (desde develop) | Depende de |
|---|---|---|---|
| — | openspec-cleanup (en curso) | chore/openspec-cleanup | — |
| C0 | restructure-specs + config/AGENTS | chore/restructure-specs | cleanup |
| **C0.5** | **theme-foundation** | **feature/theme-foundation** | C0 (prefijo UI y spec `ui-shell` ya existen) |
| C1 | tasks-crud | feature/tasks-crud | C0.5 |
| C2..C7 | categories, persistence, flags (Remote Config), performance, native builds, docs | feature/<cambio> | según el plan |

El tema va antes de C1 porque toca los estilos de todos los componentes. Si C1 se adelantara, cada página nueva nacería con px y hex que luego habría que migrar.

## 2. proposal.md (esquema)
```md
## Why
Los estilos están repartidos (variables.scss + notebook.scss + px en componentes) y los tokens no están formalizados según las variables de Figma. Centralizar tokens antes de C1 evita re-trabajo y habilita dark mode consistente.

## What Changes
- Crear src/theme/{_tokens,_dark,_mixins,_typography}.scss, reescribir variables.scss y mover global.scss a src/theme/global.scss (@use/@forward; sin @import Sass propio).
- Paleta tomada de las variables de Figma (Color · Light/Dark, nodos 4:440 y 4:1560): primary #4B3F6B/#8B7FC0, danger #C5000F, surface, text, border y tab/*; tokens --app-space-*, --app-radius-*, --app-font-size-*, --app-category-1..5 + filler.
- Migrar los componentes existentes (task-item, shell, categories, tasks, home, notebook) a var(--ion-*)/var(--app-*).
- Añadir Stylelint con regla que prohíbe colores hex/named y px fuera de src/theme; job en CI.
- src/theme/README.md con catálogo de tokens.

## Capabilities
### Modified Capabilities
- `ui-shell`: requisitos UI de tema centralizado y modo oscuro.

## Impact
angular.json (styles), src/theme/*, src/global.scss (eliminado o movido), *.component.scss, package.json (stylelint), .stylelintrc.json, .github/workflows/verify.yml. Sin cambios de dominio/datos. Reversión: revertir el PR (solo estilos y tooling).
Rama: feature/theme-foundation → PR borrador a develop. No archivar ni fusionar.
```

## 3. Delta de spec `openspec/changes/theme-foundation/specs/ui-shell/spec.md`
> IDs: siguen el esquema de C0 `UI-nn`. Si C0 ya asignó UI-01..UI-nn a requisitos migrados de APP, estos se numeran desde el siguiente libre. Aquí se usa **UI-20..UI-29** como rango reservado para el tema.

```md
## ADDED Requirements

### Requirement: UI-20 Fuente única de tokens de diseño
El sistema MUST definir todos los tokens de diseño (paleta, espaciado en escala 4/8, tipografía, radios, sombras, z-index y duraciones) exclusivamente en `src/theme/_tokens.scss`, y exponerlos como propiedades CSS `--app-*` en `src/theme/variables.scss`.

#### Scenario: UI-20.1 Tokens disponibles en runtime
- WHEN la app arranca
- THEN `:root` expone los tokens de Figma: `--app-space-{4,8,12,16,24,32}`, `--app-radius-{badge,checkbox,button,tab,card,input,round}`, `--app-font-size-{badge,tab,body,meta,button,overline,panel-title,task-title,display-date}`, `--app-shadow-card`, `--app-shadow-fab`, `--app-z-*` y `--app-duration-panel`, con los valores de la tabla «Mapeo Figma → src/theme» (conforme a Figma 4:440)

#### Scenario: UI-20.2 Un cambio de token se propaga
- WHEN se modifica un valor en `_tokens.scss` y se recompila
- THEN todos los componentes que usan el `--app-*` correspondiente reflejan el nuevo valor sin editar sus hojas de estilo

### Requirement: UI-21 Paleta Figma mapeada a Ionic
`variables.scss` MUST mapear las variables de Figma (archivo F6ztYiRO9b0xYZA38xSTIA) a las variables Ionic `--ion-color-{primary,danger,light,medium,dark}` con sus variantes `-rgb`, `-contrast`, `-contrast-rgb`, `-shade` y `-tint`, además de `--ion-background-color`, `--ion-text-color` y `--ion-font-family`. Primary SHALL ser #4B3F6B (shade #3A2E5C = color/primary-dark) en claro y #8B7FC0 en oscuro; danger SHALL ser #C5000F; `--ion-background-color` = color/surface y `--ion-text-color` = color/text. Los colores Ionic sin equivalente en Figma (secondary, tertiary, success, warning) MUST NOT inventarse con la paleta del icono: o se derivan de una variable de Figma documentada en design.md, o se dejan con el valor por defecto de Ionic y se marcan como «no definido en Figma».

#### Scenario: UI-21.1 Primary de Figma
- WHEN se renderiza un `ion-button color="primary"`
- THEN su fondo computado es `rgb(75, 63, 107)` y `--ion-color-primary-rgb` vale `75, 63, 107` (conforme a Figma 4:440, variable color/primary)

#### Scenario: UI-21.2 Variantes completas
- WHEN se inspecciona `:root`
- THEN cada color Ionic definido tiene las seis variantes (base, rgb, contrast, contrast-rgb, shade, tint)

#### Scenario: UI-21.3 Contraste accesible
- WHEN se combina cada `--ion-color-X` con su `-contrast`
- THEN la relación de contraste es ≥ 4.5:1 (texto normal, WCAG AA), salvo color/text-muted en oscuro (#6B6580 sobre #1E1A2B ≈3:1), excepción aceptada por decisión consciente de Pedro (16-oct): fidelidad a Figma por encima de WCAG para este token

### Requirement: UI-22 Modo oscuro por sistema y por clase
`src/theme/_dark.scss` MUST redefinir los tokens de color tanto bajo `@media (prefers-color-scheme: dark)` como bajo `body.dark`, y `body.light` SHALL forzar el tema claro aunque el sistema esté en oscuro.

#### Scenario: UI-22.1 Sistema en oscuro
- WHEN el sistema reporta `prefers-color-scheme: dark` y body no tiene clase
- THEN `--ion-background-color` vale #1E1A2B y `--ion-text-color` vale #EDEAF5 (conforme a Figma 4:1560)

#### Scenario: UI-22.2 Clase manual
- WHEN se añade `dark` a `body` con el sistema en claro
- THEN se aplican los valores oscuros

#### Scenario: UI-22.3 Forzar claro
- WHEN body tiene `light` y el sistema está en oscuro
- THEN se aplican los valores claros

### Requirement: UI-23 Punto de entrada único y módulos Sass
`angular.json` MUST referenciar únicamente `src/theme/global.scss` y `src/theme/variables.scss`. Los parciales Sass propios SHALL cargarse con `@use`/`@forward`; no SHALL existir `@import` de archivos Sass del proyecto (los CSS de Ionic MAY importarse como CSS).

#### Scenario: UI-23.1 Configuración de estilos
- WHEN se lee `angular.json` (build y test)
- THEN `styles` es exactamente `["src/theme/global.scss", "src/theme/variables.scss"]`

#### Scenario: UI-23.2 Sin @import Sass propio
- WHEN se escanea `src/**/*.scss`
- THEN no hay `@import` que apunte a archivos `.scss` del proyecto

### Requirement: UI-24 Componentes sin valores literales
Las hojas de estilo fuera de `src/theme/` MUST NOT contener colores literales (hex, rgb/rgba/hsl, nombres de color), tamaños en px/rem para espaciado, radio o fuente, ni `font-family`; SHALL usar `var(--ion-*)` o `var(--app-*)`. Se exceptúan `0`, `1px` en bordes (hairline) y `100%`.

#### Scenario: UI-24.1 Stylelint bloquea un hex
- WHEN un componente fuera de `src/theme/` contiene `color: #fff`
- THEN `npm run lint:styles` termina con código ≠ 0 señalando archivo y línea

#### Scenario: UI-24.2 Código actual migrado
- WHEN se ejecuta `npm run lint:styles` sobre develop tras el cambio
- THEN termina con código 0

### Requirement: UI-25 Colores de categoría
El tema MUST exponer `--app-category-1`..`--app-category-5` desde tab/todo, routine, event, my y more de Figma, más `--app-category-filler` (con `-contrast`) en claro y oscuro; las pestañas existentes (todo, routine, event, my, more) SHALL mapear a ellos.

#### Scenario: UI-25.1 Categoría N
- WHEN un chip de categoría usa índice 3
- THEN su fondo es `var(--app-category-3)` y su texto `var(--app-category-3-contrast)`

### Requirement: UI-26 Mixins y tipografía compartidos
`_mixins.scss` MUST proveer `bp-up($bp)`, `truncate($lines)`, `focus-visible` y `safe-area($side)`; `_typography.scss` MUST definir h1–h6, p y small usando solo tokens `--app-font-size-*` y `--ion-font-family`.

#### Scenario: UI-26.1 Foco visible
- WHEN un elemento interactivo recibe foco por teclado
- THEN muestra un outline con `--ion-color-primary` y offset definido por token

### Requirement: UI-27 Stylelint en CI
El pipeline `verify` MUST ejecutar `npm run lint:styles` y fallar si hay violaciones.

#### Scenario: UI-27.1 PR con violación
- WHEN un PR introduce un hex en `src/app/**`
- THEN el job `verify` queda en rojo

### Requirement: UI-28 Documentación de tokens
`src/theme/README.md` MUST listar cada token (nombre, valor claro, valor oscuro, uso) y las reglas de UI-23/UI-24.

#### Scenario: UI-28.1 Token documentado
- WHEN se añade un token en `_tokens.scss`
- THEN el README contiene una fila con su nombre (verificado por test que compara ambos)
```

## 3b. Fuente Figma y mapeo de tokens (para design.md, según docs/workflow-mcp.md)

### Fuente Figma
| Nodo | Pantalla | Escenarios |
|---|---|---|
| [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440) | todo-day-panel-open (claro, referencia de variables light) | UI-20.1, UI-21.1, UI-25.1 |
| [4:1560](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1560) | todo-dark-mode (referencia de variables dark) | UI-22.1–22.3 |
| [4:788](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-788) | categories-list (chips y colores de categoría) | UI-25.1 |
| [4:1267](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1267) | new-task-modal (inputs, botón, radios) | UI-24.2, UI-26.1 |
| Página Tokens & Components | variables, 11 text styles | UI-20, UI-26 |

### Mapeo Figma → src/theme (valores verificados con get_variable_defs el 16-oct, 18:05 COT)
| Variable Figma | Light | Dark | Token SCSS | CSS var |
|---|---|---|---|---|
| color/primary | #4B3F6B | #8B7FC0 | $color-primary | --ion-color-primary (+ -rgb 75,63,107 / 139,127,192) |
| color/primary-dark | #3A2E5C | #EDEAF5 | $color-primary-dark | --ion-color-primary-shade |
| color/on-primary | #FFFFFF | #FFFFFF | $color-on-primary | --ion-color-primary-contrast |
| color/text | #2E2547 | #EDEAF5 | $color-text | --ion-text-color |
| color/text-muted | #6B6580 | #6B6580 (decisión de Pedro) | $color-text-muted | --app-color-text-muted |
| color/surface | #FFFFFF | #1E1A2B | $color-surface | --ion-background-color |
| color/surface-muted | #F2F2F4 | #2A2539 | $color-surface-muted | --app-color-surface-muted |
| color/border | #E6E4EC | #332D45 | $color-border | --app-color-border |
| color/card-border | #D9D6E2 | #332D45 | $color-card-border | --app-color-card-border |
| color/check-empty | #E4E1EE | #E4E1EE | $color-check-empty | --app-color-check-empty |
| color/accent-link | #3AA8E0 | #3AA8E0 | $color-accent-link | --app-color-accent-link |
| color/danger | #C5000F | #C5000F | $color-danger | --ion-color-danger |
| color/scrim | #00000066 | #00000066 | $color-scrim | --ion-backdrop-color |
| tab/todo | #B8CFA8 | #B8CFA8D9 | $category-1 | --app-category-1 |
| tab/routine | #F28B8B | #F28B8BD9 | $category-2 | --app-category-2 |
| tab/event | #9FC3CF | #9FC3CFD9 | $category-3 | --app-category-3 |
| tab/my | #E8E1B8 | #E8E1B8D9 | $category-4 | --app-category-4 |
| tab/more | #C9C9C9 | #C9C9C9D9 | $category-5 | --app-category-5 |
| tab/filler | #4B3F6B | #4B3F6BD9 | $category-filler | --app-category-filler |
| shadow/card | #2E254714 | igual | $shadow-card-color | --app-shadow-card (0 4px 16px 0 color) |
| shadow/fab | #4B3F6B59 | igual | $shadow-fab-color | --app-shadow-fab (0 8px 10px color) |
| space 4/8/12/16/24/32 | — | — | $space-4…$space-32 | --app-space-4 … --app-space-32 |
| radius badge 2 · checkbox 3 · button 6 · tab 8 · card 10 · input 10 · round 999 · sheetTop 16 (estimado) · swatch 4 (estimado) | — | — | $radius-* | --app-radius-{badge,checkbox,button,tab,card,input,round,sheet,swatch} |
| stroke/checkbox 1.5 | — | — | $stroke-checkbox | --app-stroke-checkbox |
| font display: DM Serif Display 400 (fallback Georgia, serif) | — | — | $font-display | --app-font-display |
| font body: Inter 400/600/700 (fallback -apple-system, Roboto, sans-serif) | — | — | $font-body | --ion-font-family |
| fs badge 11 · tab 13 · body/meta/button 14 · overline/panel-title 15 · note-title 16 · task-title 17 · title 36 · display-date 38 (letter-spacing -0.3; badge 0.4; line-height 100%) | — | — | $fs-* | --app-font-size-{badge,tab,body,meta,button,overline,panel-title,note-title,task-title,title,display-date} |
| gaps de layout: 3 · 8 · 11 · 13 · 15 · 16 · 24 · 83 (design.json gapsUsados) | — | — | $gap-* | --app-gap-{overline-title,top-actions,page-header-rule,check-text,title-rule,rule-list,list-input,rule-list-panel} |
| dimensiones: rail 27 · content padding-left 37 · top 55 · contenido 311 · checkbox 29 (circle 26) · input/botón 50 · FAB 68 · chip 33/35 · tab radius 8 · accent underline 84×3 | — | — | $size-* | --app-size-{rail,content-pl,top,content,checkbox,checkbox-circle,control,fab,chip} |
| motion panelExpand ~200ms ease-out (estimado) | — | — | $duration-panel | --app-duration-panel |

- **Categorías:** `--app-category-1..5` salen de tab/*. En categories-list (4:788) Shopping = tab/my, Work = tab/event, Home = tab/todo y Health = tab/routine. ColorPicker (4:869) dibuja **6** swatches y solo hay 5 colores tab: el sexto queda pendiente de definir en Figma; no se inventa.
- **Fuentes:** el repo **no carga** Inter ni DM Serif Display (no hay @font-face ni link). C0.5 debe empaquetarlas en `src/assets/fonts` (woff2, Inter 400/600/700 y DM Serif Display 400) con @font-face en `_typography.scss`, porque Cordova trabaja offline.
- **text-muted en oscuro = #6B6580**, exactamente como Figma: decisión consciente de Pedro (16-oct): fidelidad a Figma por encima de WCAG para este token. C0.5 sustituye el #B4AEC5 actual del código.
- **Sin equivalente en Figma:** secondary, tertiary, success y warning. Se quedan con el valor por defecto de Ionic y se marcan así en el README. El verde del icono (#3CCF8E) **no** se usa.
- **⚠️ Contraste:** en oscuro, text-muted (#6B6580 sobre #1E1A2B) da aproximadamente 3:1. Se acepta como decisión consciente de Pedro (16-oct): fidelidad a Figma por encima de WCAG para este token; el escenario UI-21.3 lo excluye explícitamente.
- **Aliases durante la migración:** `--color-*` y `--tab-*` siguen existiendo como alias de los nuevos `--app-*` mientras se migran los componentes, y se eliminan en la tarea 5.3.

## 4. design.md: responsabilidades CRC por archivo
| Archivo (rol) | Estereotipo | Responsabilidades (sabe / hace) | Colaboradores |
|---|---|---|---|
| `_tokens.scss` | Information holder | Sabe los valores crudos: paleta de Figma (Color · Light/Dark: primary #4B3F6B/#8B7FC0, primary-dark, text, surface, border, danger, tab/*), escala 4/8, tipografía, radios, sombras, z-index y duraciones. No emite CSS. | variables, _dark, _typography, _mixins |
| `variables.scss` | Interfacer | Traduce tokens a propiedades CSS `--ion-*` (con rgb/contrast/shade/tint) y `--app-*` en `:root`; mapea las `--tab-*` heredadas a `--app-category-*`. | _tokens, Ionic, componentes |
| `_dark.scss` | Controller | Decide qué valores aplican según `prefers-color-scheme` y `body.dark` / `body.light`. | _tokens, variables |
| `_mixins.scss` | Service provider | Ofrece breakpoints, truncate, focus-visible y safe-area. | _tokens, componentes |
| `_typography.scss` | Structurer | Define la jerarquía h1–h6, p y small. | _tokens |
| `global.scss` | Coordinator | Único punto de entrada: hace `@use` de los parciales, importa el CSS de Ionic y aplica resets mínimos. Absorbe `notebook.scss` como `_notebook.scss` usando tokens. | todos los parciales, angular.json |
| `README.md` | Information holder | Documenta tokens y reglas. | _tokens (test de sincronía) |
| `.stylelintrc.json` + `lint:styles` | Guard | Rechaza literales fuera de `src/theme`. | CI verify |
| `theme.spec.ts` (Jest) | Verifier | Comprueba angular.json, la ausencia de `@import`, la sincronía del README, el contraste y que el CSS compilado contiene las variables de light/dark. | sass (compile), angular.json |

Decisiones:
- (a) Mover global.scss a `src/theme/`. Se elige frente a dejarlo en `src/`, porque lo pide la regla de UI-23.
- (b) Mantener `dark.system.css` de Ionic, o reemplazarlo por `_dark.scss`. **Decisión:** reemplazarlo, para tener un solo origen de verdad y soportar la clase `light`.
- (c) Stylelint con `stylelint-config-standard-scss`, `color-no-hex` y `declaration-property-unit-disallowed-list`, con un override que desactiva las reglas en `src/theme/**`.
- (d) Test de light/dark con Jest: compilar `global.scss` con `sass.compile()` y verificar los valores de `:root`, del bloque `@media` y de `body.dark`. Se suman capturas manuales en la descripción del PR. Se elige frente a E2E porque es más rápido y determinista.

Sin riesgo de cambio de color: primary sigue en #4B3F6B, igual que hoy.

**Riesgos (para design.md):** text-muted en oscuro #6B6580 sobre #1E1A2B ≈3:1, por debajo de WCAG AA. Es una decisión consciente de Pedro (16-oct): fidelidad a Figma por encima de WCAG para este token. Afecta al texto secundario (meta, contadores, ayudas) en modo oscuro. Mitigación: no usar text-muted para información crítica; revisarlo si Figma cambia. Cambio visible: en oscuro, el texto secundario se ve más apagado que hoy (#B4AEC5 → #6B6580).

## 5. tasks.md (tripletas TDD)
```md
## 1. Infraestructura de verificación
- [ ] 1.1 RED: src/theme/theme.spec.ts — angular.json styles == [theme/global.scss, theme/variables.scss] (UI-23.1); ejecutar `npx jest src/theme` → falla
- [ ] 1.2 GREEN: mover src/global.scss → src/theme/global.scss, actualizar angular.json (build+test) → pasa
- [ ] 1.3 REFACTOR: eliminar referencias antiguas; `npm run build` verde

## 2. Tokens y variables
- [ ] 2.0 (fase A, ya hecho en design.md): get_variable_defs en 4:440 y 4:1560 → tabla de mapeo
- [ ] 2.1 RED: test compila global.scss con sass y espera --app-space-{4,8,12,16,24,32}, --app-radius-*, --app-font-size-*, --ion-color-primary-rgb: 75, 63, 107 (UI-20.1, UI-21.1/21.2) → falla
- [ ] 2.2 GREEN: crear _tokens.scss y reescribir variables.scss con @use/@forward → pasa
- [ ] 2.3 REFACTOR: test de contraste ≥4.5 (UI-21.3) y ajuste de -contrast; sin @import Sass propio (UI-23.2)

## 3. Modo oscuro
- [ ] 3.1 RED: test espera valores oscuros en @media(prefers-color-scheme: dark), body.dark y claros en body.light (UI-22.1..3) → falla
- [ ] 3.2 GREEN: _dark.scss; quitar dark.system.css → pasa
- [ ] 3.3 REFACTOR: unificar con tokens; capturas 375x812 light/dark en openspec/changes/theme-foundation/evidence/ junto a get_screenshot de 4:440 y 4:1560; enlazar en verify-report.md

## 4. Mixins, tipografía y categorías
- [ ] 4.1 RED: tests de @font-face presentes para Inter y DM Serif Display, --app-category-1..5 + filler (+contrast) en claro/oscuro (UI-25.1), focus-visible y h1..small en CSS compilado (UI-26.1) → falla
- [ ] 4.2 GREEN: _mixins.scss, _typography.scss (@font-face Inter 400/600/700 + DM Serif Display 400 desde src/assets/fonts), categorías; mapear --tab-* → --app-category-* → pasa
- [ ] 4.3 REFACTOR: convertir notebook.scss en _notebook.scss con tokens

## 5. Stylelint y migración de componentes
- [ ] 5.1 RED: instalar stylelint + config; script lint:styles; fixture con `color:#fff` debe fallar (UI-24.1); `npm run lint:styles` sobre src/app → falla (67 literales actuales)
- [ ] 5.2 GREEN: migrar task-item, shell, categories, tasks, home a var(--app-*)/var(--ion-*) → `npm run lint:styles` = 0 (UI-24.2)
- [ ] 5.3 REFACTOR: añadir `npm run lint:styles` a verify.yml (UI-27.1); `npm test -- --coverage`, lint, format:check, typecheck, build verdes

## 6. Documentación
- [ ] 6.1 RED: test que cada token de _tokens.scss aparece en src/theme/README.md (UI-28.1) → falla
- [ ] 6.2 GREEN: escribir README.md → pasa
- [ ] 6.3 REFACTOR: registrar comandos y salidas en verify-report.md; abrir PR borrador; Notion: fila C0.5 In progress al iniciar, Note con el PR al abrir el borrador
```

## 6–7. Prompts (MiniMax en el harness pi)
Flujo: **Sesión 1, diseño** (fase A) → revisión y aprobación de Pedro → **Sesión 2, implementación** (fase B, sdd-apply con TDD) → revisión del PR → merge de Pedro → `openspec archive theme-foundation`. MiniMax es el agente y pi el harness: no son dos agentes. Prompts en `docs/prompts/theme-foundation.md` (copia en /workspace/prueba/theme-prompts-figma.md).

## 8. Impacto en la fila de Notion "🎨 Theme centralizado" (sin aplicar)
- **Título:** "🎨 C0.5 theme-foundation: theme centralizado".
- **Fase:** pasa a ir justo después de C0 y antes de C1 (tasks-crud). C1 debería quedar marcada como bloqueada por esta fila, si el tablero tiene relación de dependencias.
- **Nota** (actualizada 16-oct): "Paleta = Figma. Rama feature/theme-foundation desde develop. Spec delta ui-shell UI-20..UI-28. Paleta Figma (primary #4B3F6B/#8B7FC0). Incluye Stylelint en CI y migración de 67 literales (task-item, shell, categories, tasks, home). Prompts en /workspace/prueba/theme-change-plan.md."
- **Status:** Blocked/Not started hasta que la sesión de diseño abra el PR de artefactos.
- **Bot:** Ionic Mobile Expert, o vacío según la convención del tablero.
- Se suma la tarea CI/CD "Stylelint en CI", que queda absorbida por esta fila.
