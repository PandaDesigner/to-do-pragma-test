## Contexto

Este change es documental. El código de `tasks` y `categories` ya está implementado y verificado; lo que está mal es el texto de la spec. No se escribe código de producción.

## Evidencia en el código

Cada afirmación del delta sale de leer estos ficheros, no de la spec anterior.

| Comportamiento | Dónde vive | Código |
| --- | --- | --- |
| Tamaño de página 20 | `src/app/domain/pagination.ts` | `export const PAGE_SIZE = 20;` |
| Recorte de la lista filtrada | `src/app/store/task.ts` | `visibleTasks` corta con `slice(start, start + size)` y `pageSize: TASK_PAGE_SIZE` |
| Total de páginas | `src/app/pages/tasks/tasks.page.ts` | `totalPages = pageCount(filteredTasks().length, store.pageSize())` |
| Página actual acotada | `src/app/pages/tasks/tasks.page.ts` | `currentPage = min(max(1, tabPage()), totalPages())` |
| Slot de scroll infinito | `src/app/pages/tasks/tasks.page.html` | `ion-infinite-scroll` con `[disabled]="!hasMore()"` y `(ionInfinite)="loadMore($event)"` |
| Paginador anclado | `src/app/pages/tasks/tasks.page.html` | `nav.pager` con `@if (totalPages() > 1)` y `.pager__btn--active` |
| Umbral de virtualización | `src/app/pages/categories/categories.page.ts` | `VIRTUAL_SCROLL_THRESHOLD = 200` y `shouldVirtualize()` |
| Viewport de CDK | `src/app/pages/categories/categories.page.html` | `cdk-virtual-scroll-viewport` con `*cdkVirtualFor` |
| Contradicción probada | `src/app/pages/tasks/tasks.page.spec.ts` | con 5.005 tareas, `querySelector('cdk-virtual-scroll-viewport')` es `null`, hay 20 `app-task-item` y `.pager` existe |

## Decisiones

### Reescribir APP-09 en vez de añadir un requisito nuevo

APP-09 sigue siendo el requisito que gobierna cómo se renderizan las listas de `tasks` y `categories`. Su redacción actual es falsa, así que un requisito nuevo conviviría con uno mentiroso. Un delta `MODIFIED` lo sustituye conservando el identificador `APP-09` y el del escenario, porque renombrarlos rompería `src/openspec-ids.spec.ts` y las filas de trazabilidad.

### Describir `trackBy` donde realmente se usa

La redacción anterior imponía `trackBy: trackById` a las dos páginas. En el código actual:

- `categories` usa `*cdkVirtualFor="let category of store.categories(); trackBy: trackById"`, así que ahí `trackById` es real.
- `tasks` renderiza con `@for (task of visibleTasks(); track task.id)`. `TasksPage` conserva `readonly trackById`, pero la plantilla no lo referencia.

El delta dice cada cosa donde es cierta, en vez de generalizar. No se borra `trackById` de `TasksPage`: existe, está cubierto por tests y quitarlo sería un cambio de código fuera del alcance.

### Mencionar `visibleTasks()` y no `shouldVirtualize()` en APP-11-A

APP-11-A acaba diciendo que `tasks()` pasa a tener 5.005 tareas y que `shouldVirtualize()` devuelve `true`. La primera mitad sigue siendo verdad. La segunda nombra un símbolo que la página `tasks` no expone. Se corrige para apuntar a la paginación real. Es la única mención a `APP-11` que se toca, y solo porque nombra algo inexistente.

### Actualización de trazabilidad

`trace:check` solo valida que un identificador de escenario de la matriz aparezca en algún `.spec.ts`. Por eso se **añaden** filas para `APP-09-A.1` y `APP-09-A.2` apuntando a tests que ya existen y que ya afirman el comportamiento correcto, en vez de renombrar escenarios ni reescribir tests que pasan. Los identificadores nuevos están en la matriz y existen en la spec, así que ambos checks pasan.

`PAGE-20.1`, `SCROLL-01.1` y `PAGER-01.1` de `regularize-direct-commits` ya describen paginación y scroll reales y no afirman virtual scroll en `tasks`, así que se dejan intactas.

## Alternativas descartadas

- **Reimplementar virtual scroll en `tasks`.** Pedro aprobó una corrección documental; el comportamiento actual es el que se quiere, con su test que lo defiende.
- **Borrar `trackById` de `TasksPage` para que la spec y el código digan lo mismo.** Es lo contrario de este change: aquí manda el código, y además es código de producción cubierto por tests.
- **Renumerar APP-09-A en dos escenarios con otro formato.** Se mantiene el nombre `APP-09-A` y se le añaden subpuntos `.1` y `.2`, que es la convención que ya usan `TSK-17.1`…`TSK-17.4` y `SHEET-01.1`.

## Reversión

Revertir el merge del change. No hay migración, ni estado, ni artefactos de runtime que revertir.

## Fuente Figma

No aplica. APP-09 es un requisito técnico de rendimiento sin nodo de Figma asociado, ni antes ni después de este change. `trace:check` no exige nodo para filas cuyo nodo no está en `docs/design.json`.