## ADDED Requirements

### Requirement: DATE-FILTER-01 Grupo de filtro por fecha

La pantalla de tareas MUST presentar en `.top-actions` un grupo de filtro por fecha compuesto por un botón rápido de hoy y, a su lado, un botón con icono de calendario. El botón rápido MUST conservar la etiqueta traducida de hoy y MUST reducirse respecto a la medida anterior de 336x44. Figma: 4:440.

#### Scenario: DATE-FILTER-01.1 El grupo expone HOY y el calendario

- **GIVEN** la pantalla de tareas abierta, conforme a Figma 4:440
- **WHEN** se renderiza `.top-actions`
- **THEN** aparecen un botón con la etiqueta de hoy y, a su lado, un botón de icono de calendario
- **AND** el botón de hoy no ocupa el ancho disponible del grupo

#### Scenario: DATE-FILTER-01.2 El icono se resuelve por la propiedad icon

- **GIVEN** la pantalla de tareas abierta
- **WHEN** se renderiza el botón de calendario
- **THEN** el icono se pasa por la propiedad `icon` desde un objeto `icons` de la clase
- **AND** ningún icono de la pantalla se declara con el atributo `name`

#### Scenario: DATE-FILTER-01.3 El botón de calendario abre el selector

- **GIVEN** la pantalla de tareas abierta
- **WHEN** se pulsa el botón de icono de calendario
- **THEN** se abre el alert de rango de fechas

### Requirement: DATE-FILTER-02 Alert de rango de fechas

El selector de rango MUST presentarse en un `ion-alert` que monta un calendario mediante la propiedad `template`, no mediante `contentInputs`. El calendario MUST ser un rango real de fechas, con Selection Type de tipo range y valor con la forma desde/hasta. MUST desactivar el título por defecto del `ion-datetime` y darle alto explícito, porque el alert dimensiona a sus hijos. Figma: 4:440.

#### Scenario: DATE-FILTER-02.1 El alert monta el calendario por template

- **GIVEN** el alert de rango de fechas abierto
- **WHEN** se inspecciona su configuración
- **THEN** el calendario se monta por la propiedad `template`
- **AND** el alert no declara ningún `contentInputs`

#### Scenario: DATE-FILTER-02.2 El calendario declara título y alto explícitos

- **GIVEN** el calendario montado en el alert
- **WHEN** se renderiza
- **THEN** el calendario tiene el título por defecto desactivado y un alto explícito en píxeles
- **AND** su modo de selección es un rango

#### Scenario: DATE-FILTER-02.3 Rango inicial igual a hoy

- **GIVEN** el reloj en una fecha concreta
- **WHEN** se abre el alert sin rango previo
- **THEN** el rango inicial va de esa fecha a esa misma fecha

#### Scenario: DATE-FILTER-02.4 Un rango vacío no se aplica

- **GIVEN** el alert de rango de fechas abierto
- **WHEN** la selección no contiene una fecha de inicio
- **THEN** se descarta el rango y el filtro de fecha queda sin valor

### Requirement: DATE-FILTER-03 Filtro por rango en el store

El store de tareas MUST aceptar un rango de fechas con la misma forma que el resto de sus filtros: aplicar el estado y restablecer la paginación a la página 1. El filtro MUST ser inclusivo en ambos extremos, por el campo de vencimiento, y MUST combinarse por conjunción con el filtro de estados y el de categoría. Figma: 4:440.

#### Scenario: DATE-FILTER-03.1 El rango filtra por vencimiento

- **GIVEN** tareas con vencimientos dentro y fuera de un rango
- **WHEN** se aplica el rango
- **THEN** solo quedan las tareas cuyo vencimiento está dentro del rango, incluidos los dos extremos

#### Scenario: DATE-FILTER-03.2 El rango restablece la paginación

- **GIVEN** el store en la página 3
- **WHEN** se aplica un rango de fechas
- **THEN** la página activa vuelve a 1

#### Scenario: DATE-FILTER-03.3 Sin rango no se filtra por fecha

- **GIVEN** el store sin rango de fechas
- **WHEN** se calcula la lista filtrada
- **THEN** el filtro de fecha no descarta ninguna tarea por su fecha

#### Scenario: DATE-FILTER-03.4 El rango se combina con categoría y estados

- **GIVEN** tareas que cumplen el rango y el estado, y tareas que solo cumplen el rango
- **WHEN** se aplican rango, estado y categoría
- **THEN** quedan únicamente las tareas que cumplen los tres a la vez

### Requirement: DATE-FILTER-04 El botón de hoy fija el día actual

El botón rápido de hoy MUST fijar el filtro de fecha al día actual, además de conservar su comportamiento actual de restablecer la categoría, los estados, abrir el panel y subir la lista al principio. Figma: 4:440.

#### Scenario: DATE-FILTER-04.1 El botón de hoy fija el día

- **GIVEN** la pantalla de tareas con un filtro de fecha distinto del día actual
- **WHEN** se pulsa el botón de hoy
- **THEN** el rango de fecha pasa a ir de hoy a hoy
- **AND** se restablecen la categoría y los estados, y el panel queda abierto

#### Scenario: DATE-FILTER-04.2 El botón de hoy conserva su etiqueta

- **GIVEN** la pantalla de tareas en español
- **WHEN** se renderiza el botón de hoy
- **THEN** su etiqueta es la traducción de la clave de hoy, sin ningún glifo de flecha incrustado en el texto