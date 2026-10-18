## Fuente Figma

Canvas `0:1` del archivo [F6ztYiRO9b0xYZA38xSTIA](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA).

| Nodo | Pantalla | Mock local | Uso en este change |
| --- | --- | --- | --- |
| [4:1062](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1062) | `todo-empty-state` | `docs/mocks/todo-empty-state.png` | Empty state de Tasks y de Categories |
| [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440) | `todo-day-panel-open` | `docs/mocks/todo-day-panel-open.png` | Badge HOY, panel abierto |
| [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520) | `todo-panel-closed` | `docs/mocks/todo-panel-closed.png` | Badge HOY, panel cerrado |
| [4:869](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869) | `categories-form-sheet` | `docs/mocks/categories-form-sheet.png` | Orden de las acciones del sheet |
| [4:1100](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1100) | `icon/clipboard` | `docs/mocks/todo-empty-state.png` | Ilustración del empty state |

## Approach

Las tres correcciones se hacen sobre componentes shared que ya existen. No se crea ningún componente nuevo.

### 1. Empty state de Categories

`CategoriesPage` ya renderiza `app-empty-state` con `[title]` y `[hint]`. Se le pasan `[illustrated]="true"`, `[actionLabel]="'category.emptyAction' | translate"` y `(action)="openCreateSheet()"`.

Los valores por defecto de `EmptyStateComponent` ya coinciden con 4:1062 y **no se tocan**:

| Constante | Valor | Medido en el mock |
| --- | --- | --- |
| `EMPTY_ILLUSTRATION_SIZE` | 68 | `Illustration x=173.5 y=276 w=68 h=68` |
| `EMPTY_ACTION_WIDTH` | 239 | `CTA x=88 w=239` |
| `EMPTY_ACTION_HEIGHT` | 50 | `CTA h=50` (banda `primary` medida en `y=471..520`) |
| `illustrationIcon` | `clipboardCheck` | `icon/clipboard` 4:1100 |

Los defaults se comparten con `TasksPage`, que ya pasa los cuatro. Cambiarlos paraCategories habría roto Tasks, así que la corrección es solo de uso.

La acción llama a `openCreateSheet()`, el mismo camino que el FAB, para que el CTA abra la hoja de creación.

### 2. Orden de los botones del sheet

El CSS ya es idéntico entre las dos hojas: `.form-actions` es `display: flex; flex-direction: column; gap` en `category-sheet.component.scss` y en `.editor-form .form-actions` de `tasks.page.scss`. Lo único que difiere es el orden en el DOM.

Estado actual, verificado con un test que falla antes de la corrección: `category-sheet.component.html` pone `.sheet-cancel` (línea 95) antes que `.primary-action` (línea 98). `tasks.page.html` pone el `submit` de guardar (línea 327) antes que el de cancelar (línea 331).

Medición sobre `docs/mocks/categories-form-sheet.png`, dentro de la caja de la hoja (`x` 24..351):

- Banda de relleno `primary` `(75, 63, 107)`: `y = 730..779`, `x = 29..345`. Alto 50, ancho 327. Coincide con `Button y=730 h=50 x=24 w=327` de `docs/design.json`.
- La única otra forma en la zona baja es una cápsula de `x = 26..297`, `y = 629..664`, con `primary` en un 20 % de los píxeles. Cae dentro de `Field/Color y=603 h=62`, o sea `y = 603..665`: son las muestras de color, no un botón.
- `docs/design.json` 4:869 no contiene las cadenas `Cancel` ni `Delete` en ese nodo.

Conclusión: **el mock de categorías no compone Cancel ni Delete**, así que no fija el orden relativo de esos botones. El orden se toma de `docs/mocks/new-task-modal.png` (4:1267), donde el editor compone el primario en `y = 730..780` y tampoco dibuja un Cancel separado; la intención de que ambas hojas coincidan viene del reporte visual. El dato duro disponible es el orden del DOM del editor de tareas, ya corregido: Guardar arriba, Cancelar abajo.

Cambio: reordenar los dos `button` dentro de `.form-actions` para poner `.primary-action` primero y `.sheet-cancel` después. `.danger-link` queda al final, así que en modo `Edit` el orden es Guardar, Cancelar, Eliminar.

No se toca el SCSS. Verificado que no hay selectores dependientes del orden: `category-sheet.component.scss` no usa `:first-child`, `:last-child`, `:nth-*` ni selectores hermanos, y `.form-actions`, `.primary-action`, `.sheet-cancel` y `.danger-link` se aplican por clase. `src/theme/_notebook.scss` define un `.form-actions` genérico que tampoco depende del orden.

### 3. Badge HOY

Origen real del problema: `todo.today` vale `"HOY ›"` y `"TODAY ›"`. El `›` es texto, no un icono. `.today-badge` es `display: inline-flex` con `gap: var(--app-space-8)`, pero con un solo nodo de texto el gap no se aplica nunca, y con `width: 63px` fijo el texto se parte.

Medición sobre `docs/mocks/todo-day-panel-open.png`:

- Caja del badge: `x = 256..318`, `y = 57..78`, es decir 63x22. Coincide con `TodayBadge w=63 h=21` de `docs/design.json`.
- La tinta ocupa `x = 263..313`: 51 px de contenido dentro de 63 px, con margen a ambos lados.
- Hay cinco grupos de glifos separados por huecos, y el último es el chevron: `H`, `O`, `Y`, espacio, `›`. El chevron ocupa `x = 306..311`, o sea ~6 px de ancho y centrado verticalmente en la caja. Un glifo-vectorial, no un carácter de texto que separe.

El ASCII del badge confirma el texto en una sola línea, con el chevron a la derecha y en el mismo eje vertical:

```
  64..?+++++++..++++...+++++.....?++..++?...++...............
  65..?######+.+####+..+#####?...+##..?#+..+#?...............
```

Cambio, en tres partes:

1. `es.json` y `en.json`: `"today": "HOY"` y `"today": "TODAY"`. El `›` sale del texto traducible. Los dos locales siguen alineados, así que `[I18N-01.4]` no se toca ni se debilita.
2. `tasks.page.html`: `<ion-icon name="chevron-forward">` dentro del botón, junto al texto. Al ser un elemento hermano, el `gap: var(--app-space-8)` del flex se aplica de verdad.
3. `tasks.page.scss`: `width: 63px` pasa a `min-width: 63px`. Figma fija 63 px y el texto cabe; `min-width` conserva esa medida como mínimo sin partir "TODAY" en viewports estrechos o con fuente de sistema distinta.

`chevron-forward` viene de `ionicons/icons`, que ya se usa en `task-item`, `fab-button` y `category-icons`. No hace falta `addIcons` porque el resto del proyecto pasa el icono por `[icon]`.

## Mapeo a tokens

| Valor | Token | Archivo |
| --- | --- | --- |
| Tamaño del texto del badge | `--app-font-size-badge` | `src/theme/_typography.scss` |
| Color del borde y del texto | `--app-accent-link` | `src/theme/_tokens.scss` |
| Radio del badge | `--app-radius-badge` | `src/theme/_tokens.scss` |
| Separación texto-chevron | `--app-space-8` | `src/theme/_spacing.scss` |

No se introduce ningún valor visual suelto.

## Decisiones

- El chevron se pinta como `ion-icon` y no como carácter porque el mock lo dibuja como glifo vectorial con su propio ancho, y porque es lo único que hace que el `gap` existente funcione.
- `min-width` en lugar de `width`: mantiene los 63 px de Figma sin introducir un corte de texto. Pedro no ha confirmado preferencia entre las dos; esta es la opción que no puede partir el badge.
- Se reordena el DOM y no el SCSS. `.form-actions` ya es una columna con `gap`, así que mover los `button` basta y no altera ninguna medida.

## Riesgos

- `chevron-forward` puede no estar registrada globalmente en `ionicons` en el build de Cordova. Se mitiga importing el icono y pasándolo por `[icon]`, igual que `TaskItemComponent`.
- Quitar el `›` de la traducción cambia `tasks.page.spec.ts`, que hoy comprueba `textContent` con `toContain('TODAY')`. Esa aserción sigue siendo válida; no se relaja.
- Las capturas de `evidence/` son de navegador a 375x812. No son un diff de 2 px contra Figma y no son de un simulador nativo.

## Rollback

Revertir la rama. Sin migración de esquema ni de almacenamiento.
