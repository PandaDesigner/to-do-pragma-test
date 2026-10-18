# verify-report: fix-chevron-icon-binding

Fecha: 2026-10-18
Rama: `fix/chevron-icon-binding` · commit `866ff46`
PR: https://github.com/PandaDesigner/to-do-pragma-test/pull/54

## 1. Qué se corrigió

El template del badge HOY pedía el chevron por nombre:

```html
<ion-icon name="chevron-forward" aria-hidden="true"></ion-icon>
```

La app nunca llama `addIcons`, así que Ionicons no resolvía ese nombre. En cada render salía `[Ionicons Warning]` y el icono no se dibujaba: el elemento quedaba en el DOM con el atributo correcto y sin SVG dentro.

## 2. Por qué estaba roto en `develop`

El arreglo existía en la rama `fix-ui-fidelity` (commit `1302bde`). El PR #51 se fusionó con squash el 2026-10-18T13:43Z y su commit en `develop`, `4e73ce9`, no es ninguno de los ocho de la rama:

```
$ git log --oneline origin/develop..origin/fix-ui-fidelity
1302bde fix(tasks): registra el chevron del badge HOY como SVG importado
4ce42b9 fix(tasks): declara IonIcon en los imports de TasksPage
eaacf28 docs(fix-ui-fidelity): trazabilidad, README y formato de las correcciones
988bcf3 fix(tasks): pinta el chevron del badge HOY como ion-icon
ec3c91a fix(category-sheet): pone el boton primario antes que el de cancelar
3d9ac2e fix(categories): ilustra el empty state y abre la hoja desde su CTA
e382c60 test(fix-ui-fidelity): tests que fallan por los tres comportamientos ausentes
c7be239 docs(openspec): abrir change fix-ui-fidelity con la evidencia de los mocks
```

Se comprobó antes de abrir el PR que los otros dos comportamientos **sí** habían llegado: el empty state ilustrado de Categorías y el orden primario-antes-que-cancelar del sheet. El alcance perdido eran 4 archivos y 77 líneas, todos del chevron.

## 3. Cambio aplicado

- `tasks.page.ts` importa `chevronForward` de `ionicons/icons` y expone `readonly icons = { chevronForward }`.
- `tasks.page.html` usa `[icon]="icons.chevronForward"` y deja de declarar `name`.
- `today-badge-render.spec.ts` vuelve desde la rama perdida: 66 líneas con `[TODAY-UI-01.5]`, `01.6` y `01.7`.
- `[TODAY-UI-01.1]`, que exigía literalmente `name = 'chevron-forward'`, pasa a exigir `[icon]`.
- `[TODAY-UI-01.5]` a `01.7` se portan a la spec publicada. Solo existían en el delta archivado, que `openspec-ids.spec.ts` excluye por su filtro `name === 'archive'`.

## 4. Verificación

| Comando | Resultado |
| --- | --- |
| `npx jest --runInBand --watchman=false` | 57 suites, 515 tests, 0 fallos |
| `npm run lint` | All files pass linting |
| `npm run lint:styles` | 0 errores |
| `npm run format:check` | All matched files use Prettier code style |
| `npm run typecheck` | 0 errores en `app.json` y `spec.json` |
| `npm run trace:check` | EXIT=0 |
| `npx openspec validate --all --strict` | 18 items, 18 correctos, 0 fallidos |

Nota: `npm test` usa watchman y falla por permisos del sandbox. Se ejecutó con `--watchman=false`.

## 5. Comprobación en el navegador

Contra `ng serve` con este change, a 375x812:

```
3 ion-icon, 0 sin resolver
el ion-icon del badge contiene <svg>
name: null
ancho del icono: 12px
badge: 81.89 x 44
```

El atributo `name` es `null` y hay un `<svg>` dentro del shadow root. Ese es el estado que falla el código anterior.

## 6. Evidencia

`openspec/changes/fix-chevron-icon-binding/evidence/`

- `chevron-badge-light-es.png` (375x812)
- `chevron-badge-dark-es.png` (375x812)

## 7. Fuera de alcance

- El filtro por rango de fecha, en el PR #53. Cuando este PR se fusione, #53 necesitará rebase: ambos tocan `tasks.page.html`, en líneas distintas.
- Ampliar `[SPEC-01.3]`, que solo lee `openspec/specs/direct-commits`. Ese hueco es lo que dejó el CI en verde con una spec archivada sin código. Es un change propio con su migración de filas.