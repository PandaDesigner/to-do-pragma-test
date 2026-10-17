# Verificación parcial de todo-screen

## Estado

El change sigue abierto. Esta revisión corrige las regresiones de estilos reportadas en el navegador. No acredita todavía la coincidencia visual completa con Figma ni la tolerancia de 2 px.

## Regresiones reproducidas y corregidas

- El `ion-router-outlet` anidado ocupaba x=0..375 y cubría el rail. Se mantiene dentro del layout flex, en x=27..375. More vuelve a recibir clics.
- La fecha tomaba 36 px de una regla global. El componente da prioridad al token de fecha de 38 px.
- Los checkboxes heredaban el mínimo de 44 px de los campos del formulario. La marca visible vuelve a medir 29×29; se conserva el área táctil de 44 px.
- El estado vacío alinea su contenido al centro.
- El FAB y el panel compensan los 27 px del rail para conservar sus coordenadas del lienzo. El FAB mide 68×68 en x=292, y=730. La columna de tareas ya no pierde ancho por el padding derecho heredado.

No se cambian rutas, almacenamiento, reglas de tareas, virtualización ni los estados de error. Routine y Event continúan deshabilitadas.

## Comprobación en navegador

Chrome headless local, con perfil de prueba separado. Se realizaron clics mediante eventos del navegador, no solo llamadas a los manejadores de Angular.

| Comprobación | Resultado |
| --- | --- |
| Rail visible y no cubierto | Pasa a 375×812 y 427×952 |
| More abre `/tabs/settings` | Pasa en ambos tamaños |
| My abre `/tabs/my` | Pasa en ambos tamaños |
| Alta rápida crea una tarea de hoy | Pasa en ambos tamaños |
| Checkbox visible de 29×29 | Pasa en ambos tamaños |
| Fecha de 38 px, columna en x=64 | Pasa en ambos tamaños |
| FAB de 68×68, x=292, y=730 | Pasa en ambos tamaños |

Capturas a 375×812, modo oscuro y español, con tareas sintéticas:

- [Tareas y rail](evidence/todo-layout-regression-dark-es.png)
- [More / Ajustes](evidence/more-settings-regression-dark-es.png)
- [My / Categorías](evidence/categories-list-regression-dark-es.png)

Estas capturas documentan la regresión; no sustituyen las capturas ni el diff por pantalla solicitados para cerrar el change.

## Pruebas y revisión

`src/theme/todo-layout.spec.ts` añade seis contratos de estilos y estructura para TODO-01.1, TODO-01.2, TODO-02.1, TODO-03.1, TODO-05.1 y TODO-06.2. Se comprobó su fallo antes de aplicar la implementación. Son pruebas del código Sass y del template; la geometría y los clics se comprobaron aparte en Chrome. `tasks.page.spec.ts` también protege la apertura del modal al editar y la cancelación sin guardar.

Pasaron:

- Prettier en los archivos modificados y `git diff --check`.
- `npm run typecheck`, `npm run lint` y `npm run lint:styles`.
- `npm run test`: 38 suites, 279 pruebas; sin reducir los umbrales existentes.
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

## Pendiente para el cierre

- Exportar los iconos y la ilustración desde Figma. La ilustración actual sigue siendo un recuadro, no el dibujo aprobado.
- Completar la revisión visual de los cinco marcos, capturas claro/oscuro y español/inglés, comparación junto al mock y diff por pantalla con tolerancia de 2 px.
- Completar la trazabilidad de TODO-01 a TODO-06 y SET-02.
- Actualizar Notion cuando esté conectado y abrir el PR con sus checks. No se marca el change como cerrado.
