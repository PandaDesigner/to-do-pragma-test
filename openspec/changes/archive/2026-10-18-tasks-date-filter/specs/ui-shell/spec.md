## MODIFIED Requirements

### Requirement: UI-25 Categorías desde tab Figma

El sistema MUST definir --app-category-1 a --app-category-5 desde tab/todo, tab/routine, tab/event, tab/my y tab/more, respectivamente, más --app-category-filler y sus contrastes, sin cambiar el contrato de datos de categoría. Conforme a Figma 4:788 y la auditoría, Shopping MUST mapear a tab/my, Work a tab/event, Home a tab/todo y Health a tab/routine. El sexto swatch del ColorPicker 4:869 no tiene token definido: MUST permanecer pendiente, sin inventar un sexto color. Los colores claros MUST ser #B8CFA8, #F28B8B, #9FC3CF, #E8E1B8 y #C9C9C9, con alfa D9 en oscuro. La tinta del texto de las pestañas del rail MUST ser un token propio, --app-tab-label, que en claro resuelve a color/primary-dark y en oscuro a color/text, para que el texto de las pestañas siga siendo legible sobre el relleno de su pestaña. Figma: 4:440 y 4:1560.

#### Scenario: UI-25.1 Categoría y paleta

- **GIVEN** una categoría que consume uno de los cinco tokens
- **WHEN** se alterna entre paletas
- **THEN** usa el tab Figma correspondiente, con alfa oscuro documentado, sin hexadecimal en el consumidor.

#### Scenario: UI-25.2 Contraste del texto de las pestañas

- **GIVEN** el rail lateral con las cinco pestañas
- **WHEN** se renderiza en modo oscuro, conforme a Figma 4:1560
- **THEN** el texto de las pestañas usa la tinta de pestaña de la paleta oscura y no el color de marca invertido