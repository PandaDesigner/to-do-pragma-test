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

#### Scenario: DATE-FILTER-02.5 El modal abre a una altura que deja sitio a las acciones

- **GIVEN** el modal de rango de fechas abierto en una pantalla de móvil
- **WHEN** se mide la posición de las acciones de limpiar, cancelar y aplicar
- **THEN** el modal abre a un breakpoint que deja sitio al calendario y a las acciones dentro del viewport
- **AND** las tres acciones quedan dentro del área visible sin necesidad de desplazarse

#### Scenario: DATE-FILTER-02.6 El cuerpo del modal recorta en vez de crecer

- **GIVEN** el modal de rango de fechas abierto
- **WHEN** el alto disponible es menor que la suma del título, la pista, el calendario y las acciones
- **THEN** el cuerpo del modal limita su altura en lugar de crecer hasta la altura de su contenido
- **AND** el calendario no supera el alto solicitado
- **AND** las acciones permanecen dentro del área visible

#### Scenario: DATE-FILTER-02.7 El calendario toma la superficie y el texto de la paleta del proyecto

- **GIVEN** un modal de rango de fechas abierto en modo oscuro
- **WHEN** se renderiza el calendario
- **THEN** su superficie y su texto provienen de los tokens del proyecto y no de los valores por defecto de Ionic
- **AND** el calendario no aparece como un bloque blanco dentro del modal oscuro

#### Scenario: DATE-FILTER-02.8 El calendario expone su propia superficie translucida

- **GIVEN** un modal de rango de fechas abierto
- **WHEN** el calendario dibuja los rellenos translúcidos, como el anillo del día seleccionado
- **THEN** el calendario declara el rgb de la superficie de la paleta activa
- **AND** esos rellenos no proceden de la superficie por defecto de Ionic

#### Scenario: DATE-FILTER-02.9 Los días atenuados cumplen contraste AA en las dos paletas

- **GIVEN** un modal de rango de fechas abierto
- **WHEN** se muestran los días adyacentes del calendario
- **THEN** su tono supera el 4.5:1 de contraste AA sobre la superficie de la paleta activa
- **AND** el tono se define por paleta, porque un valor único no alcanza AA en ambas

#### Scenario: DATE-FILTER-02.10 La paleta se aplica por atributo y no por contexto de host

- **GIVEN** un componente de `shared` dentro del modal
- **WHEN** la clase de paleta está en `html`, un ancestro externo
- **THEN** el componente expone la paleta activa como atributo en el calendario
- **AND** las reglas por paleta seleccionan por ese atributo
- **AND** el caso sin clase explícita sigue la preferencia del sistema operativo

#### Scenario: DATE-FILTER-02.11 El calendario recibe siempre la paleta activa

- **GIVEN** un modal de rango de fechas abierto
- **WHEN** se renderiza el calendario
- **THEN** el atributo de paleta está presente y toma un valor de paleta o de sistema
- **AND** si faltara el atributo, ninguna regla por paleta aplicaría y el calendario volvería a los valores por defecto de Ionic

#### Scenario: DATE-FILTER-02.12 La fila de acciones ocupa el ancho del calendario

- **GIVEN** un modal de rango de fechas abierto
- **WHEN** se comparan los bordes de la fila de acciones con los del calendario
- **THEN** la fila de acciones mide lo mismo que el calendario
- **AND** el botón de limpiar empieza en el borde izquierdo de la fila y el de aplicar termina en el borde derecho
- **AND** los márgenes por defecto del botón no descuadran esos bordes exteriores

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