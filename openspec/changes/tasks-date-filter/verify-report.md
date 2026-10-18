# Verify report — tasks-date-filter

Rama: `feat/tasks-date-filter` · Base: `develop` · Commit de implementación: `d77281f`, cierre `904d426`.

## 1. Resumen

El badge "HOY" de `.top-actions` se convierte en un grupo de filtro por fecha: el badge sigue siendo el
filtro rápido del día actual, y a su lado un icono de calendario abre un `ion-modal` hoja con
`ion-datetime` en modo rango (desde/hasta) que filtra las tareas por `dueDate`.

Deuda técnica reportada por el usuario y resuelta en este change:

- El título del día se formatea con `Intl.DateTimeFormat` en español e inglés, con respaldo a inglés.
- El texto de las pestañas del rail lateral recupera contraste en modo oscuro mediante `--app-tab-label`.

## 2. Comandos ejecutados

| Comando | Resultado |
| --- | --- |
| `npx jest --runInBand --watchman=false --coverage` | 62 suites, **550 tests**, 0 fallos |
| `npm run lint` | "All files pass linting.", 0 problemas |
| `npm run lint:styles` | stylelint sin errores sobre `src/**/*.scss` |
| `npm run format:check` | "All matched files use Prettier code style!" |
| `npm run typecheck` | `tsc --noEmit` en `tsconfig.app.json` y `tsconfig.spec.json` sin errores |
| `npm run build` | `ng build` correcto; solo el aviso de Browserslist preexistente del proyecto |
| `npm run trace:check` | correcto, sin escenarios sin test |
| `npx openspec validate --all --strict` | 18 items, **18 correctos, 0 fallidos** |

## 3. Cobertura

| Área | Umbral | Obtenido |
| --- | --- | --- |
| Global (statements) | 80 % | **94.27 %** |
| `src/app/domain` | 95 % | **100 %** |
| `src/app/store` | 90 % | **97.95 %** |
| `src/app/shared` | 90 % | el umbral se aplica por archivo; el nuevo `date-range-filter` queda en **100 %** statements |

Detalle de los archivos tocados:

- `src/app/domain/task-strategy.ts`: 100 %.
- `src/app/store/task.ts`: 96.66 % statements.
- `src/app/shared/components/date-range-filter/*`: 100 % statements, 100 % líneas.
- `src/app/pages/tasks`: 92.12 % statements, 92.27 % líneas.

Ningún umbral se bajó ni se desactivó regla alguna.

## 4. Evidencia visual

**BLOCKED.** Las capturas `evidence/tasks-filter-{light,dark}-{es,en}.png` a 375x812 no se pudieron generar:
el change corre en un entorno sin servidor de desarrollo accesible ni navegador headless disponible para
este agente. No se inventaron archivos de imagen y las filas de `openspec/traceability.md` que dependen de
captura apuntan a esta sección como ausentes.

Pendiente para el revisor: `npm start` y capturar `todo-day-panel-open` (nodo Figma `4:440`) con el filtro
de fecha abierto, en claro y oscuro, con el idioma español e inglés.

## 5. Desviaciones respecto al enunciado

1. **`ion-alert` en lugar de `ion-modal`.** Se verificó en el paquete instalado `@ionic/core@8.8.19` que
   `ion-alert` no expone propiedad `template` y que `AlertInput.type` solo admite tipos nativos, por lo que
   no puede alojar un `ion-datetime`. El enunciado permite `ion-modal` si se justifica en `design.md`, y ahí
   queda documentado con el tipo exacto que lo descarta. El selector usa `ion-modal` con breakpoints de
   hoja (`[initialBreakpoint]="0.6"`, `[breakpoints]="[0, 0.4, 0.6]"`), `[showDefaultTitle]="false"` y
   altura explícita de 330 px.
2. **Badge "HOY" reducido a 63x21 px** en lugar de una reducción libre, porque es el tamaño medido en Figma
   (`4:440`). Los tokens quedan en `--app-day-badge-min-width`, `--app-day-badge-height` y
   `--app-day-badge-icon-size`.

## 6. Reutilización

- `PageHeaderComponent` y `TaskItemComponent` ya son presentacionales en `shared`; el nuevo
  `DateRangeFilterComponent` sigue el mismo patrón: solo `input()`/`output()`, sin `store` ni `data`.
- El componente se importa por ruta, como ya se hace con los componentes existentes, porque el barrel
  `src/app/shared/index.ts` está vacío en `develop`.
- `calendarOutline` ya se usaba en `task-item.component.ts` para los estados `EXPIRE` y `RESCHEDULE`; la
  pantalla de tareas reutiliza ese mismo icono desde `ionicons/icons` con `readonly icons = { calendarOutline }`,
  sin `name="..."` suelto y sin `addIcons`.
- `parseLocalIsoDate`, `APP_LOCALES` y el formateo de `day-title.ts` se reaprovecharon y ampliaron con `Intl`
  en vez de crear un formateador parallelo; `parseLocalIsoDate` mantiene su semantica de hora local.