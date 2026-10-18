## Why

La spec `app-base` describe en APP-09 que `tasks` y `categories` aplican virtual scroll de CDK a partir de 200 tareas, y su escenario APP-09-A afirma que con 5.000 tareas `shouldVirtualize()` devuelve `true` y se renderiza `cdk-virtual-scroll-viewport` en la página `tasks`. El código ya no hace eso.

Verificado en `develop` antes de escribir este change:

- `src/app/pages/tasks/tasks.page.ts` no declara `shouldVirtualize` ni importa `ScrollingModule`; la clase expone `totalPages`, `currentPage`, `visibleTasks`, `hasMore` y `pageNumbers`, y `visibleTasks()` corta la lista filtrada en franjas de `store.pageSize()`.
- `src/app/domain/pagination.ts` fija `PAGE_SIZE = 20` y `store/task.ts` lo toma como `TASK_PAGE_SIZE`.
- `src/app/pages/tasks/tasks.page.html` renderiza `section.task-list` con `@for (task of visibleTasks(); track task.id)`, un `ion-infinite-scroll` y un `nav.pager` de páginas numeradas.
- `src/app/pages/tasks/tasks.page.spec.ts` afirma activamente que `cdk-virtual-scroll-viewport` es `null` con 5.005 tareas, que hay 20 `app-task-item` y que `.pager` existe.
- El virtual scroll de CDK solo sigue vivo en `categories`: `categories.page.ts` importa `ScrollingModule` y calcula `shouldVirtualize()` con `VIRTUAL_SCROLL_THRESHOLD = 200`, y `categories.page.html` renderiza `cdk-virtual-scroll-viewport` con `*cdkVirtualFor`.

Es decir, la spec afirma un comportamiento que un test propio desmiente. La spec es la que miente.

## What Changes

- Se reescribe APP-09 y APP-09-A para que describan el comportamiento real: `tasks` pagina de 20 en 20 con paginador anclado bajo el scroll más scroll infinito, y `categories` es la que aplica virtual scroll de CDK a partir de 200.
- Se corrige la línea de APP-11-A que sigue atribuyendo `shouldVirtualize()` a la página de tareas, porque ese evaluador no existe allí.
- Se sincroniza `openspec/traceability.md` con los escenarios corregidos.

No cambia el comportamiento observable de la app. No se toca `src/`: es una corrección de documentación y trazabilidad.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `app-base`: APP-09, APP-09-A y APP-11-A pasan a describir la paginación de `tasks` y el virtual scroll de `categories`.

## Impact

Sin impacto de runtime. Solo `openspec/specs/app-base/spec.md` mediante delta, `openspec/traceability.md` y los artefactos del change. Sin nodos de Figma nuevos: APP-09 nunca los tuvo y esta corrección tampoco los introduce; se documenta como requisito técnico de rendimiento, no de UI. Rama `fix/app-09-spec-align` hacia `develop`.

## Out of scope

- Añadir virtual scroll a `tasks` o quitarlo de `categories`. El código actual es el deseado.
- Renombrar APP-09 o sus escenarios, para no romper `openspec-ids.spec.ts` ni otras capacidades.
- Reabrir APP-11, APP-12 ni ningún otro requisito, salvo la mención incidental a `shouldVirtualize()` en APP-11-A que queda dentro del alcance porque nombra un símbolo inexistente.