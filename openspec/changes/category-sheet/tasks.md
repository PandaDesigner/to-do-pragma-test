## 1. Diseño

- [x] 1.1 Leer `get_design_context` y `get_variable_defs` de 4:869 y 4:947.
- [x] 1.2 Escribir proposal, design y specs.

## 2. Comando compartido y sheet base

- [ ] 2.1 RED: test de SHEET-06.3 que falle porque `openCategorySheet` no existe con tipo cerrado.
- [ ] 2.2 GREEN: añadir `signal<SheetRequest | null>` y método `openCategorySheet`/`closeCategorySheet` en `CategoriesStore`.
- [ ] 2.3 RED: tests de SHEET-01.1 y SHEET-01.4 que fallen porque `CategorySheetComponent` no existe.
- [ ] 2.4 GREEN: crear `CategorySheetComponent` standalone, OnPush, presentacional, con `mode` y `draft` por input y `save`, `delete`, `dismiss` por output; montarlo en el shell.
- [ ] 2.5 GREEN: scrim y esquinas superiores usando `--app-scrim` y `--app-radius-card` con esquinas inferiores a 0.

## 3. Campos Icon y Color con piezas locales

- [ ] 3.1 RED: test de SHEET-02.1 que falle porque el selector visual no existe.
- [ ] 3.2 GREEN: declarar `IconOptionComponent` local en el mismo archivo que el sheet, con `icon` y `selected` por input y `choose` por output.
- [ ] 3.3 GREEN: rejilla de seis columnas con 44 por 44, `--app-radius-input`, fondo `--app-surface-muted`, hueco 8 y las doce claves Unicode en el orden acordado.
- [ ] 3.4 RED: tests de SHEET-02.2 y SHEET-03.2 para el cambio de selección.
- [ ] 3.5 GREEN: borde de selección 2 px en `--app-primary` para la celda activa.
- [ ] 3.6 GREEN: declarar `ColorSwatchComponent` local con `colorToken` y `selected` por input; fila de seis muestras de 32 con hueco 12 en el orden Routine, Event, My, More, gris, primary.
- [ ] 3.7 GREEN: anillo de 2 px en `--app-primary` y check centrado para la muestra activa.

## 4. Campo Section y preview con chip extendido

- [ ] 4.1 RED: test de SHEET-07.1 que falle porque los chips de Sección no están en el sheet.
- [ ] 4.2 GREEN: renderizar tres `ChipComponent` General/Routine/Event usando el componente ya compartido.
- [ ] 4.3 RED: test de SHEET-04.2 que falle porque el chip no admite icono proyectado.
- [ ] 4.4 GREEN: añadir `<ng-content select="[appChipIcon]"></ng-content>` opcional en `ChipComponent` sin nuevos inputs.
- [ ] 4.5 RED: test de SHEET-04.1 que falle porque el preview no se actualiza en vivo.
- [ ] 4.6 GREEN: preview con `ChipComponent` que combina `icon`, `name` y `colorToken` leídos de `signal`s internos del sheet.

## 5. Acciones y enlace desde la página y el NewTaskModal

- [ ] 5.1 RED: test de SHEET-05.4 que falle porque "Delete category" aparece en `Create`.
- [ ] 5.2 GREEN: botón primario a todo el ancho (`width: 100%`) con `min-height: 50px` literal acotado al SCSS del sheet; textos "Save category" y "Save changes".
- [ ] 5.3 GREEN: enlace inferior "Delete category" en `--app-danger` solo en `Edit`.
- [ ] 5.4 RED: tests de SHEET-05.1, SHEET-05.2 y SHEET-05.3 para guardado inválido, guardado válido y borrado.
- [ ] 5.5 GREEN: integrar `save`, `delete` y `dismiss` con el `CategoriesStore` y los requisitos CAT-SEC-01.
- [ ] 5.6 RED: test de SHEET-01.3 que falle porque el NewTaskModal no invoca el comando.
- [ ] 5.7 GREEN: añadir el botón "Crear categoría" en el selector del NewTaskModal que llama a `openCategorySheet({ mode: 'create' })`.
- [ ] 5.8 GREEN: eliminar el `<form>` inline y los botones de borrar de la fila en `CategoriesPage`; mantener el FAB de creación.

## 6. Cierre

- [ ] 6.1 Capturas 375 por 812 en claro y oscuro, es y en, del sheet abierto y cerrado, con diff visual en `verify-report.md`.
- [ ] 6.2 Actualizar `openspec/traceability.md` con las filas SHEET-01 a SHEET-07 enlazando cada `it()` y la fila CAT-SEC-01 modificada.
- [ ] 6.3 Pasar tipos, lint, estilos, tests con cobertura (global 80 %, shared 90 %), build, `trace:check` y `openspec validate --strict`.
- [ ] 6.4 PR a `develop` con sección Reutilización: `ChipComponent` extendido, `IconOptionComponent` y `ColorSwatchComponent` declarados locales, `CategorySheetComponent` y comando `openCategorySheet` añadidos.