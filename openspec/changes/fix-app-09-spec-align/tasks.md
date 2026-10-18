## 1. Verificación del código real

- [x] 1.1 Leer `tasks.page.ts`, `tasks.page.html`, `categories.page.ts`, `categories.page.html`, `pagination.ts` y `store/task.ts` antes de escribir la spec
- [x] 1.2 Confirmar que `tasks` no declara `shouldVirtualize` ni importa `ScrollingModule`, y que `categories` sí
- [x] 1.3 Confirmar que `tasks.page.spec.ts` afirma `cdk-virtual-scroll-viewport` nulo con 5.005 tareas

## 2. Delta de spec

- [x] 2.1 Reescribir APP-09 con paginación de 20 en `tasks` y virtual scroll en `categories`
- [x] 2.2 Desdoblizar APP-09-A en `APP-09-A.1`, `APP-09-A.2` y `APP-09-A.3`, sin renumerar otras capacidades
- [x] 2.3 Corregir la mención a `shouldVirtualize()` en APP-11-A, que nombra un símbolo inexistente en `tasks`

## 3. Trazabilidad

- [x] 3.1 Añadir filas para `APP-09-A.1`, `APP-09-A.2` y `APP-09-A.3` en `openspec/traceability.md`
- [x] 3.2 Confirmar que ninguna fila afirma virtual scroll en la página `tasks`

## 4. Verificación

- [x] 4.1 `npx openspec validate --all --strict`
- [x] 4.2 `npm run trace:check`
- [x] 4.3 `npm test`

Este change no toca `src/`. No hay fase GREEN porque no hay comportamiento nuevo que implementar: el código correcto ya existe y sus tests ya lo defienden. TDD no aplica a un delta documental.