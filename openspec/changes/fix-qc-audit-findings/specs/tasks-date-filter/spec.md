## ADDED Requirements

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