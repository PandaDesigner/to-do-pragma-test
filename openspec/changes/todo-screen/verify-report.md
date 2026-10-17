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

`src/theme/todo-layout.spec.ts` añade cinco contratos de estilos para TODO-01.1, TODO-01.2, TODO-02.1, TODO-03.1 y TODO-05.1. Se comprobó su fallo antes de aplicar la implementación. Son pruebas del código Sass; la geometría y los clics se comprobaron aparte en Chrome.

Pasaron:

- Prettier en los archivos modificados y `git diff --check`.
- `npm run typecheck`, `npm run lint` y `npm run lint:styles`.
- `npm run test`: 38 suites, 277 pruebas; sin reducir los umbrales existentes.
- `npm run build`.
- `npm run trace:check` y `npx openspec validate --all --strict`.
- Revisión del diff contra las guías Sideroom. El helper de prueba separa la lectura del archivo de cada contrato; no requiere otra descomposición. No se refactoriza código ajeno al defecto.
- Detector de estilos de Impeccable sobre los seis archivos Sass modificados: sin hallazgos.

Persisten avisos de Watchman, navegadores antiguos en Browserslist y dependencias CommonJS de almacenamiento. No impiden las comprobaciones anteriores y no son la causa del rail oculto.

## Pendiente para el cierre

- Exportar los iconos y la ilustración desde Figma. La ilustración actual sigue siendo un recuadro, no el dibujo aprobado.
- Completar la revisión visual de los cinco marcos, capturas claro/oscuro y español/inglés, comparación junto al mock y diff por pantalla con tolerancia de 2 px.
- Completar la trazabilidad de TODO-01 a TODO-06 y SET-02.
- Actualizar Notion cuando esté conectado y abrir el PR con sus checks. No se marca el change como cerrado.
