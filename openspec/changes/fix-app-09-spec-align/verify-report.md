# Verify report — fix-app-09-spec-align

Ejecutado sobre `develop` en `57923ba`, rama `fix/app-09-spec-align`. Ningún comando de red, sin firma, sin APK.

## 1. Verificación del conflicto antes de escribir

Se leyó el código real. La spec mentía y el test la desmiente:

| Fuente | Qué dice |
| --- | --- |
| `openspec/specs/app-base/spec.md` (antes) | APP-09: `tasks` y `categories` aplican virtual scroll de CDK desde 200 tareas. APP-09-A: con 5.000 tareas `shouldVirtualize()` es `true` y sale `cdk-virtual-scroll-viewport`. |
| `src/app/pages/tasks/tasks.page.ts` | Sin `shouldVirtualize`, sin `ScrollingModule`. Expone `totalPages`, `currentPage`, `visibleTasks`, `hasMore`, `pageNumbers`. |
| `src/app/domain/pagination.ts` | `PAGE_SIZE = 20`. |
| `src/app/store/task.ts` | `visibleTasks` corta con `slice(start, start + size)`; `pageSize: TASK_PAGE_SIZE`. |
| `src/app/pages/tasks/tasks.page.html` | `section.task-list` con `@for`, `ion-infinite-scroll`, `nav.pager`. |
| `src/app/pages/tasks/tasks.page.spec.ts` | Con 5.005 tareas: `cdk-virtual-scroll-viewport` es `null`, 20 `app-task-item`, `.pager` presente, `totalPages()` 251. |
| `src/app/pages/categories/categories.page.ts` | `VIRTUAL_SCROLL_THRESHOLD = 200` y `shouldVirtualize()`. |
| `src/app/pages/categories/categories.page.html` | `cdk-virtual-scroll-viewport` con `*cdkVirtualFor` y `trackById`. |

Diagnóstico del encargo: **correcto**. El virtual scroll vive solo en `categories`.

## 2. Dos desviaciones respecto al encargo, y por qué

### 2.1 Los identificadores `APP-09-A.1` no son válidos en este repo

El encargo proponía subdividir APP-09-A con sufijos `.1`. `scripts/trace-check.mjs` valida el escenario con

```
/^[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d+(?:\.\d+)?$/
```

`APP-09-A.1` **no** casa: el tramo final debe ser un número, no `A.1`. Comprobado en Node. Toda etiqueta `PREFIX-NN.M` sí casa. Por eso los escenarios son `[APP-09.1]` y `[APP-09.2]`, no `APP-09-A.1` ni `APP-09.1` según pedía el encargo.

Esto también evita chocar con `SPEC-01.2`, que exige que todo id citado por un test exista en una spec. Los dos ids llevan además prefijo en el `it()`, como manda AGENTS.md.

### 2.2 Abrir un change rompió SPEC-01.1, y el arreglo es del test, no del delta

`src/openspec-ids.spec.ts` contaba como "definición" cualquier cabecera `### Requirement:` en `openspec/specs` **y** en `openspec/changes`, y exigía unicidad. Un delta `## MODIFIED Requirements` **debe** repetir el id que modifica: `openspec validate --all --strict` lo exige para casar con el requisito existente. Los dos requisitos son incompatibles si se leen a la ligera.

El bug era del test, no del delta: la regla correcta es que un id vive en un solo sitio, y un delta MODIFIED/REMOVED repite ids ya publicados a propósito. Solo los bloques `## ADDED Requirements` introducen ids nuevos en un change. Se ajustó `SPEC-01.1` para aplicar la regla esa, y se dejó el comentario explicando por qué.

No se relajó ninguna garantía: la unicidad sigue comprobándose, y ahora además distingue un id nuevo de una repetición legítima.

## 3. Comandos ejecutados

| Comando | Resultado |
| --- | --- |
| `npx openspec validate --all --strict` | 17 passed, 0 failed |
| `npm run trace:check` | verde |
| `npx jest --runInBand` | 55 suites, **492 tests, 492 passed** |
| `npx jest --coverage` | global 94.09 % statements / 87.9 % branches / 90.9 % functions; umbres de `jest.config.cjs` cumplidos, sin fallo por umbral |
| `npm run typecheck` | verde |
| `npm run format:check` | verde |

`openspec/` no entra en el alcance del script `format` del repo y ya venía sin formatear en 40 ficheros; no se reformateó para no ensuciar el diff. Los ficheros de este change siguen el estilo de los changes ya archivados.

Nota de entorno: `npm test` tal cual no arranca en esta sesión porque el sandbox no deja a Watchman hacer `fchmod` en su socket. Con `--watchman=false` corre entero. No es un fallo del repo.

## 4. Cambio de comportamiento

Ninguno. No se tocó `src/` salvo:

- el prefijo `[APP-09.1]` y `[APP-09.2]` en los títulos de dos tests que ya afirmaban el comportamiento correcto;
- `SPEC-01.1`, para que un delta `MODIFIED` deje de contarse como id duplicado.

## 5. Trazabilidad

Dos filas nuevas en `openspec/traceability.md`, apuntando a tests que ya existían y que ya pasaban:

| Nodo | Req | Scenario | Test |
| --- | --- | --- | --- |
| 4:440 | APP-09 | APP-09.1 | `tasks.page.spec.ts:[APP-09.1]` |
| 4:788 | APP-09 | APP-09.2 | `categories.page.spec.ts:[APP-09.2]` |

Se corrigió además APP-11-A, que pedía `shouldVirtualize()` en la página de tareas: ese símbolo no existe ahí.

Revisadas las filas de `PAGE-20.1`, `SCROLL-01.1` y `PAGER-01.1`: ya describen paginación y scroll reales, ninguna afirma virtual scroll en `tasks`. Se dejan intactas.

## 6. Evidencia visual

No aplica. APP-09 es requisito técnico de rendimiento, sin nodo de Figma antes ni después. No se tocaron estilos ni plantillas, así que no hay capturas que rehacer.