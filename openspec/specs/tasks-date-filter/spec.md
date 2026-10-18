# tasks-date-filter Specification

## Purpose
TBD - created by archiving change fix-qc-audit-findings. Update Purpose after archive.
## Requirements
### Requirement: QC-01 El filtro por rango de fechas acota la lista

La lista de tareas MUST quedar acotada al rango de fechas activo, de modo que solo se muestren las tareas cuya fecha de vencimiento cae dentro del rango. La página MUST construir su lista visible con el mismo rango de fechas que aplica el store, y MUST incluirlo al filtrar por estado y categoría. Con un rango activo MUST ocultarse toda tarea cuya fecha quede fuera, incluidos los días anteriores y posteriores al rango. Al quitar el filtro MUST volver a mostrarse la lista completa. Figma: 4:440.

#### Scenario: QC-01.1 La lista respeta el rango aplicado

- **GIVEN** tareas con fechas anterior, dentro y posterior al rango elegido
- **WHEN** se aplica un rango de fechas
- **THEN** solo se muestra la tarea cuya fecha cae dentro del rango
- **AND** las tareas de antes y después del rango no se muestran

#### Scenario: QC-01.2 La página y el store filtran por el mismo rango

- **GIVEN** un rango de fechas aplicado
- **WHEN** se calcula la lista visible de la pantalla
- **THEN** la pantalla usa el rango activo como criterio de filtrado
- **AND** su lista visible coincide con la del store

#### Scenario: QC-01.3 Quitar el filtro devuelve la lista completa

- **GIVEN** un rango de fechas aplicado y la lista acotada
- **WHEN** se pulsa Quitar en el modal de fechas
- **THEN** vuelven a mostrarse todas las tareas

### Requirement: QC-02 El atributo lang sigue al idioma activo

El atributo `lang` del elemento raíz MUST reflejar el idioma con el que se está mostrando la interfaz, y MUST actualizarse cada vez que el usuario cambie el idioma. No MUST permanecer en el valor por defecto del documento cuando la interfaz esté en otro idioma. El valor MUST ser uno de los idiomas soportados por la aplicación. Figma: 4:440.

#### Scenario: QC-02.1 lang coincide con la interfaz visible

- **GIVEN** la aplicación en español
- **WHEN** se inspecciona el atributo lang del elemento raíz
- **THEN** su valor es el idioma español

#### Scenario: QC-02.2 lang sigue el cambio de idioma

- **GIVEN** la aplicación en un idioma
- **WHEN** el usuario cambia al otro idioma disponible
- **THEN** el atributo lang del elemento raíz pasa al nuevo idioma
- **AND** coincide con el texto visible de la interfaz

#### Scenario: QC-02.3 El idioma guardado se aplica al cargar

- **GIVEN** un idioma previamente guardado en los ajustes
- **WHEN** la aplicación se carga
- **THEN** el atributo lang del elemento raíz toma ese idioma
- **AND** no queda en el idioma por defecto del documento

### Requirement: QC-03 El rango aplicado recoge todos los días elegidos

El selector de rango MUST aplicar el rango completo que el usuario haya marcado en el calendario, y MUST tomar como extremos el día más temprano y el más tardío de la selección. La selección MUST NOT descartarse por añadir días intermedios marcados. Cuando el usuario marque días, el rango MUST ignorar el valor inicial que el calendario muestra antes de su primera interacción, de modo que aplicar sin más clics no fije un rango que el usuario no eligió. Figma: 4:440.

#### Scenario: QC-03.1 El rango cubre la primera y la última selección

- **GIVEN** el modal de fechas abierto
- **WHEN** el usuario marca un día distinto al que aparece por defecto y lo aplica
- **THEN** el rango aplicado empieza en ese día
- **AND** no queda fijado en el día inicial que el calendario propone por defecto

#### Scenario: QC-03.2 Días intermedios no descartan los extremos

- **GIVEN** el usuario marca varios días no consecutivos
- **WHEN** aplica el rango
- **THEN** el rango aplicado va del primer día al último de los marcados

#### Scenario: QC-03.3 El rango se normaliza si los días llegan desordenados

- **GIVEN** días marcados en orden descendente
- **WHEN** se aplica el rango
- **THEN** el inicio es el día más temprano de la selección
- **AND** el fin es el día más tardío

### Requirement: QC-04 La cabecera nombra la sección activa

La cabecera de las pantallas de tareas MUST indicar a qué sección pertenece la lista mostrada, de modo que Todo, Rutina y Evento sean distinguibles por su título. El título MUST derivarse del identificador de sección de la ruta, no del contenido filtrado, para que dos secciones sin tareas no muestren cabeceras indistinguibles. Figma: 4:440.

#### Scenario: QC-04.1 Cada sección muestra su propio título

- **GIVEN** tres o más tareas repartidas entre secciones
- **WHEN** se recorre Todo, Rutina y Evento
- **THEN** cada pantalla muestra en su cabecera el nombre de su sección

#### Scenario: QC-04.2 El título no depende de si hay tareas

- **GIVEN** una sección sin ninguna tarea
- **WHEN** se abre su pantalla
- **THEN** su cabecera sigue mostrando el nombre de la sección

#### Scenario: QC-04.3 La cabecera nombra una sección vacía

- **GIVEN** una sección sin tareas
- **WHEN** se renderiza su cabecera
- **THEN** el título identifica la sección y no queda vacío

#### Scenario: QC-04.4 La plantilla entrega el título de sección a la cabecera

- **GIVEN** la pantalla de tareas en modo lista
- **WHEN** se renderiza la cabecera
- **THEN** la plantilla pasa el título de sección al componente de cabecera
- **AND** convive con la fecha y el título del día ya existentes

### Requirement: QC-05 La fecha de la cabecera sigue al idioma

El título del día y el sobretítulo con la fecha larga MUST formatearse en el idioma visible de la interfaz. El idioma con el que se formatean MUST tomarse de la señal de idioma que la aplicación mantiene, y esa señal MUST quedar sincronizada con el idioma realmente aplicado tras cargar y tras cada cambio. La aplicación MUST registrar el cambio de idioma del servicio de traducción para que quien dependa de él se recalcule. Figma: 4:440.

#### Scenario: QC-05.1 El título del día se formatea en el idioma visible

- **GIVEN** la interfaz en español
- **WHEN** se renderiza la cabecera de la lista
- **THEN** el título del día aparece abreviado en español
- **AND** el sobretítulo muestra la fecha larga en español

#### Scenario: QC-05.2 Cambiar de idioma reformatea la fecha

- **GIVEN** la interfaz en un idioma
- **WHEN** el usuario cambia al otro idioma y vuelve a la lista
- **THEN** el título del día aparece en el nuevo idioma

#### Scenario: QC-05.3 La señal de idioma se sincroniza al cargar

- **GIVEN** la aplicación arranca con un idioma guardado distinto del predeterminado
- **WHEN** termina de cargar
- **THEN** la señal de idioma usada por la cabecera coincide con el idioma aplicado

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

#### Scenario: DATE-FILTER-02.13 El calendario queda centrado en la fila

- **GIVEN** un modal de rango de fechas abierto
- **WHEN** se compara el centro del calendario con el de la fila de acciones
- **THEN** el calendario no queda desplazado lateralmente respecto a la fila
- **AND** su holgura a la izquierda y a la derecha es la misma

#### Scenario: DATE-FILTER-02.14 Los tres botones reparten el ancho del calendario

- **GIVEN** un modal de rango de fechas abierto
- **WHEN** se miden los tres botones de la fila de acciones
- **THEN** los tres miden lo mismo, un tercio del ancho del calendario
- **AND** ninguno queda más ancho que los otros por su texto
- **AND** no queda hueco entre ellos ni fuera de sus extremos

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

### Requirement: DATE-FILTER-05 Jerarquía visual de la cabecera del modal

La cabecera del modal de rango de fechas MUST presentar el título con una jerarquía visual claramente superior a la de la pista que lo acompaña, de modo que ambas piezas no se confundan entre sí al leerse en conjunto. El título MUST usar un tamaño de display de 32 px, muy por encima del tamaño de texto de la pista pero sin dominar el modal. La separación entre el título y el borde superior del cuerpo MUST ser mayor que el espaciado interno que separa al resto de piezas del modal, para que el título no parezca pegado al borde. El título MUST caber en una sola línea con la etiqueta más larga de los dos idiomas, «Filtrar por fecha», sin desbordar el ancho del cuerpo. El título MUST conservar el peso que le impone su familia tipográfica de display, que solo existe en un único peso. Figma: 4:440.

#### Scenario: DATE-FILTER-02.15 El título del modal destaca sobre la pista

- **GIVEN** el modal de rango de fechas abierto
- **WHEN** se renderiza su cabecera
- **THEN** el título declara un tamaño de texto mayor que el de la pista
- **AND** su separación respecto del borde superior es mayor que el espaciado interno del cuerpo

#### Scenario: DATE-FILTER-02.17 El título usa tamaño de display y no se desborda

- **GIVEN** el modal de rango de fechas abierto en cualquiera de los dos idiomas
- **WHEN** se renderiza la cabecera
- **THEN** el título declara el token de tamaño de display de 32 px
- **AND** la etiqueta más larga de los dos idiomas cabe en el ancho del cuerpo sin desbordarse

### Requirement: DATE-FILTER-06 Reparto del ancho de los botones de acción

Los botones de acción del modal MUST repartirse el ancho del calendario en proporción de dos partes para Quitar y una parte para cada uno de los otros dos, de modo que la acción de limpiar tenga más presencia sin desplazar a las demás. El reparto MUST ser idéntico en ambos idiomas, y ninguno MUST recortar su etiqueta. Figma: 4:440.

#### Scenario: DATE-FILTER-02.16 Quitar ocupa el doble que Cancelar y Aplicar

- **GIVEN** el modal de rango de fechas abierto
- **WHEN** se renderiza la fila de acciones
- **THEN** Quitar declara el doble de factor de crecimiento que los otros dos
- **AND** los otros dos reparten el resto del ancho a partes iguales
- **AND** ninguna etiqueta se recorta en español ni en inglés

### Requirement: DATE-FILTER-07 Padding horizontal del botón de hoy

El botón rápido de hoy MUST declarar un padding horizontal holgado, mayor que el espaciado mínimo del proyecto, de modo que la etiqueta y el chevron no se lean apretados contra el borde del botón. Elpadding MUST ser suficiente para separar visualmente la etiqueta de la línea del borde en ambos idiomas, y el botón MUST conservar su altura y su objetivo táctil. Figma: 4:440.

#### Scenario: DATE-FILTER-01.4 El botón de hoy declara padding horizontal holgado

- **GIVEN** la pantalla de tareas en cualquiera de los dos idiomas
- **WHEN** se renderiza el botón de hoy
- **THEN** su padding inline declara un token de espaciado mayor que el mínimo
- **AND** la etiqueta y el chevron quedan separados del borde del botón

### Requirement: DATE-FILTER-08 Tinta propia por categoría en el rail

Cada pestaña del rail lateral MUST derivar el color de su texto del color de su propio fondo, de modo que la etiqueta se lea como una versión oscurecida del color de la categoría en lugar de un tono neutro común a todas. El derivado MUST obtenerse por mezcla del propio relleno, MUST diferir entre categorías y MUST alcanzar contraste suficiente contra su fondo en claro y en oscuro. La pestaña activa MUST conservar la tinta de texto sobre su fondo de superficie. Figma: 4:440.

#### Scenario: DATE-FILTER-02.18 Cada pestaña del rail usa la tinta de su categoría

- **GIVEN** la pantalla de tareas con el rail lateral visible
- **WHEN** se renderizan las pestañas de categoría
- **THEN** cada texto toma su color del relleno de su propia pestaña y no de un token común
- **AND** las cuatro tintas difieren entre sí
- **AND** la pestaña activa conserva la tinta de texto

### Requirement: DATE-FILTER-09 Persistencia del borrador del calendario

El calendario MUST conservar la seleccion del usuario al cerrarse y reabrirse el modal, sin exigir que se aplique antes. Al reabrir MUST mostrarse el ultimo borrador elegido, no el filtro aplicado ni el dia de hoy. La conservacion MUST aplicar tanto si el modal se cierra con Cancelar como cerrandolo de otra forma, y MUST alterarse solo cuando el usuario elija dias nuevos o pulse Quitar. Figma: 4:440.

#### Scenario: DATE-FILTER-02.19 El borrador sobrevive al cierre

- **GIVEN** el modal abierto con un rango de dias ya elegido y sin aplicar
- **WHEN** se cierra el modal y se vuelve a abrir
- **THEN** el calendario muestra el mismo rango de dias elegido
- **AND** no se vuelve al filtro aplicado ni al dia de hoy

