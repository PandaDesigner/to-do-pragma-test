# fix-ui-fidelity Specification

## Purpose
TBD - created by archiving change fix-ui-fidelity. Update Purpose after archive.
## Requirements
### Requirement: FID-01 El empty state de Categories usa la ilustración y el CTA del componente shared

La página Categorías MUST renderizar `app-empty-state` con `[illustrated]="true"`, con `actionLabel` resuelto desde las traducciones y con un manejador `action` que abra la hoja de creación. El componente MUST conservar sus valores por defecto de ilustración (68 px) y de CTA (239 por 50) para no alterar la página de tareas. `CategoriesPage` MUST NOT cambiar ningún input del componente. Figma: [4:1062](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1062) e [4:1100](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1100).

#### Scenario: [CAT-UI-01.1] El empty state de Categories muestra ilustración y acción

- **GIVEN** la página Categorías sin ninguna categoría, conforme a Figma 4:1062
- **WHEN** se renderiza la lista
- **THEN** el `app-empty-state` recibe `illustrated = true`
- **AND** el bloque `.illustration` existe con el icono `clipboardCheck`
- **AND** hay un botón de acción con la etiqueta resuelta de `category.emptyAction`

#### Scenario: [CAT-UI-01.2] El CTA del empty state abre la hoja de creación

- **GIVEN** la página Categorías sin ninguna categoría
- **WHEN** se pulsa el botón de acción del empty state
- **THEN** `CategoriesStore.openCategorySheet` recibe `{ mode: 'create' }`
- **AND** el modal de la hoja se abre en modo `Create`.

#### Scenario: [CAT-UI-01.3] Los valores por defecto del componente no cambian

- **GIVEN** `EmptyStateComponent` sin `illustrationSize`, `actionWidth` ni `actionHeight` explícitos
- **WHEN** se renderiza
- **THEN** la ilustración mide 68 por 68
- **AND** el botón de acción mide 239 de ancho por 50 de alto
- **AND** la página de tareas sigue mostrando la misma ilustración y el mismo CTA.

### Requirement: FID-02 El chevron del badge HOY es un icono y no parte el texto

El badge de hoy MUST renderizar el chevron como un `ion-icon` hermano del texto, de modo que el `gap` del contenedor flex separe ambos. El carácter `›` MUST NOT formar parte del texto traducible `todo.today` en español ni en inglés. El ancho MUST ser `min-width` de 63 px en lugar de ancho fijo, para que la etiqueta nunca se parta. El texto traducible MUST quedar como `"HOY"` y `"TODAY"`. El `ion-icon` MUST recibir el SVG importado de `ionicons/icons` por la entrada `[icon]` y MUST NOT declarar el atributo `name`, que Ionicons no resuelve sin `addIcons`. Figma: [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440) y [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520).

#### Scenario: [TODAY-UI-01.1] El chevron se pinta como icono junto al texto

- **GIVEN** la página de tareas, conforme a Figma 4:440
- **WHEN** se renderiza el badge de hoy
- **THEN** `.today-badge` contiene un `ion-icon` que recibe el SVG por la entrada `[icon]`
- **AND** ese icono es hermano del nodo de texto, no parte de la cadena
- **AND** el `textContent` del badge no contiene `›`.

#### Scenario: [TODAY-UI-01.2] La traducción ya no lleva el chevron dentro

- **GIVEN** los archivos de locale
- **WHEN** se lee `todo.today`
- **THEN** en `es.json` vale `"HOY"`
- **AND** en `en.json` vale `"TODAY"`
- **AND** ninguna de las dos contiene el carácter `›`.

#### Scenario: [TODAY-UI-01.3] El badge usa ancho mínimo y no ancho fijo

- **GIVEN** el estilo del badge de hoy
- **WHEN** se revisa su caja
- **THEN** declara `min-width: 63px`
- **AND** no declara `width: 63px`.

#### Scenario: [TODAY-UI-01.4] El badge sigue funcionando como botón de restablecimiento

- **GIVEN** una vista filtrada por categoría
- **WHEN** se pulsa el badge de hoy con el chevron como icono
- **THEN** el filtro se limpia y el panel de pendientes se reabre, igual que antes del cambio.

#### Scenario: [TODAY-UI-01.5] El icono se entrega como SVG importado y no como nombre resuelto en tiempo de ejecución

- **GIVEN** que `chevron-forward` no está registrado con `addIcons`
- **WHEN** `TasksPage` expone su icono del badge
- **THEN** entrega el SVG `chevronForward` importado de `ionicons/icons`
- **AND** ese valor es una cadena de datos, no un nombre.

#### Scenario: [TODAY-UI-01.6] El `ion-icon` del badge recibe el SVG por la entrada `[icon]`

- **GIVEN** el badge de hoy renderizado
- **WHEN** se inspecciona su `ion-icon`
- **THEN** recibe el SVG por `[icon]`
- **AND** no declara el atributo `name`, que Ionicons no resuelve sin `addIcons`.

#### Scenario: [TODAY-UI-01.7] El nombre inexistente no reaparece en el marcado

- **GIVEN** el marcado renderizado del badge
- **WHEN** se busca el nombre `chevron-forward`
- **THEN** no aparece, para que una regresión a `name=` vuelva a fallar los tests en rojo y no solo en la pantalla.

### Requirement: FID-03 El botón primario del sheet va antes que Cancelar

El bloque `.form-actions` de `CategorySheetComponent` MUST presentar el botón primario antes que el de cancelar, igual que el editor de tareas. En modo `Edit` el orden MUST ser Guardar, Cancelar, Eliminar. El cambio MUST ser solo de orden en el DOM: `category-sheet.component.scss` MUST NOT modificarse y `.form-actions` MUST conservar `display: flex` con `flex-direction: column`. Figma: [4:869](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869).

#### Scenario: [SHEET-UI-01.1] El botón primario va primero en las acciones

- **GIVEN** `CategorySheetComponent` abierto en modo `Create`, conforme a Figma 4:869
- **WHEN** se inspecciona `.form-actions`
- **THEN** el primer botón es `.primary-action` y su texto es "Save category"
- **AND** el botón de cancelar aparece después.

#### Scenario: [SHEET-UI-01.2] En modo Edit el orden es Guardar, Cancelar, Eliminar

- **GIVEN** `CategorySheetComponent` abierto en modo `Edit`
- **WHEN** se inspecciona `.form-actions`
- **THEN** el orden de las acciones es `.primary-action`, `.sheet-cancel` y `.danger-link`.

#### Scenario: [SHEET-UI-01.3] El SCSS del sheet no cambia

- **GIVEN** el bloque `.form-actions` del sheet
- **WHEN** se revisa su hoja de estilo
- **THEN** conserva `display: flex` y `flex-direction: column`
- **AND** `category-sheet.component.scss` no introduce selectores dependientes del orden como `:first-child`, `:last-child` o `:nth-child`.

### Requirement: FID-04 La fila 4:1062 deja de ser solo registro

`openspec/traceability.md` MUST contener filas con escenario para `4:440`, `4:520` y `4:1062`, cada una con requisito, tarea, test y evidencia. La fila de escenario MUST citar el nodo de Figma. `npm run trace:check` MUST pasar.

#### Scenario: [TRACE-UI-01.1] Cada nodo tocado tiene escenario, test y evidencia

- **GIVEN** la matriz de trazabilidad
- **WHEN** se ejecuta `npm run trace:check`
- **THEN** pasa sin lanzar errores
- **AND** `4:1062` tiene al menos una fila de escenario que referencia `[CAT-UI-01.1]`
- **AND** `4:440` y `4:520` tienen filas que referencian `[TODAY-UI-01.1]`.

