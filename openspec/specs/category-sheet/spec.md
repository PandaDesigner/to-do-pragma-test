# category-sheet Specification

## Purpose
TBD - created by archiving change category-sheet. Update Purpose after archive.
## Requirements
### Requirement: SHEET-01 Hoja modal reutilizable para crear y editar categoría

`CategorySheetComponent` MUST ser un único `ion-modal` que se abra en modo `Create` desde el FAB de `CategoriesPage` y desde el botón "Crear categoría" del selector del NewTaskModal, y en modo `Edit` desde la fila de la categoría en `CategoriesPage`. La hoja MUST compartir la misma composición visual en ambos modos y solo cambiar el título ("New category" o "Edit category"), el texto del botón primario ("Save category" o "Save changes") y la presencia de la acción "Delete category". Figma: [4:869](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869) y [4:947](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-947).

#### Scenario: SHEET-01.1 Modo Create desde el FAB

- **GIVEN** la página Categorías, conforme a Figma 4:869
- **WHEN** se pulsa el FAB de creación
- **THEN** se abre `CategorySheetComponent` con `mode = 'create'` y `draft = undefined`
- **AND** el título visible es "New category"
- **AND** el botón primario dice "Save category"
- **AND** no se muestra la acción "Delete category".

#### Scenario: SHEET-01.2 Modo Edit desde la fila

- **GIVEN** una fila de categoría existente en la página Categorías
- **WHEN** se pulsa el botón de editar de esa fila
- **THEN** se abre `CategorySheetComponent` con `mode = 'edit'` y `draft = { id, name, icon, colorToken, section }`
- **AND** el título visible es "Edit category"
- **AND** el botón primario dice "Save changes"
- **AND** la acción "Delete category" está visible en `color/danger`.

#### Scenario: SHEET-01.3 Apertura desde el NewTaskModal

- **GIVEN** el selector de categoría del NewTaskModal con la lista de categorías
- **WHEN** se pulsa el botón "Crear categoría"
- **THEN** se llama al comando `openCategorySheet({ mode: 'create' })` del `CategoriesStore`
- **AND** la misma instancia de `CategorySheetComponent` montada en el shell abre el modal
- **AND** el NewTaskModal no importa `CategorySheetComponent` ni su plantilla.

#### Scenario: SHEET-01.4 Cierre con scrim y esquinas

- **GIVEN** `CategorySheetComponent` abierto, conforme a Figma 4:947
- **WHEN** se muestra sobre la página Categorías
- **THEN** el scrim usa `--app-scrim` con la opacidad ya puenteada a `--ion-backdrop-color`
- **AND** las esquinas superiores redondean con `--app-radius-card`
- **AND** las esquinas inferiores no redondean.

### Requirement: SHEET-02 Selector visual de icono con doce opciones

El campo Icon MUST renderizarse como una rejilla de seis columnas con doce opciones en este orden: carrito, casa, maletín, corazón, libro, avión, tenedor, bíceps, nota musical, huella, billete, estrella. Cada celda MUST medir 44 por 44 (`--app-touch-target`), tener `--app-radius-input`, fondo `--app-surface-muted` y un hueco de 8 entre celdas y filas. La celda activa MUST llevar un borde de 2 px en `--app-primary`. Figma: 4:869.

#### Scenario: SHEET-02.1 Render por defecto y selección

- **GIVEN** el sheet abierto en modo `Edit` con `draft.icon = 'cart'`
- **WHEN** se renderiza el campo Icon
- **THEN** aparecen doce celdas en el orden citado
- **AND** la celda del carrito lleva el borde de selección
- **AND** las demás celdas quedan sin borde.

#### Scenario: SHEET-02.2 Cambio de selección

- **GIVEN** el sheet abierto con el icono carrito activo
- **WHEN** se pulsa la celda de la estrella
- **THEN** la celda anterior pierde el borde
- **AND** la celda de la estrella gana el borde de selección
- **AND** el `signal` interno `icon` del sheet pasa a `star`.

### Requirement: SHEET-03 Selector visual de color con seis muestras

El campo Color MUST renderizarse como una fila de seis muestras de 32 por 32 con hueco de 12, usando los tokens `--app-category-1` a `--app-category-5` y `--app-category-filler` (gris, primary) en este orden: Routine, Event, My, More, gris, primary. La muestra activa MUST llevar un anillo de 2 px en `--app-primary` y un check centrado. Figma: 4:869.

#### Scenario: SHEET-03.1 Render y selección

- **GIVEN** el sheet abierto en modo `Edit` con `draft.colorToken = 'routine'`
- **WHEN** se renderiza el campo Color
- **THEN** aparecen seis muestras en el orden citado
- **AND** la muestra Routine lleva el anillo y el check
- **AND** las demás muestras no llevan anillo.

#### Scenario: SHEET-03.2 Cambio de selección

- **GIVEN** el sheet abierto con la muestra Routine activa
- **WHEN** se pulsa la muestra de primary
- **THEN** la muestra anterior pierde el anillo y el check
- **AND** la muestra primary gana el anillo y el check
- **AND** el `signal` interno `colorToken` del sheet pasa a `'primary'`.

### Requirement: SHEET-04 Preview en vivo con CategoryChip

El sheet MUST mostrar una fila de preview con `ChipComponent` extendido que refleje el icono, el nombre y el color activos. `ChipComponent` MUST admitir un icono opcional mediante `ng-content select="[appChipIcon]"` sin añadir un input nuevo. Figma: 4:869.

#### Scenario: SHEET-04.1 Preview por defecto en Edit

- **GIVEN** el sheet abierto en modo `Edit` con `draft = { name: 'Shopping', icon: 'cart', colorToken: 'routine' }`
- **WHEN** se renderiza el preview
- **THEN** aparece "Shopping" con el icono del carrito y el color Routine
- **AND** la fila se actualiza al cambiar cualquier campo del sheet sin recargar el modal.

#### Scenario: SHEET-04.2 Extensión del chip sin romper consumidores

- **GIVEN** los consumidores actuales de `ChipComponent` (filtros de categoría y estado en `TasksPage`, filtro de la página Categorías)
- **WHEN** se renderizan sin icono proyectado
- **THEN** siguen mostrando solo el punto de color y el texto
- **AND** la cobertura del chip añade un test que verifica que la proyección vacía no altera el DOM del botón.

### Requirement: SHEET-05 Acciones Save y Delete con peligro en Edit

El sheet MUST mostrar un botón primario a todo el ancho (327 por 50, `min-height: 50px` literal acotado al SCSS del sheet) con el texto "Save category" en `Create` o "Save changes" en `Edit`. En `Edit` MUST aparecer debajo un botón de texto "Delete category" en `color/danger`. Figma: 4:869.

#### Scenario: SHEET-05.1 Guardado inválido bloquea Save

- **GIVEN** el sheet abierto con `name` vacío o con solo espacios
- **WHEN** se pulsa el botón primario
- **THEN** el sheet no cierra el modal
- **AND** el campo Name muestra el mensaje de error existente.

#### Scenario: SHEET-05.2 Guardado válido persiste y cierra

- **GIVEN** el sheet abierto con `name = 'Compras'` y selección de icono y color
- **WHEN** se pulsa el botón primario
- **THEN** se emite `save` con `{ id?, name, icon, colorToken, section }`
- **AND** el `CategoriesStore` aplica la operación correspondiente (`create` o `update`)
- **AND** el modal se cierra.

#### Scenario: SHEET-05.3 Borrado solo en Edit

- **GIVEN** el sheet abierto en modo `Edit` con `draft.id` definido
- **WHEN** se renderizan las acciones
- **THEN** "Delete category" está visible en `color/danger`
- **WHEN** se pulsa
- **THEN** se emite `delete` con el id
- **AND** el modal se cierra.

#### Scenario: SHEET-05.4 Ausencia de Delete en Create

- **GIVEN** el sheet abierto en modo `Create`
- **WHEN** se renderizan las acciones
- **THEN** "Delete category" no aparece en el DOM.

### Requirement: SHEET-06 Comando compartido `openCategorySheet`

`CategoriesStore` MUST exponer un `signal<SheetRequest | null>` que `CategoriesPage` y el selector del NewTaskModal escriben para abrir el sheet. Un único `<app-category-sheet>` declarado en el shell MUST leer esa señal y abrir o cerrar `ion-modal` según su valor. Figma: 4:869 y 4:947.

#### Scenario: SHEET-06.1 Apertura declarativa

- **GIVEN** el shell a con `<app-category-sheet>` montado
- **WHEN** `CategoriesStore.openCategorySheet` recibe `{ mode: 'create' }`
- **THEN** el `signal` pasa a `{ mode: 'create' }`
- **AND** el sheet abre el modal sin que la página llame a `present()` manualmente.

#### Scenario: SHEET-06.2 Cierre limpia la señal

- **GIVEN** el sheet abierto
- **WHEN** el usuario descarta o guarda
- **THEN** el sheet llama a `dismiss()` del modal y a `CategoriesStore.closeCategorySheet()`
- **AND** el `signal` vuelve a `null`.

#### Scenario: SHEET-06.3 Type cerrado

- **GIVEN** la firma de `openCategorySheet`
- **WHEN** se compila con `tsc --strict`
- **THEN** un `mode` distinto de `'create' | 'edit'` produce un error de compilación.

### Requirement: SHEET-07 Conservación del campo Sección (CAT-SEC-01)

El sheet MUST incluir el campo Sección como cuarta fila con tres chips General/Routine/Event y persistir el valor elegido en el `CategoriesStore` sin derivarlo del color ni del contexto de apertura. La spec `category-sections` (CAT-SEC-01) MUST seguir cumpliéndose sin cambios de contrato. Figma: 4:869.

#### Scenario: SHEET-07.1 Sección visible y editable

- **GIVEN** el sheet abierto en modo `Edit` con `draft.section = 'routine'`
- **WHEN** se renderiza el campo Sección
- **THEN** aparecen tres chips en el orden General, Routine, Event
- **AND** el chip Routine está activo.

#### Scenario: SHEET-07.2 Persistencia y compatibilidad

- **GIVEN** categorías persistidas antes del sheet que no tienen sección
- **WHEN** se abre el sheet en `Edit`
- **THEN** el chip General aparece activo
- **AND** al guardar, la sección se conserva o se queda en `undefined` para interpretarse como General, sin reescribir datos.

