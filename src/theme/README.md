# src/theme

Origen único de los tokens visuales de la app. Los consumidores importan solo `var(--app-*)` o `var(--ion-*)`; nada de literales.

## Estructura

- `_tokens.scss` - valores crudos. No emite CSS. Tokens Figma y técnicos juntos, separados por secciones.
- `_dark.scss` - paleta de `prefers-color-scheme: dark` (Figma 4:1560). Único origen de la variante oscura.
- `_mixins.scss` - `bp-up($bp)`, `truncate($lines)`, `focus-visible($offset)` y `safe-area($side)`.
- `_fonts.scss` - woff2 locales de Inter 400/600/700 y DM Serif Display 400.
- `_typography.scss` - 11 estilos tipográficos, `line-height: normal`, sin negrita sintética para DM Serif Display.
- `variables.scss` - reune tokens, expone `--app-*` y puentea a `--ion-color-*`.
- `global.scss` - entrada única para `angular.json` (`@use 'fonts'`, `typography`, `notebook`, `dark`, `@forward 'tokens'`).

## Reglas

- Los consumidores **no importan** parciales de `src/theme` directamente. Solo declaran `var(--app-*)` o `var(--ion-*)` en su SCSS.
- El Sass propio usa `@use`/`@forward`. Los `@import` restantes son CSS de Ionic, no Sass propio.
- `dark.system.css` está desactivado; `_dark.scss` es la única fuente de paleta oscura.
- `body.light` y forzado claro manual están fuera de alcance (decisión del usuario).
- El radio `round` se mantiene en 50 % para elementos circulares; el valor Figma 999 se documenta para referencia futura.

## Tabla de tokens (origen Figma)

Las variables `--app-*` siguen el mapeo definido en `openspec/changes/theme-foundation/design.md` (tabla Mapeo Figma → src/theme). La copia offline `docs/design.json` es la fuente del listado:

| Variable                | Light                                       | Dark                            | Origen                                           |
| ----------------------- | ------------------------------------------- | ------------------------------- | ------------------------------------------------ |
| `--app-primary`         | #4B3F6B                                     | #8B7FC0                         | color/primary                                    |
| `--app-primary-dark`    | #3A2E5C                                     | #EDEAF5                         | color/primary-dark                               |
| `--app-text`            | #2E2547                                     | #EDEAF5                         | color/text                                       |
| `--app-text-muted`      | #6B6580                                     | #6B6580                         | color/text-muted (decisión Pedro 16-oct)         |
| `--app-surface`         | #FFFFFF                                     | #1E1A2B                         | color/surface                                    |
| `--app-surface-muted`   | #F2F2F4                                     | #2A2539                         | color/surface-muted                              |
| `--app-border`          | #E6E4EC                                     | #332D45                         | color/border                                     |
| `--app-card-border`     | #D9D6E2                                     | #332D45                         | color/card-border                                |
| `--app-check-empty`     | #E4E1EE                                     | #E4E1EE                         | color/check-empty                                |
| `--app-accent-link`     | #3AA8E0                                     | #3AA8E0                         | color/accent-link                                |
| `--app-danger`          | #C5000F                                     | #C5000F                         | color/danger (UI-21)                             |
| `--app-category-1..5`   | #B8CFA8, #F28B8B, #9FC3CF, #E8E1B8, #C9C9C9 | mismo hex con alfa D9 (--tab-*) | tab/*                                            |
| `--app-category-filler` | #4B3F6B                                     | #4B3F6BD9                       | tab/filler (independiente del primary en oscuro) |

Las espaciados, radios, strokes y tamaños tipográficos siguen la tabla de design.md. Los `var(--app-space-*)`, `var(--app-radius-*)`, `var(--app-font-size-*)` y `var(--app-stroke-*)` se generan desde `_tokens.scss`.

## Tabla de tokens técnicos heredados

Tokens que viven en el SCSS pero no son Figma. Mantienen el comportamiento actual; serán auditados o migrados en C1/C2.

| Token                      | Valor     | Origen        | Uso                  |
| -------------------------- | --------- | ------------- | -------------------- |
| `$color-primary`           | #4b3f6b   | notebook.scss | primary brand        |
| `$color-primary-dark`      | #3a2e5c   | notebook.scss | primary shade        |
| `$color-accent-link`       | #3aa8e0   | notebook.scss | links                |
| `$color-danger`            | #c5000f   | Ionic palette | destructive state    |
| `$color-scrim`             | #00000066 | notebook.scss | backdrop scrim       |
| `$shadow-card-color`       | #2e254714 | notebook.scss | card shadow          |
| `$shadow-fab-color`        | #4b3f6b59 | notebook.scss | fab shadow           |
| `$tab-todo`                | #b8cfa8   | notebook.scss | category color       |
| `$tab-filler`              | #4b3f6b   | notebook.scss | category filler      |
| `$space-4`                 | 4px       | notebook.scss | spacing scale        |
| `$space-32`                | 32px      | notebook.scss | spacing scale        |
| `$radius-button`           | 6px       | notebook.scss | button radius        |
| `$radius-card`             | 10px      | notebook.scss | card radius          |
| `$radius-accent-underline` | 1.5px     | notebook.scss | page-header accent   |
| `$stroke-checkbox`         | 1.5px     | notebook.scss | checkbox border      |
| `$primary-shade`           | #3a2e5c   | notebook.scss | derived from primary |
| `$primary-tint`            | #5d527a   | notebook.scss | derived from primary |

## Verificación

- `npx jest src/theme` valida la compilación Sass y los pares WCAG AA de UI-21.3.
- `npm run lint:styles` aplica Stylelint con `color-no-hex` en consumidores.
- El catálogo se mantiene sincronizado con `_tokens.scss` mediante los tests en `src/theme/docs.spec.ts` (no incluido en C0.5, pendiente de 5.3 REFACTOR).
