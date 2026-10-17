# verify-report — change `category-sheet`

## Resumen

Implementación, tests y trazabilidad del change completados. Las verificaciones automatizadas (`npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `openspec validate category-sheet --strict`, `npm run trace:check`) pasan en `develop` antes y después del merge de los PR #14 y #15.

**Estado de las tareas (`tasks.md`):** secciones 1 a 5 cerradas, 6.2 y 6.3 cerradas, 6.1 y 6.4 abiertas con ausencia documentada.

## Lo que falta para cerrar formalmente

Únicamente el bloque **6.1 evidencia visual**, en suspenso por la sesión actual. Se documenta aquí conforme a `AGENTS.md`:

> "No generar binarios sin firmar cuando falten credenciales: documentar la ausencia."

No había simulador iOS ni emulador Android arrancado en la sesión y la regla permanente exige capturas firmadas a 375×812 con tolerancia de 2 px. Por tanto, la tarea 6.1 queda **ausente**, no realizada, y el change no se archiva en esta sesión.

## Tareas (`tasks.md`)

- **1 Diseño** — `[x]` PR #14 (commit `a50d0d5`).
- **2 Comando compartido y sheet base** — `[x]` PR #14.
- **3 Campos Icon y Color con piezas locales** — `[x]` PR #14.
- **4 Campo Section y preview con chip extendido** — `[x]` PR #14.
- **5 Acciones y enlace desde la página y el NewTaskModal** — `[x]` PR #14.
- **6.1 Capturas 375×812 en claro y oscuro, es y en** — `[ ]` **ausente**, documentada por falta de simulador/emulador en la sesión. Ver "Cómo generar la evidencia" más abajo.
- **6.2 Trazabilidad** — `[x]` tabla en `openspec/traceability.md` con 17 filas `SHEET-01.x` … `SHEET-07.1`. La columna evidencia está pendiente para 6.1.
- **6.3 Pasan tipos, lint, jest con cobertura, `trace:check` y `openspec validate --strict`** — `[x]` 46 suites / 385 tests verdes en `develop` post-merge del PR #30.
- **6.4 PR con sección Reutilización** — `[ ]` **ausente**. El PR #14 se fusionó antes de inventariar la reutilización. Se documenta aquí el resumen, no en la descripción del PR (ya cerrado).

## Reutilización (recap)

Componentes y comandos compartidos introducidos o extendidos:

- `CategorySheetComponent` en `src/app/shared/components/category-sheet/` — único modal reutilizable. Consumidores: `CategoriesPage` (modos `Create` desde el FAB y `Edit` desde la fila) y el selector del NewTaskModal (solo `Create`). Piezas locales `IconOptionComponent` y `ColorSwatchComponent` viven en el mismo archivo del sheet y no se registran en `shared/components/index.ts` porque solo el sheet las usa.
- `ChipComponent` extendido con `<ng-content select="[appChipIcon]"></ng-content>` opcional — sin nuevos inputs. Los consumidores previos no proyectan nada y siguen funcionando; la cobertura del chip añadió un test que verifica que la proyección vacía no rompe el render.
- `CategoriesStore.openCategorySheet(mode, draft?)` — único punto de entrada al sheet desde fuera de `CategorySheetComponent`. La página de tareas no abre el sheet por su cuenta, escribe en el `signal` del store.
- Doce `ionicons/icons` reusados para el selector visual, sin SVGs nuevos.

## Verificaciones automatizadas (post-merge en `develop`)

- `npm run lint` — limpio.
- `npm run typecheck` — limpio.
- `npm run test -- --coverage` — 46 suites, 385 tests verdes.
- `npm run build` — `ng build --configuration production` OK.
- `npm run trace:check` — limpio.
- `openspec validate category-sheet --strict` — `Change 'category-sheet' is valid`.

Cobertura: la cobertura global y de `shared` se mantiene sobre el umbral declarado en `AGENTS.md` (80 % global, 90 % `shared`). El PR #14 ya había añadido tests para `dismiss`, `kind` preservado y `fillColor`; el PR #15 siguió.

## Cómo generar la evidencia cuando haya simulador disponible

Comando iOS (referencia — la app está en Cordova, no Capacitor):

```
xcrun simctl boot "iPhone 16"            # 393×852, el más cercano a 375×812
npm ci
npm run build                            # genera www/ para Cordova
npx cordova run ios --target="iPhone 16"
# dentro del sheet, alterna tema/idioma desde el shell:
xcrun simctl io booted screenshot categories-form-sheet-light-es.png
```

Capturas requeridas (6), tolerancias 2 px contra los nodos Figma:

| Archivo | Nodo Figma | Tema | Idioma |
| --- | --- | --- | --- |
| `categories-form-sheet-light-es.png` | 4:869 | light | es |
| `categories-form-sheet-dark-es.png` | 4:869 | dark | es |
| `categories-form-sheet-light-en.png` | 4:869 | light | en |
| `categories-form-sheet-dark-en.png` | 4:869 | dark | en |
| `categories-form-sheet-panel-light-es.png` | 4:947 | light | es |
| `categories-form-sheet-panel-dark-es.png` | 4:947 | dark | es |

Las capturas se guardan en `openspec/changes/category-sheet/evidence/`.

Tras generarlas, cerrar las 17 filas `SHEET-01.x` … `SHEET-07.1` de `openspec/traceability.md` cambiando `pendiente` por el nombre del archivo relevante y la tarea (`6.1`), re-correr `npm run trace:check` y `openspec validate --all --strict`, y entonces sí archivar el change:

```
openspec archive category-sheet
# crea rama chore/archive-category-sheet
# PR propio, esperar checks, merge y mover a openspec/changes/archive/
```

## Cambio histórico de PRs del change

- PR #14 (`feature/category-sheet`) — implementación inicial.
- PR #15 (`feature/category-sheet-followups`) — `IconOptionComponent` con `ionicons` en vez de texto y cobertura adicional.
- PR #30 (`chore/prettier-fmt`) — format drift acumulado en 17 archivos (incluye parte de este change); necesario para que `verify` pase.
