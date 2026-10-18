## Context

`CategoriesPage` renderiza un `<form>` inline con tres `<select>` y un botón de guardar que no existe en Figma. El nodo `4:869` muestra un bottom sheet con cuatro campos, un preview en vivo y dos acciones separadas. El nodo `4:947` muestra el panel del sheet abierto. El change `todo-screen` extrajo `chip` y `page-header`, y dejó el sheet como trabajo siguiente. La spec `category-sections` exige mantener el campo Sección (CAT-SEC-01). El inventario `docs/components-inventory.md` declara al sheet de categoría como segundo uso previsto de un `bottom-sheet` shared (Prioridad Media), y al selector de color como bloque local (Baja: un uso). La regla permanente prohíbe subir a `shared/components/` algo con un solo consumidor real.

## Goals / Non-Goals

**Goals:**

- El sheet de Categorías coincide en medidas y contenido con `4:869` y `4:947`: padding 24/8/24/32 (top/right/bottom/left), gap 16, handle 36 por 5, título serif 36 px, cuatro campos, preview y dos acciones (Save primaria y Delete texto en `color/danger` solo en `Edit`).
- `CategorySheetComponent` es reutilizable desde `CategoriesPage` (modo `Create` desde el FAB y modo `Edit` desde la fila) y desde el selector de categoría del NewTaskModal (solo `Create`).
- El comando `openCategorySheet(mode, draft?)` vive en `CategoriesStore`. La página de tareas no abre el sheet por su cuenta.
- `ChipComponent` admite icono vía `ng-content` sin añadir inputs. El preview del sheet lo usa tal cual.
- `IconOption` y `ColorSwatch` son piezas locales del sheet enlazadas por DI, no viven en `shared/components/`.
- El campo Sección se conserva como cuarta fila del sheet con chips General/Routine/Event.
- Cobertura global 80 % y shared 90 %; umbrales no se bajan.

**Non-Goals:**

- Rediseñar la página Categorías fuera del sheet ni cambiar el rail.
- Sustituir el `<select>` del NewTaskModal por otra UI distinta; solo se añade el botón "Crear categoría" que abre el sheet.
- Mover la lógica de validación de Sección a otro componente; sigue siendo decisión del store.
- Cambiar el `CategoriesRepository` ni los datos existentes.
- Crear tokens nuevos (`--app-button-height-large`, etc.); se reutilizan `--app-touch-target` (44) para la celda del icono, `--app-radius-input` para el input, `--app-space-*` para huecos y padding. La altura del botón primario grande se construye con `100%` del ancho del sheet (327 px útiles) y `min-height: 50px` literal acotado al SCSS del sheet.
- Anadir nuevos SVGs de los doce iconos; se usan caracteres emoji del set del sistema y el sheet declara su dependencia en un comentario de código, no en un binario sin firmar.

## Fuente Figma

| Nodo | Pantalla | Escenarios | Notas |
| --- | --- | --- | --- |
| [4:869](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869) | categories-form-sheet | SHEET-01.1, SHEET-01.2, SHEET-02.1, SHEET-03.1, SHEET-04.1 | Sheet cerrado: handle, título, Name, Icon, Color, Section, preview y acciones |
| [4:947](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-947) | categories-form-sheet-panel | SHEET-01.3 | Sheet abierto sobre la lista de categorías con scrim |

## Mapeo Figma → src/theme

No hay variables nuevas. Se usan los tokens ya expuestos:

| Pieza del rediseño | Token |
| --- | --- |
| Fondo del sheet y del campo | `--app-surface` |
| Fondo del input y de las celdas inactivas | `--app-surface-muted` |
| Borde del handle y de las celdas inactivas | `--app-border` |
| Borde y anillo de selección | `--app-primary` |
| Acción de borrado | `--app-danger` |
| Label "Name" y "Icon" | `--app-text-muted` con clase `.meta` |
| Título del sheet | clase `.title` (`DM Serif Display`, 36 px) |
| Esquinas superiores | `--app-radius-card` (10 px) más esquinas inferiores a 0 |
| Radio del input, de las celdas y de las muestras | `--app-radius-input` (10 px) |
| Huecos y padding | `--app-space-8`, `--app-space-12`, `--app-space-16`, `--app-space-24`, `--app-space-32` |
| Scrim | `--app-scrim` ya puenteado a `--ion-backdrop-color` |
| Paleta de las seis muestras | `--app-category-1` a `--app-category-5` y `--app-category-filler` |
| Sombra del sheet | `--app-shadow-card` (0 4px 16 px) |

## Medidas de `get_design_context`

Lienzo 375 por 487 para el sheet (`4:869`). Padding 24 arriba, 8 derecha, 24 abajo, 32 izquierda. Gap 16 entre filas. Handle centrado de 36 por 5, color `--app-border`, radio `--app-radius-pill`.

Título "Edit category" en `.title` (36 px, DM Serif Display). En modo `Create` el texto es "New category".

Campo Name: label `.meta` en `--app-text-muted`, input de 50 de alto, `--app-radius-input`, fondo `--app-surface-muted`, valor inicial "Shopping".

Campo Icon: label igual al anterior. Rejilla de seis columnas con celdas de 44 por 44 (`--app-touch-target`), `--app-radius-input`, fondo `--app-surface-muted`, hueco 8 entre celdas y entre filas. Doce opciones en este orden: carrito, casa, maletín, corazón, libro, avión, tenedor, bíceps, nota musical, huella, billete, estrella. La celda activa lleva borde 2 px en `--app-primary`.

Campo Color: seis muestras de 32 por 32 con hueco 12. Orden: Routine, Event, My, More, gris, primary (esta última es `--app-category-filler`). La activa lleva anillo 2 px en `--app-primary` y un check centrado.

Campo Section: tres chips General/Routine/Event con `--app-chip-height`, token activo bajo un borde `--app-primary` y fondo `--app-primary` con texto `--app-on-primary`.

Preview: una fila con `ChipComponent` extendido que muestra el icono elegido, el nombre y el color. Reutiliza el componente shared.

Acciones: botón primario a todo el ancho (327 por 50) con texto "Save category" en modo `Create` y "Save changes" en modo `Edit`. Debajo, en modo `Edit` solo, un botón de texto "Delete category" en `--app-danger`.

Detrás del sheet, scrim al 40 % negro (`--app-scrim`).

## Decisions

1. El sheet se monta sobre `ion-modal` con `ion-content` propio y `breakpoints` para que el scrim y las esquinas superiores redondeadas los gestione Ionic. No se crea un `shared/components/bottom-sheet/` propio: el inventario recomienda reutilizar `ion-modal` y la estructura común es el `CategorySheetComponent`, no un wrapper genérico.
2. `CategorySheetComponent` es standalone, OnPush, presentacional, sin acceso a `store` ni `data`. La página le pasa el `mode`, el `draft` y recibe `save`, `delete` y `dismiss` por output. Validación y persistencia siguen en la página y en el `CategoriesStore`.
3. `IconOptionComponent` y `ColorSwatchComponent` son piezas declaradas en el mismo archivo que el sheet y expuestas solo por su selector; no se registran en `shared/components/index.ts`. El selector del sheet las instancia mediante DI local y referencia su ciclo de vida. La regla del inventario (dos usos reales) se respeta: solo el sheet las usa.
4. `ChipComponent` extiende su plantilla con un `<ng-content select="[appChipIcon]"></ng-content>` opcional antes del texto. No se añade `icon` ni `emoji` como input. Los consumidores actuales no proyectan nada y siguen funcionando.
5. El comando `openCategorySheet` vive en `CategoriesStore` como `signal<SheetRequest | null>(null)`. La página de Categorías y el NewTaskModal escriben en él; un único `<app-category-sheet>` declarado en el shell lo lee y se abre. Esa indirección evita que el NewTaskModal importe `CategorySheetComponent`.
6. La altura del botón primario se construye con `width: 100%` sobre el ancho del sheet y `min-height: 50px`. La celda del icono reusa `--app-touch-target` (44). El handle mide 36 por 5 literal en el SCSS del sheet con comentario que lo aísla de la regla de literales generales.
7. El campo Sección se renderiza como `ChipComponent` tres veces (General, Routine, Event). El ancho se ajusta con la prop ya existente; no se añade un sexto componente.
8. La acción "Delete category" se monta como `<button type="button" class="link-danger">` dentro del bloque de acciones; el sheet no importa `IonButton` propio para esa fila.
9. El preview del sheet combina `ChipComponent` con un `<span appChipIcon>` proyectado; el contenido cambia con `signal`s internos del sheet (`icon`, `name`, `colorToken`) que se recalculan al modificar cualquier campo.
10. Los doce iconos son caracteres Unicode del set del sistema (`U+1F6D2` carrito, `U+1F3E0` casa, `U+1F4BC` maletín, `U+2764` corazón, `U+1F4DA` libro, `U+2708` avión, `U+1F374` tenedor, `U+1F4AA` bíceps, `U+1F3B5` nota musical, `U+1F43E` huella, `U+1F4B0` billete, `U+2B50` estrella). No se exportan SVGs; el sheet declara la dependencia en un comentario y la cobertura se prueba con un test que renderiza la rejilla y verifica que las doce claves existen.

## Risks / Trade-offs

- [El emoji depende del set del sistema] → La cobertura garantiza que los doce caracteres aparecen en la rejilla. La apariencia puede variar entre dispositivos; la tolerancia de 2 px se mide sobre Android/iOS de referencia y se anota en `verify-report.md`.
- [El sheet de Edit reusa el FAB de Create] → El FAB sigue funcionando; la fila de la categoría llama directamente al comando `openCategorySheet({mode: 'edit', draft})`. El FAB no se desactiva al editar para no añadir estado global.
- [El preview reusa `ChipComponent` con icono] → Los consumidores previos del chip no proyectan nada y no se ven afectados; la cobertura del chip añade un test que verifica que la proyección opcional no rompe el render cuando está vacía.
- [El comando del store crea un acoplamiento] → El sheet solo expone `mode` y `draft`; el `signal` es de tipo cerrado (`SheetRequest` con `mode` discriminado). El NewTaskModal no conoce las piezas internas del sheet.
- [El sheet rompe la regla de literales con el alto del botón] → Se aísla en `category-sheet.component.scss` con un comentario; los demás componentes no copian ese literal. Si el proyecto decide más adelante promoverlo a token, ese cambio queda en otro change.

## Migration Plan

No hay migración de datos. Si el sheet falla al abrir, se vuelve al `<form>` inline de develop en un commit `fix(categories): ...` separado.

## Open Questions

Ninguna que cambie el resultado. La paginación de la rejilla (dos filas de seis) sale del CSS Grid con `grid-template-columns: repeat(6, 1fr)` y se ajusta sola en dark mode.