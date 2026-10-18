## MODIFIED Requirements

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