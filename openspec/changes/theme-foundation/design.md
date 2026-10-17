## Context

La aplicación existe con Ionic 8 y Angular 22, usa Jest y Cordova. La descripción de config.yaml que dice solo documentación está desactualizada; no se modifica en este cambio. Los estilos usan tokens parciales `--color-*`, media queries de oscuro y literales locales. No hay fuentes empaquetadas ni Stylelint.

## Goals / Non-Goals

Objetivo: aplicar colores, fuentes y medidas trazables sin alterar funcionalidad; validar consumo y configuración mediante Jest y Stylelint y comprobar renderizado real.

Fuera de alcance: nuevas funciones, persistencia de preferencias, rediseño de flujos, modificación de dominio, Capacitor y cambios de runner. Las dimensiones sin respaldo y los valores estimados no se convierten silenciosamente en tokens Figma.

## Fuente Figma

Archivo: https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA

Referencias principales: `4:440` claro y `4:1560` oscuro. Fuentes de revisión añadidas: docs/auditoria-figma.md, docs/plan-theme-foundation.md, docs/prompts/theme-foundation.md y docs/workflow-mcp.md, ahora disponibles. La auditoría del 16-oct distingue C0.5 de C1/C2/C3/C7; no certifica que el código ya cumpla. Se consultaron get_design_context y get_screenshot para ambos; las capturas reportan 375x812. Fuentes complementarias obligatorias: `docs/design.json` y `docs/design.md`. Antes de cada cambio UI se contrastan las tres fuentes. No se usa la paleta del icono.

La fuente devuelve nombres como `--color-primary`, `--fs-display-date` y `--fs-body`; design.json denomina los dos últimos `--fs-date` y `--fs-regular`. El mapeo siguiente usa nombres públicos `--app-*` y conserva nombres Figma como referencia, no como una segunda fuente independiente de valores.

| Nodo Figma                                                                   | Pantalla            | Escenarios                | Consultas realizadas                            |
| ---------------------------------------------------------------------------- | ------------------- | ------------------------- | ----------------------------------------------- |
| [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440)   | todo-day-panel-open | UI-20.1, UI-21.1, UI-26.1 | variables, contexto y captura                   |
| [4:1560](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1560) | todo-dark-mode      | UI-21.3, UI-22.1, UI-25.1 | variables, contexto y captura                   |
| [4:788](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-788)   | categories-list     | UI-25.1, UI-26.1, UI-28.2 | contexto y captura; confirma --fs-display-title |
| [4:1267](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1267) | new-task-modal      | UI-24.1, UI-26.1, UI-28.2 | contexto y captura; confirma --fs-display-title |

## Mapeo Figma → src/theme

Los valores de color siguientes proceden de tokens.colors de design.json y la tabla de design.md; los presentes en los nodos consultados se contrastaron con sus respuestas. No todos los tokens aparecen visualmente en esos dos nodos.

| Token Figma         | Claro     | Oscuro    | Token SCSS (_tokens.scss) | Variable pública        | Archivo propietario         | Uso Ionic                                                |
| ------------------- | --------- | --------- | ------------------------- | ----------------------- | --------------------------- | -------------------------------------------------------- |
| color/primary       | #4B3F6B   | #8B7FC0   | $color-primary            | --app-primary           | variables.scss / _dark.scss | --ion-color-primary                                      |
| color/primary-dark  | #3A2E5C   | #EDEAF5   | $color-primary-dark       | --app-primary-dark      | variables.scss / _dark.scss | texto de controles y títulos                             |
| color/text          | #2E2547   | #EDEAF5   | $color-text               | --app-text              | variables.scss / _dark.scss | --ion-text-color                                         |
| color/text-muted    | #6B6580   | #6B6580   | $color-text-muted         | --app-text-muted        | variables.scss / _dark.scss | texto secundario                                         |
| color/surface       | #FFFFFF   | #1E1A2B   | $color-surface            | --app-surface           | variables.scss / _dark.scss | --ion-background-color                                   |
| color/surface-muted | #F2F2F4   | #2A2539   | $color-surface-muted      | --app-surface-muted     | variables.scss / _dark.scss | campos                                                   |
| color/border        | #E6E4EC   | #332D45   | $color-border             | --app-border            | variables.scss / _dark.scss | --ion-border-color                                       |
| color/card-border   | #D9D6E2   | #332D45   | $color-card-border        | --app-card-border       | variables.scss / _dark.scss | panel                                                    |
| color/check-empty   | #E4E1EE   | #E4E1EE   | $color-check-empty        | --app-check-empty       | variables.scss              | checkbox                                                 |
| color/accent-link   | #3AA8E0   | #3AA8E0   | $color-accent-link        | --app-accent-link       | variables.scss              | badge                                                    |
| color/on-primary    | #FFFFFF   | #FFFFFF   | $color-on-primary         | --app-on-primary        | variables.scss              | --ion-color-primary-contrast                             |
| color/danger        | #C5000F   | #C5000F   | $color-danger             | --app-danger            | variables.scss              | --ion-color-danger                                       |
| color/scrim         | #00000066 | #00000066 | $color-scrim              | --app-scrim             | variables.scss              | fondo de superposición; evitar doble aplicación del alfa |
| tab/todo            | #B8CFA8   | #B8CFA8D9 | $category-1               | --app-category-1        | variables.scss / _dark.scss | rail y categorías                                        |
| tab/routine         | #F28B8B   | #F28B8BD9 | $category-2               | --app-category-2        | variables.scss / _dark.scss | rail y categorías                                        |
| tab/event           | #9FC3CF   | #9FC3CFD9 | $category-3               | --app-category-3        | variables.scss / _dark.scss | rail y categorías                                        |
| tab/my              | #E8E1B8   | #E8E1B8D9 | $category-4               | --app-category-4        | variables.scss / _dark.scss | rail y categorías                                        |
| tab/more            | #C9C9C9   | #C9C9C9D9 | $category-5               | --app-category-5        | variables.scss / _dark.scss | rail y categorías                                        |
| tab/filler          | #4B3F6B   | #4B3F6BD9 | $category-filler          | --app-category-filler   | variables.scss / _dark.scss | rail                                                     |
| shadow/card         | #2E254714 | #2E254714 | $shadow-card-color        | --app-shadow-card-color | variables.scss              | sombra de panel                                          |
| shadow/fab          | #4B3F6B59 | #4B3F6B59 | $shadow-fab-color         | --app-shadow-fab-color  | variables.scss              | sombra FAB                                               |

Todos los archivos de la tabla viven en `src/theme`. La tabla indica consumidores: el propietario único de los valores crudos será `_tokens.scss`, que no emite CSS. `dark.scss` y `typography.scss` se implementarán como parciales `_dark.scss` y `_typography.scss`. Cada color Figma `color/nombre` corresponde al token SCSS `$color-nombre`, cada tab al `$category-1` a `$category-5` según orden de la tabla y filler a `$category-filler`; cada shadow a `$shadow-card-color` o `$shadow-fab-color`. El público de filler será `--app-category-filler`, sustituyendo el nombre provisional --app-tab-filler de la tabla. Las columnas de colores no cambian. Los valores derivados RGB y las variantes Ionic deben obtenerse de los colores base con la regla documentada de Ionic, no de la paleta del icono. Se verificará la API instalada antes de configurar variantes y backdrop. No se fija una fórmula de tint/shade sin esa verificación.

### Tipografía: Figma → typography.scss

| Estilo Figma     | Familia          | Peso | Tamaño px | Tracking px | Variable de tamaño          |
| ---------------- | ---------------- | ---- | --------- | ----------- | --------------------------- |
| Display/Date     | DM Serif Display | 400  | 38        | -0.3        | --app-font-size-date        |
| Display/Title    | DM Serif Display | 400  | 36        | 0           | --app-font-size-title       |
| Body/Overline    | Inter            | 600  | 15        | 0           | --app-font-size-overline    |
| Body/Panel Title | Inter            | 600  | 15        | 0           | --app-font-size-panel-title |
| Body/Task Title  | Inter            | 700  | 17        | 0           | --app-font-size-task-title  |
| Body/Note Title  | Inter            | 700  | 16        | 0           | --app-font-size-note-title  |
| Body/Regular     | Inter            | 400  | 14        | 0           | --app-font-size-body        |
| Body/Meta        | Inter            | 400  | 14        | 0           | --app-font-size-meta        |
| Body/Button      | Inter            | 600  | 14        | 0           | --app-font-size-button      |
| Body/Tab         | Inter            | 600  | 13        | 0           | --app-font-size-tab         |
| Body/Badge       | Inter            | 600  | 11        | 0.4         | --app-font-size-badge       |

Familias: `--app-font-display` y `--app-font-body`; `--ion-font-family` referencia la segunda. Declaraciones @font-face solo en typography.scss; archivos locales en src/assets/fonts con su licencia y procedencia. DM Serif Display solo 400; prohibida negrita sintética. No se ha elegido un proveedor de descarga sin verificar los archivos y licencias.

Interlineado: la copia offline registra `100% (normal)` y Figma responde con metadatos 100 y código `leading-[normal]` en 4:440, 4:788 y 4:1267. Se documenta la unidad CSS `normal` como referencia para los once estilos; el navegador aplica el alto según la fuente y el tamaño. La tarea 0.3 queda resuelta sin inventar un valor de píxel.

### Medidas: Figma → variables.scss

| Fuente                   | Valores                                                                                                                                                            | Variables públicas                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| tokens.space             | 4, 8, 12, 16, 24, 32 px                                                                                                                                            | --app-space-4 a --app-space-32                                                                                                     |
| tokens.radius            | badge 2, checkbox 3, button 6, tab 8, card 10, input 10, accentUnderline 1.5 px; round 50 % (decisión C0.5); 999 sigue documentado como Figma para futura consulta | --app-radius-*                                                                                                                     |
| tokens.grid              | railWidth 27, contentPaddingLeft 37, contentX 64, contentWidth 311, topPadding 55, topActionsPaddingRight 18 px                                                    | --app-rail-width, --app-content-padding-left, --app-content-x, --app-content-width, --app-content-top, --app-actions-padding-right |
| tokens.grid              | panelX 62, panelWidth 300, FAB x292 y730 size68 px                                                                                                                 | --app-panel-x, --app-panel-width, --app-fab-x, --app-fab-y, --app-fab-size                                                         |
| tokens.stroke            | checkbox 1.5, divider 1 px                                                                                                                                         | --app-stroke-checkbox, --app-stroke-divider                                                                                        |
| tokens.gapsUsados        | 3, 15, 8, 16, 83, 24, 13, 8, 11 px según nombre de origen                                                                                                          | --app-gap-* por intención                                                                                                          |
| tokens.shadow            | card: 0 4px 16px 0; FAB: drop-shadow(0 8px 10px ...)                                                                                                               | --app-shadow-card, --app-shadow-fab                                                                                                |
| Componentes documentados | tarea 65, categoría 77, checkbox cuadrado 29 y circular 26 px                                                                                                      | --app-task-height, --app-category-height, --app-checkbox-square, --app-checkbox-circle                                             |

No se deducen medidas de coincidencias numéricas. El usuario autorizó conservar los valores heredados sin equivalente visual como tokens técnicos separados de Figma, incluidos breakpoints 480/768 y ancho desktop 880. Antes de migrarlos se registra su valor real y uso en una tabla de tokens técnicos; no se atribuyen a Figma. Esta autorización preserva comportamiento, no autoriza ignorar una corrección C0.5 de la auditoría. La tabla concreta de tokens técnicos se construye en la tarea 0.5 de fase A, con valor real, archivo de origen y uso documentado. SheetTop 16, stroke de iconos y motion 200ms están marcados como estimados en las fuentes: no se implementan como medidas verificadas.

## Decisions

Se reutilizan las capas actuales; no hay nuevo estado ni persistencia. La centralización y los nombres `--app-*`, el uso de Sass moderno y las entradas de angular.json fueron exigidos por el usuario. El costo inicial es migrar consumidores y ampliar pruebas; evita múltiples fuentes de valores en próximas pantallas.

### CRC

La tabla «Responsabilidades CRC complementarias» al final de este documento define el contrato por archivo y sus escenarios. Es la única tabla CRC aplicable.

El usuario aprobó conservar el oscuro del sistema y permitir forzarlo con `.ion-palette-dark`, sin persistencia ni toggle nuevo. La decisión posterior del usuario sustituye las clases body.dark/body.light propuestas por el plan; no se añaden en C0.5. Retirar .ion-palette-dark restaura el sistema. Escenarios: UI-22.1, UI-22.2 y UI-22.3. Se reemplaza dark.system.css por _dark.scss para evitar dos orígenes de paleta.

Mapeo de variantes Ionic (cuyo cierre se exige a la tarea 0.4): `light` parte de `#FFFFFF` con contraste `#2E2547`, `medium` de `#6B6580` con contraste `#FFFFFF` y `dark` de `#1E1A2B` con contraste `#EDEAF5`. Sus RGB, contrast-rgb, shade y tint se derivan consultando la API instalada antes de la implementación; los valores 75, 63, 107, `#3A2E5C` y `#5D527A` son el patrón documentado para `primary` y sirven de referencia, no de copia ciega.

## Risks / Trade-offs

- Contraste muted oscuro: Notion C0.5 y la auditoría registran la decisión de Pedro del 16-oct de conservar #6B6580 sobre #1E1A2B, aproximadamente 3:1, priorizando fidelidad sobre AA para ese token. Riesgo aceptado: no declarar cumplimiento AA para ese texto ni usarlo para información crítica. Otros conflictos de contraste se reportan, no se consideran cubiertos por esa excepción.
- Interlineado y medidas sin fuente: bloquear las tareas afectadas hasta resolver, no inventar.
- Fuentes offline: comprobar peso, licencia y carga real; no confundir font-family declarado con fuente cargada.
- Jest/jsdom no comprueba fidelidad visual: usar navegador para capturas light/dark y fuentes efectivas.
- Sass @use de CSS Ionic: verificar compilación y orden antes de retirar la entrada antigua.
- docs/workflow-mcp.md ya está disponible y se ha leído. Exige fase A con PR documental y aprobación antes de fase B; no se afirma que las aprobaciones anteriores revisaron un PR todavía inexistente.

## Migration Plan

Primero pruebas Jest RED por tarea, luego mínimo GREEN y REFACTOR con nueva ejecución. Solo marcar tareas tras verificarlas. Conservar cobertura configurada. Mantener package.json cordova.platforms vacío usando el comando existente, sin añadir plataformas. Registrar evidencia real y comandos en verify-report.md.

Reversión: revertir los commits del cambio; no modifica datos persistidos. No archivar ni fusionar. Antes del PR borrador ejecutar coverage, lint, lint:styles, formato, tipos y build production; enlazar capturas propias 375x812 y get_screenshot de ambos nodos.

## Open Questions

Confirmar Display/Title y Body/Note Title como cssVar en Figma y revisar conflictos de contraste distintos de muted. La discrepancia de radio round queda cerrada con 50 % para elementos circulares; el valor Figma 999 se documenta para consulta posterior. Confirmar proveedor y licencia de fuentes antes de empaquetar. Las medidas técnicas heredadas ya fueron autorizadas como categoría separada. El workflow ya está disponible.

## Trazabilidad de la auditoría Figma

| Hallazgo de docs/auditoria-figma.md                                                                | Tratamiento C0.5                                                                          | Escenarios       |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------- |
| on-primary no debe seguir a surface; faltan card-border, check-empty, accent-link, scrim y sombras | Tokens crudos en _tokens y emisión/puente en variables                                    | UI-20.1, UI-21.1 |
| Muted oscuro #B4AEC5 difiere de #6B6580                                                            | Aplicar decisión Notion con riesgo AA explícito                                           | UI-21.3, UI-22.1 |
| Tabs oscuros sin D9; filler usa primario oscuro                                                    | Tabs y filler independientes con alfa documentado                                         | UI-25.1          |
| Familias declaradas pero no cargadas                                                               | Woff2 locales con licencia, Inter 400/600/700 y DM Serif Display 400                      | UI-26.1, UI-26.2 |
| Once estilos incompletos y tamaños meta/ayudas/labels erróneos                                     | Tamaños/pesos/tracking de la tabla; resolver unidades de interlineado antes de aplicarlas | UI-26.1          |
| Padding top 32, gaps de header 20/20, radio de acento 2                                            | Tokens Figma: top 55, gaps 3/15, radio 1.5                                                | UI-28.2, UI-24.1 |
| Input y botón base divergentes                                                                     | Input 50, radio 10, padding 16, surface-muted sin borde; botón 50 y padding horizontal 16 | UI-28.2, UI-24.1 |
| Home tiene #8c8c8c y medidas de scaffolding                                                        | Migrar consumo sin eliminar página o comportamiento                                       | UI-24.1          |
| --fs-date y --fs-regular difieren de Figma                                                         | Corregir copia offline a --fs-display-date y --fs-body tras comprobación                  | UI-28.2          |
| Verificar nombres de title/note-title; sheets 4:947 y 4:1365 omitidos                              | Consultar 4:788/4:1267; documentar padres 4:869/4:1267 y no inventar contenido            | UI-28.2          |
| Sexto swatch de 4:869 indefinido                                                                   | Pendiente para C2; no crear sexto color                                                   | UI-25.1          |
| Rail completo, panel, FAB, TODAY, checkbox y sheet nuevos, swipe, textos de pantallas              | Pendientes C1, no incluidos en C0.5                                                       | UI-28.2          |
| Swatch 27, chips 33/35, ColorPicker, CategoryRow y sheets                                          | Pendientes C2; C0.5 solo expone tokens requeridos                                         | UI-28.2          |
| Filler 258 con feature flag apagado y comparación final                                            | Pendientes C3 y C7 respectivamente                                                        | UI-28.2          |

## Responsabilidades CRC complementarias

| Archivo                 | Estereotipo        | Responsabilidad y escenario                                                                                              | Colaboradores                          |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| _tokens.scss            | Information holder | Valores crudos Figma y técnicos diferenciados; sin CSS (UI-20.1)                                                         | variables, _dark, _typography, _mixins |
| variables.scss          | Interfacer         | Emitir --app/--ion y aliases temporales --color/--tab, RGB/contrast/shade/tint (UI-21.1)                                 | _tokens, Ionic                         |
| _dark.scss              | Controller         | Paleta activa por sistema/clases aprobadas (UI-22.1)                                                                     | _tokens, variables                     |
| _mixins.scss            | Service provider   | bp-up, truncate, focus-visible y safe-area con tokens (UI-26.3)                                                          | _tokens y consumidores                 |
| _typography.scss        | Structurer         | @font-face y jerarquía h1–h6, p y small (UI-26.1, UI-26.2)                                                               | _tokens y assets/fonts                 |
| global.scss             | Coordinator        | Composición Ionic y _notebook mediante Sass moderno (UI-23.1)                                                            | parciales                              |
| README.md               | Information holder | Fila por token con origen, light/dark y uso (UI-28.3)                                                                    | _tokens y theme.spec.ts                |
| Stylelint y lint:styles | Guard              | Impedir colores y medidas prohibidas en consumidores; ejecutar en CI (UI-27.1)                                           | verify.yml                             |
| theme.spec.ts           | Verifier           | Compilar con sass.compile; comprobar valores, entradas, contraste y README (UI-20.1, UI-21.2, UI-21.3, UI-23.2, UI-28.3) | Sass, fuentes y configuración          |

Esta tabla es el contrato CRC aplicable; los nombres de parciales en el mapeo se interpretan según ella. Los aliases --color/--tab son solo transitorios y se eliminan al completar la migración. Los colores Ionic secondary/tertiary/success/warning quedan por defecto, documentados como no definidos en Figma.
