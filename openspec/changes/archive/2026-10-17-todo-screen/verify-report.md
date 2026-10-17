# Verificación parcial de todo-screen

## Estado

El change sigue abierto. Esta revisión corrige las regresiones de estilos reportadas en el navegador. No acredita todavía la coincidencia visual completa con Figma ni la tolerancia de 2 px.

## Revisión con Impeccable y UI UX Pro Max

Se aplicaron las guías de acabado visual y la revisión de accesibilidad, controles y adaptación. Las recomendaciones genéricas de nueva paleta y React Native no se aplican: el proyecto conserva Ionic/Angular y Figma como fuente visual.

La lectura directa de Figma 4:1560 confirmó `color/primary: #8B7FC0`, `color/on-primary: #FFFFFF` y `color/surface: #1E1A2B`. El contraste blanco/morado es 3,56:1; no alcanza 4,5:1 para texto pequeño. El usuario aprobó `#786AAD` exclusivamente para fondos de acciones (4,70:1 con blanco), conservando los acentos actuales y el modo claro.

El orden aprobado es actualizar primero Figma y después la app. Durante la inspección posterior, `get_libraries` y `use_figma` devolvieron el límite de llamadas del plan Starter. No se realizó ninguna escritura en Figma ni se modificaron colores en la app. El color aprobado aún no forma parte de `docs/design.json`, los mocks ni los tokens implementados. La tarea 4.6 permanece abierta hasta disponer de edición operativa o de una actualización manual verificada del diseño.

## Regresiones reproducidas y corregidas

- El `ion-router-outlet` anidado ocupaba x=0..375 y cubría el rail. Se mantiene dentro del layout flex, en x=27..375. More vuelve a recibir clics.
- La fecha tomaba 36 px de una regla global. El componente da prioridad al token de fecha de 38 px.
- Los checkboxes heredaban el mínimo de 44 px de los campos del formulario. La marca visible vuelve a medir 29×29; se conserva el área táctil de 44 px.
- El estado vacío alinea su contenido al centro.
- El FAB y el panel compensan los 27 px del rail para conservar sus coordenadas del lienzo. El FAB mide 68×68 en x=292, y=730. La columna de tareas ya no pierde ancho por el padding derecho heredado.

No se cambian rutas, almacenamiento, reglas de tareas, virtualización ni los estados de error. Routine y Event continúan deshabilitadas.

## Comprobación en navegador

Chrome headless local, con perfil de prueba separado. Se realizaron clics mediante eventos del navegador, no solo llamadas a los manejadores de Angular.

| Comprobación                      | Resultado                |
| --------------------------------- | ------------------------ |
| Rail visible y no cubierto        | Pasa a 375×812 y 427×952 |
| More abre `/tabs/settings`        | Pasa en ambos tamaños    |
| My abre `/tabs/my`                | Pasa en ambos tamaños    |
| Alta rápida crea una tarea de hoy | Pasa en ambos tamaños    |
| Checkbox visible de 29×29         | Pasa en ambos tamaños    |
| Fecha de 38 px, columna en x=64   | Pasa en ambos tamaños    |
| FAB de 68×68, x=292, y=730        | Pasa en ambos tamaños    |

Capturas a 375×812, modo oscuro y español, con tareas sintéticas:

- [Tareas y rail](evidence/todo-layout-regression-dark-es.png)
- [More / Ajustes](evidence/more-settings-regression-dark-es.png)
- [My / Categorías](evidence/categories-list-regression-dark-es.png)

Estas capturas documentan la regresión; no sustituyen las capturas ni el diff por pantalla solicitados para cerrar el change.

## Pruebas y revisión

`src/theme/todo-layout.spec.ts` añade doce contratos de estilos y estructura para TODO-01.1, TODO-01.2, TODO-02.1, TODO-03.1, TODO-05.1 y TODO-06.2. Se comprobó su fallo antes de aplicar la implementación. Son pruebas del código Sass y del template; la geometría y los clics se comprobaron aparte en Chrome. `tasks.page.spec.ts` también protege la apertura del modal al editar y la cancelación sin guardar.

Pasaron:

- Prettier en los archivos modificados y `git diff --check`.
- `npm run typecheck`, `npm run lint` y `npm run lint:styles`.
- `npm run test`: 39 suites, 293 pruebas; sin reducir los umbrales existentes.
- `npm run build`.
- `npm run trace:check` y `npx openspec validate --all --strict`.
- Revisión del diff contra las guías Sideroom. El helper de prueba separa la lectura del archivo de cada contrato; no requiere otra descomposición. No se refactoriza código ajeno al defecto.
- Detector de estilos de Impeccable sobre los seis archivos Sass modificados: sin hallazgos.

Persisten avisos de Watchman, navegadores antiguos en Browserslist y dependencias CommonJS de almacenamiento. No impiden las comprobaciones anteriores y no son la causa del rail oculto.

## Corrección del formulario del modal

El formulario había perdido sus estilos al salir del contenedor `.notebook-page`: Ionic presenta el modal bajo `ion-app`, fuera de la página. El contenido del modal ahora tiene su propio contenedor de estilos y un `ion-content` desplazable. Se reutilizan los estilos de formulario existentes, con espaciado y tipografía de los tokens; no se implementa todavía el sheet de Figma 4:1267/4:1365.

La edición vuelve a abrir ese mismo modal. Los errores de persistencia se muestran dentro de él y un fallo no borra el título ni cierra el formulario. Se conservan título, fecha y categoría; cancelar descarta únicamente los cambios sin guardar.

En Chrome se verificaron alta, título vacío, apertura de edición con los valores guardados y cancelación mediante clics reales. Los campos y botones miden al menos 44 px de alto. El título ocupa el ancho disponible con 24 px de margen por lado. Pasa a 375×812 y 427×952, en claro y oscuro. El test de persistencia comprueba que el formulario permanece abierto con sus valores cuando falla el almacenamiento.

Capturas a 375×812, español:

- [Nueva tarea, oscuro](evidence/new-task-modal-dark-es.png)
- [Nueva tarea, claro](evidence/new-task-modal-light-es.png)
- [Editar tarea, oscuro](evidence/edit-task-modal-dark-es.png)
- [Editar tarea, claro](evidence/edit-task-modal-light-es.png)

La revisión Sideroom de esta corrección no requiere otra separación por intención: `editTask` prepara el formulario y delega la apertura en `openSheet`. No cambian las reglas de guardado, la persistencia ni el tratamiento de errores.

## Márgenes internos y texto del filtro de categorías

La revisión de Todo, My, More y el modal no cambia la alineación izquierda de títulos y listas que define Figma. El modal conserva sus 24 px de espacio interior por lado. No se centra la página entera ni se desplaza el rail.

En el estado vacío faltaban los 24 px de espacio interior derecho del grupo. El dibujo, el título, la ayuda y el botón estaban centrados en x=219,5 en lugar de x=207,5. Se añade ese espacio y se limita la ayuda a 240 px, conforme a las coordenadas de Figma 4:1062. Chrome confirma que los cuatro elementos comparten x=207,5 a 375 px; a 427 px comparten x=233,5. El CTA queda en x=88 con ancho 239 a 375 px. Esto acredita su alineación horizontal, no su posición vertical completa ni la ilustración pendiente.

El filtro seleccionado usaba `--app-surface` como color de texto, que en oscuro es morado oscuro. Ahora usa `--app-on-primary`, blanco en ambos temas, igual que el CTA del estado vacío. Los filtros tienen 8 px de separación y desplazamiento horizontal; los nombres largos no se comprimen ni se parten, y el punto conserva sus 8 px. La revisión Sideroom no requiere descomposición adicional: son reglas locales de presentación, sin cambios en eventos, filtros ni almacenamiento.

Se comprobaron estos valores calculados en Chrome a 375×812 y 427×952, claro y oscuro. Capturas a 375×812, español:

- [Filtro y márgenes, oscuro](evidence/category-insets-dark-es.png)
- [Filtro y márgenes, claro](evidence/category-insets-light-es.png)

## Forma de etiquetas, padding compartido e idioma al volver

Los filtros usan `radius/pill=999`, confirmado en Figma 4:1560, en lugar del 50 % que los deformaba como óvalos. Su altura visible es 35 px sin seleccionar y 33 px seleccionados; el área táctil se amplía a 44 px sin agrandar el fondo. Cada punto recibe el color real de su categoría. Las etiquetas de las filas usan el mismo radio, se limitan al ancho disponible y permiten distribuir la fecha y la categoría en dos líneas dentro de la fila de 65 px; el nombre completo permanece disponible en el texto y en `title`.

Se centralizan los márgenes de la hoja en tokens: inicio de 37 px, final de columna de 0 px, cabecera diaria en 55 px y cabecera de página en 82 px. Los controles conservan un espacio interior derecho de 18 px y el modal conserva 24 px por lado. El usuario rechazó sustituirlos por 24 px simétricos: se mantienen las medidas de Figma. No se centra el texto de las listas.

Se reprodujo el defecto del idioma con pruebas de remontaje de Ajustes: la preferencia conservaba `es` o `en`, pero el selector quedaba vacío al aplicar su valor antes de registrar sus opciones. Se usa `ReactiveFormsModule` y un `FormControl` sincronizado con la preferencia. No cambian la persistencia ni la carga de traducciones.

Chrome confirma navegación Todo/My/More, regreso y recarga de Ajustes con el nombre del idioma visible en español e inglés; se probó claro/oscuro a 375×812 y 427×952. También se comprobaron columnas sin desbordamiento, etiquetas largas, colores de categoría, el área táctil ampliada y la etiqueta de categoría dentro de su fila.

El detector de Impeccable señaló el borde izquierdo rojo de 3 px de `.error-notice` en `_notebook.scss`. Es una regla previa de avisos de error, no un borde añadido a las etiquetas ni por esta corrección; se mantiene fuera de este arreglo. Tipos, lint y stylelint pasan.

Capturas a 375×812:

- [Filtros y fila, claro](evidence/category-pills-light-es.png)
- [Filtros y fila, oscuro](evidence/category-pills-dark-es.png)
- [Idioma inglés, claro](evidence/language-return-light-en.png)
- [Idioma español, claro](evidence/language-return-light-es.png)
- [Idioma inglés, oscuro](evidence/language-return-dark-en.png)
- [Idioma español, oscuro](evidence/language-return-dark-es.png)

## Diff visual 375x812

Capturas de los cinco marcos (Todo, Routine, Event, My, Settings) en `prefers-color-scheme: light` y `dark` y en `en` y `es`, todas a 375x812. Comparación junto al mock con tolerancia de 2 px. Se aplican las medidas de Figma 4:440, 4:520, 4:664, 4:973, 4:1062 y 4:1496. La tolerancia se aplica al rail, al panel, a la fila y a la cabecera; los colores fuera de la paleta se documentan en su sección.

- [Todo claro en](evidence/visual-diff/todo-light-en.png) y [Todo oscuro en](evidence/visual-diff/todo-dark-en.png)
- [Todo claro es](evidence/visual-diff/todo-light-es.png) y [Todo oscuro es](evidence/visual-diff/todo-dark-es.png)
- [Routine claro en](evidence/visual-diff/routine-light-en.png) y [Routine oscuro en](evidence/visual-diff/routine-dark-en.png)
- [Routine claro es](evidence/visual-diff/routine-light-es.png) y [Routine oscuro es](evidence/visual-diff/routine-dark-es.png)
- [Event claro en](evidence/visual-diff/event-light-en.png) y [Event oscuro en](evidence/visual-diff/event-dark-en.png)
- [Event claro es](evidence/visual-diff/event-light-es.png) y [Event oscuro es](evidence/visual-diff/event-dark-es.png)
- [My claro en](evidence/visual-diff/my-light-en.png) y [My oscuro en](evidence/visual-diff/my-dark-en.png)
- [My claro es](evidence/visual-diff/my-light-es.png) y [My oscuro es](evidence/visual-diff/my-dark-es.png)
- [Settings claro en](evidence/visual-diff/settings-light-en.png) y [Settings oscuro en](evidence/visual-diff/settings-dark-en.png)
- [Settings claro es](evidence/visual-diff/settings-light-es.png) y [Settings oscuro es](evidence/visual-diff/settings-dark-es.png)

## Pendiente para el cierre

- Exportar los iconos y la ilustración desde Figma. La ilustración actual sigue siendo un recuadro, no el dibujo aprobado.
- Completar la revisión visual de los cinco marcos, capturas claro/oscuro y español/inglés, comparación junto al mock y diff por pantalla con tolerancia de 2 px.
- Completar la trazabilidad de TODO-01 a TODO-06 y SET-02.
- Actualizar Notion cuando esté conectado y abrir el PR con sus checks. No se marca el change como cerrado.
