# Prompt: hotfix CI verde (fix/ci-green)

> Pegar tal cual en una sesión nueva de pi.

---

Eres MiniMax trabajando en el harness pi, en el proyecto `/Volumes/Disco Mac/Develop/ionic/pragma/to-do-pragma-test` (Ionic 8 + Angular 22 standalone, Cordova, Jest 30, `@ngrx/signals`, OpenSpec 1.3.1). Vas a hacer un **hotfix** para devolver `develop` a CI verde. No es un cambio de OpenSpec: no crees change, no toques `openspec/changes` y no archives nada.

## Contexto verificado (revisión del 17-oct, 10:20 COT, sobre `develop` `f00ae17`)

1. **El build de producción está roto.** `npm run build -- --configuration production` falla con:
   ```
   ✘ [ERROR] TS2339: Property 'loadMore' does not exist on type 'TasksPage'.
       src/app/pages/tasks/tasks.page.html:101:60
         101 │ <button type="button" class="link load-more" (click)="loadMore()">
   ```
   - **Origen:** commit `7494537` (2026-10-17 09:51 COT, «feat(tasks): duración en fracciones de 15 min hasta 2 h, aviso como preset»).
   - **Causa:** la plantilla llama a `loadMore()` en la página, pero el método existe solo en el store (`TaskStore.loadMore()`, `src/app/store/task.ts:171`). La página expone el store como `store`.
   - **Por qué no lo vio nadie:** `npm test` (Jest) y `npm run typecheck` (`tsc --noEmit`) no compilan las plantillas en AOT, así que pasan en verde. Solo `ng build` lo detecta, y en CI ese paso va al final de `verify`.
   - **Efecto en CI:** también fallan los jobs `Cordova Android (debug)` y `Cordova iOS (no signing)`.
2. **`npm run format:check` falla en 17 ficheros**, y es el primer paso rojo de `verify`. Son: `src/app/domain/category-icons.spec.ts`, `src/app/domain/category-icons.ts`, `src/app/layout/shell/shell.component.spec.ts`, `src/app/pages/categories/categories.page.html`, `src/app/pages/categories/categories.page.spec.ts`, `src/app/pages/categories/categories.page.ts`, `src/app/pages/tasks/tasks.page.html`, `src/app/pages/tasks/tasks.page.spec.ts`, `src/app/pages/tasks/tasks.page.ts`, `src/app/shared/components/category-sheet/category-sheet.component.html`, `…/category-sheet.component.scss`, `…/category-sheet.component.spec.ts`, `…/category-sheet.component.ts`, `src/app/shared/components/chip/chip.component.spec.ts`, `src/app/shared/components/task-item/task-item.component.html`, `…/task-item.component.spec.ts` y `src/app/store/category.ts`.
3. **Historial de CI en `develop`.** El último verde fue `f9b92a7` (PR #13 todo-screen, 08:30 COT). Desde `9873c95` (PR #14 category-sheet, 09:41 COT), que metió los primeros ficheros sin formato, **los 15 pushes a `develop` están en rojo**, hasta `f00ae17` (PR #28, 10:18 COT).
4. **Lo que sí pasa hoy:** 46 suites y 385 tests; cobertura global 94,04 / 87,5 / 91,56 / 93,88 (umbrales 80; domain 95, data y store 90, todos cumplidos); `lint`, `lint:styles`, `typecheck` y `trace:check`; `openspec validate --all --strict` 9/9.

## Reglas

- **Rama:** `fix/ci-green`, desde `develop` actualizado: `git fetch origin && git switch develop && git pull --ff-only`, y comprueba que HEAD es `f00ae17` o posterior. Si `develop` ya tiene el arreglo, para e informa.
- **TDD estricto:** primero RED (un test que falla por este bug), luego GREEN (arreglo mínimo), luego REFACTOR si hace falta. Pega la salida RED y GREEN.
- **Alcance mínimo:** el arreglo de `loadMore`, su test, el formato y, si lo eliges, el paso de CI. Nada más: no refactorices otras cosas y no cambies dependencias.
- **Commits:** Conventional Commits, pequeños, en este orden:
  1. `test(tasks): …` (RED)
  2. `fix(tasks): …` (GREEN)
  3. `style: aplicar prettier a 17 ficheros`
  4. opcional: `ci: …`
- **Prohibido:** `--no-verify`, `push --force`, `openspec archive`, fusionar el PR o marcarlo listo con CI en rojo. **Pedro fusiona.**

## Pasos

1. **RED: test que atrape el bug.** Elige una opción (preferida la a, y si puedes también la b):
   - a) **Test de plantilla:** en `src/app/pages/tasks/tasks.page.spec.ts`, renderiza `TasksPage` con `TestBed` y el store con más tareas que el tamaño de página, de forma que aparezca el botón `.load-more`. Haz clic y espera que `store.loadMore` se llame una vez, o que crezca `pageCount` o el número de tareas visibles. Si con el arreglo mal (`loadMore()` en la página sin método) Jest no falla porque no hay compilación AOT, documéntalo y aplica la b.
   - b) **Comprobación de plantillas en CI (recomendada):** ejecuta `ng build` o una compilación de plantillas con `strictTemplates` (por ejemplo `npx ng build --configuration development`, o `ngc -p tsconfig.app.json` con `angularCompilerOptions.strictTemplates: true`) como paso temprano de `verify`, justo después de `npm ci` y antes de los tests, en `.github/workflows/verify.yml`. Añade el script `"typecheck:templates"` en `package.json` y llámalo desde `typecheck` o desde CI. RED: con el bug, ese script falla con TS2339.
2. **GREEN, una de dos:**
   - En la plantilla, `(click)="store.loadMore()"`.
   - O añade en `TasksPage` un `loadMore(): void { this.store.loadMore(); }`. Si eliges esta, tiene que estar cubierto por el test.

   Mantén el comportamiento: «Cargar más» suma una página.
3. **Formato:** `npm run format` y revisa que el diff de esos 17 ficheros sea solo formato.
4. **Verificación local completa.** Ejecuta y **pega la salida resumida** de cada comando (exit code y líneas clave):
   ```
   npm test -- --coverage
   npm run lint
   npm run lint:styles
   npm run format:check
   npm run typecheck
   npm run build -- --configuration production
   openspec validate --all --strict
   npm run trace:check
   ```
   (y `npm run typecheck:templates` si lo creaste). Todos con exit 0, y la cobertura sin bajar de los umbrales.
5. **PR:** `git push -u origin fix/ci-green`. Abre el PR a `develop` como **borrador** con el título `fix(ci): build de producción y formato en verde`. En el cuerpo:
   - la causa (`7494537`, `tasks.page.html:101`);
   - RED y GREEN;
   - los 8 comandos con su resultado;
   - la lista de los 17 ficheros formateados;
   - el paso de CI añadido, si lo hay.

   Espera a que CI termine. Pasa el PR a **listo para revisión solo si `verify`, `Cordova Android (debug)` y `Cordova iOS (no signing)` están en verde.** Si algo falla, corrígelo en la misma rama con un commit nuevo, nunca con force-push. No fusiones.
6. **Notion (MCP de Notion), base Tasks `a831b37ad5994d3f82bf40bdc5178af5`:** en la fila «🚨 Hotfix: build roto loadMore + format», añade una línea al final del Note, sin borrar nada:
   - al empezar: `[MiniMax/pi <AAAA-MM-DD HH:MM> COT] inicio fix/ci-green desde <hash develop>` y Status → In progress;
   - al abrir el PR: `[MiniMax/pi <AAAA-MM-DD HH:MM> COT] PR <url> · RED/GREEN <hashes> · 8/8 comandos verdes · CI <estado>`;
   - si algo bloquea: Status → Blocked, con la razón.

   No marques Done: Pedro lo hará al fusionar.

## Entrega

Al final responde con:
- la rama y los hashes de los commits;
- la URL del PR y el estado de cada check de CI;
- la salida resumida de los 8 comandos;
- qué opción de test usaste (a o b) y por qué;
- cualquier riesgo pendiente.
