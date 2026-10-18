# fix-ui-fidelity — Verify report

Fecha: 2026-10-18. Rama `fix-ui-fidelity`, base `develop` en `aa78e71`.

## 1. Resumen

| # | Reportado | Estado | Evidencia |
| --- | --- | --- | --- |
| 1 | Empty state de Categories sin icono ni botón | Corregido y verificado | Tests + captura real |
| 2 | Orden de los botones del sheet | Corregido y verificado | Tests + captura real |
| 3 | Chevron del badge HOY debajo del texto | Corregido y verificado | Tests + captura real |

Los tres puntos terminan implementados. El punto 2 es el que más cambió respecto al enunciado: al medir los mocks, el orden **sí** estaba mal y la corrección resultó ser la esperada, pero la justificación es la que había que comprobar primero.

## 2. Verificación por problema

### 2.1 Empty state de Categories (Figma 4:1062, 4:1100)

Comparación de medidas contra `docs/mocks/todo-empty-state.png` y `docs/design.json` 4:1062:

| Elemento | Figma | Medido en el mock | Componente |
| --- | --- | --- | --- |
| `Illustration` | 68x68 en `x=173.5 y=276` | banda no blanca `y=280..340`, ancho ~68 | `EMPTY_ILLUSTRATION_SIZE = 68` |
| `CTA` | 239x50 en `x=88 y=471` | banda `primary` `y=471..520`, `x=88..326` | `EMPTY_ACTION_WIDTH = 239`, `EMPTY_ACTION_HEIGHT = 50` |

Los defaults ya coincidían con el mock, así que **no se tocaron**. La corrección es solo de uso: `CategoriesPage` pasa `[illustrated]="true"`, `[actionLabel]` y `(action)="openCreateSheet()"`.

Verificado en el navegador, `evidence/categories-empty-light-es.png`: el bloque `.illustration` se renderiza con `style="width: 68px; height: 68px"` y el botón dice "Crear categoría" / "Create a category".

### 2.2 Orden de las acciones del sheet (Figma 4:869)

Antes de tocar nada se midió `docs/mocks/categories-form-sheet.png` y el árbol de `docs/design.json` 4:869:

- Banda `primary` `(75, 63, 107)`: `y = 730..779`, `x = 29..345`. 50 de alto, 327 de ancho. Es `Button y=730 h=50 x=24 w=327`.
- La otra forma en la zona baja es una cápsula de `x = 26..297`, `y = 629..664`. Cae dentro de `Field/Color y=603 h=62`, o sea `y = 603..665`: son las muestras de color, no un botón.
- El nodo 4:869 no contiene las cadenas `Cancel` ni `Delete`.

Conclusión: el mock solo compone **un** botón de acción y no fija el orden relativo de Cancel. El orden correcto sale de `docs/mocks/new-task-modal.png` (4:1267), donde el editor compone el primario en `y = 730..780` con Cancel debajo, más la intención reportada de que ambas hojas coincidan.

Un test escrito antes de corregir devolvió `{"0": "sheet-cancel"}` como primer hijo, confirmando que el diagnóstico previo (Cancel antes que Guardar) era correcto y que el cambio de orden estaba justificado.

Verificado en el navegador: `Guardar categoría` en `y=657` y `Cancelar` en `y=719`, es decir Guardar arriba. En `evidence/categories-sheet-dark-en.png` se ve "Save category" sobre "Cancel".

`category-sheet.component.scss` no se modificó. Se comprobó que ninguna regla depende del orden: el SCSS no usa `:first-child`, `:last-child`, `:nth-*` ni selectores hermanos, y `.form-actions`, `.primary-action`, `.sheet-cancel` y `.danger-link` se aplican por clase. `[SHEET-UI-01.3]` falla si alguien introduce uno.

### 2.3 Chevron del badge HOY (Figma 4:440, 4:520)

Causa raíz confirmada: `todo.today` valía `"HOY ›"` y `"TODAY ›"`. El `›` era texto, así que `.today-badge`, siendo `inline-flex` con `gap: var(--app-space-8)`, tenía un solo nodo de texto y el gap no se aplicaba nunca.

Medición de `docs/mocks/todo-day-panel-open.png`:

- Caja del badge `x = 256..318`, `y = 57..78` (63x22). `design.json` da `TodayBadge w=63 h=21`.
- Tinta en `x = 263..313`, o sea 51 px dentro de 63 px.
- El mapa ASCII del badge muestra cinco grupos de glifos en una sola línea, con el chevron al final ocupando `x = 306..311`, unos 6 px y centrado verticalmente: un glifo vectorial, no un carácter de texto.

Cambios: el `›` sale de las dos traducciones, se añade `<ion-icon name="chevron-forward">` como hermano del texto, y `width: 63px` pasa a `min-width: 63px` para que la etiqueta no se parta.

Verificado en el navegador: `.today-badge` renderiza `ion-icon[name=chevron-forward]` y el `textContent` es exactamente "HOY" o "TODAY", sin `›`, sin partida de línea. Medido en `today-badge-light-es.png`, `today-badge-light-en.png`, `today-badge-dark-es.png` y `today-badge-dark-en.png`.

### 2.4 Capturas de `evidence/`

Diez PNG a **375x812**, light y dark, es y en:

| Pantalla | light-es | light-en | dark-es | dark-en |
| --- | --- | --- | --- | --- |
| `today-badge` | sí | sí | sí | sí |
| `categories-empty` | sí | sí | sí | sí |
| `categories-sheet` | sí | sí | sí | sí |

Capturadas con CDP (`Page.captureScreenshot`) sobre el build real servido en `localhost:8100`, con `Emulation.setDeviceMetricsOverride` a 375x812 y `deviceScaleFactor` 2, y reescaladas a 375x812 por `scripts/save-cdp-capture.py`. Son capturas de navegador, no de simulador nativo, y no son un diff de 2 px contra Figma.

## 3. Comandos ejecutados

| Comando | Resultado |
| --- | --- |
| `npm test` | 512 pasan, 56 suites (base: 494) |
| `npx jest --runInBand --coverage` | 94.09 % global, umbrales intactos |
| `npm run lint` | All files pass linting |
| `npm run lint:styles` | sin hallazgos |
| `npm run format:check` | All matched files use Prettier code style |
| `npm run typecheck` | limpio en `app` y `spec` |
| `npm run trace:check` | pasa |
| `npx openspec validate fix-ui-fidelity --strict` | Change 'fix-ui-fidelity' is valid |
| `npx openspec validate --all --strict` | Totals: 17 passed, 0 failed |
| `npx ng build --configuration development` | Application bundle generation complete |

Cobertura de lo tocado: `empty-state` 100 % en las cuatro métricas, `category-sheet` 98.95 %.

## 4. Hallazgo que el build detectó y Jest no

`ng build` falló con `NG8001: 'ion-icon' is not a known element` en `tasks.page.html`. `IonIcon` no estaba en el `imports` de `TasksPage`. Los tests de Jest pasaban igual porque el `TestBed` de la suite resuelve el elemento sin la comprobación estricta del compilador de plantillas. Corregido añadiendo `IonIcon` al array `imports` de `TasksPage`. Sin este build, el cambio habría llegado a `develop` roto.

## 5. Discrepancias documentadas, no corregidas

- `docs/design.json` describe `TodayBadge` con el texto `'TODAY ›'` como un único string. Este change separa el chevron del texto, así que esa descripción ya no refleja el DOM. Actualizar `docs/design.json` queda fuera de un `fix/*` que solo toca presentación; queda anotado en `proposal.md`.
- La fila de `4:1062` conserva su línea `registro` original **y** suma tres filas de escenario. Es la convención que ya usa el repo: un nodo puede tener fila de registro y de escenario a la vez.

## 6. Lo que queda pendiente

- **Fila de Notion**: el conector de Notion no está disponible en este entorno. No se ha escrito nada en Notion.
- **Simulador nativo**: no hay simulador iOS ni Android operativo aquí. La evidencia es de navegador. No es un diff de 2 px contra Figma y así queda escrito.
