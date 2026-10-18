## Context

La pantalla de tareas (`app-tasks`) tiene en `.top-actions` un solo botón, el badge de hoy. Hoy mide 336x44 porque `.top-actions` es un flex con `justify-content: flex-end` y `.today-badge` es `display: inline-flex` sin `flex-basis`: el navegador le reparte el ancho libre del contenedor.

Pedro pide convertirlo en un grupo de filtro por fecha: botón rápido HOY + icono de calendario al lado, que abre un `ion-alert` con selección de rango (desde/hasta) para filtrar las tareas por fecha. Y pide reducir el badge.

En el mismo change entran dos deudas ya reportadas: el título del día sale como `18.Sun` con tablas fijas en inglés, y el texto del rail lateral se pierde en modo oscuro.

### Restricción de la instrucción y hallazgo que la invalida

La instrucción de este change pide montar el `ion-datetime` dentro del `ion-alert` usando la propiedad `template` de Ionic 8, y autoriza explícitamente saltar a `ion-modal` si se justifica.

**La propiedad `template` no existe en `ion-alert` en la versión instalada.** Se verificó contra el paquete real, no contra documentación:

- `@ionic/core@8.8.19`.
- `node_modules/@ionic/core/dist/types/components/alert/alert.d.ts` declara 24 propiedades. Ninguna es `template`. Las de contenido son `message?: string | IonicSafeString`, `inputs: AlertInput[]` y `buttons`.
- `AlertInput.type` es `TextFieldTypes | 'checkbox' | 'radio' | 'textarea'`. No existe un tipo `datetime`: un calendario no es un input de texto, y no se puede colar por ahí.
- Ningún overlay de Ionic 8.8.19 declara `template` (`alert`, `modal`, `popover`, `action-sheet`, `picker`): `grep` de `^\s+template\??:` sobre `dist/types/components/**/*.d.ts` no devuelve ninguna coincidencia. `ion-popover` usa `component?: ComponentRef`, que es otra API.

Conclusión: `ion-alert` **no puede** contener un `ion-datetime` en esta versión. No es una cuestión de cómo se pasa la propiedad: la propiedad no está.

Por eso el overlay se implementa como `ion-modal`, que es exactamente la alternativa que la instrucción autoriza si queda justificada en este documento. La justificación es empírica, no de gusto: la ruta por `contentInputs` que la instrucción descarta está descartada por el tipo, y la ruta por `template` que la instrucción exige no existe en el paquete instalado.

### Estado actual del store y del filtro

`TaskStore` es un `signalStore` con estado plano. Sus filtros son `statuses`, `categoryId` y `section`, y los tres métodos (`setStatuses`, `setCategory`, `setSection`) hacen `patchState(store, { ..., pageCount: 1 })`. `filterTasks` en `domain/task-strategy.ts` recibe `{ statuses, categoryId }` y aplica conjunción. El rango de fechas sigue exactamente ese patrón: estado nuevo, setter nuevo con `pageCount: 1`, y una condición más en el filtro.

## Goals / Non-Goals

**Goals:**

- Grupo de filtro por fecha en `.top-actions`: botón HOY + botón de calendario.
- El icono de calendario abre un overlay con un calendario de rango real (desde/hasta) que filtra las tareas.
- Reducir el badge HOY para que no ocupe 336 px.
- Localizar el título del día en español e inglés.
- Recuperar el contraste del texto del rail en modo oscuro.
- Cerrar el filtro de hoy con el botón HOY, sin romper su comportamiento actual.

**Non-Goals:**

- Persistir el rango entre sesiones.
- Filtrar por hora, por texto, o rangos disjuntos.
- `contentInputs` en el alert: descartado por tipo.
- Cambiar el grupo de badges de Figma 4:440, que no tiene icono de calendario.

## Fuente Figma

Canvas `0:1` de [F6ztYiRO9b0xYZA38xSTIA](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA). MCP `figma` consultado en esta sesión (`get_variable_defs` sobre 4:440 y 4:1560).

| Nodo | Pantalla | Mock local | Uso en este change |
| --- | --- | --- | --- |
| [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440) | `todo-day-panel-open` | `docs/mocks/todo-day-panel-open.png` | `.top-actions`, badge HOY, tinta del rail |
| [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520) | `todo-panel-closed` | `docs/mocks/todo-panel-closed.png` | badge HOY con el panel cerrado |
| [4:973](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-973) | `todo-filtered-by-category` | `docs/mocks/todo-filtered-by-category.png` | patrón de filtro por categoría que el de fecha replica |
| [4:1560](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1560) | `todo-dark-mode` | `docs/mocks/todo-dark-mode.png` | tinta del rail en modo oscuro |

**Limitación honesta de la fuente:** Figma 4:440 no compone el grupo de filtro por fecha. `.top-actions` en Figma solo tiene `TodayBadge` 63x21, sin icono de calendario al lado, y no hay una pantalla con un calendario de rango. La petición del usuario es una ampliación de la pantalla, no una reproducción. Este change implementa la petición y deja el badge en las medidas de Figma; el icono de calendario es una decisión de diseño, no una lectura de Figma.

## Mapeo Figma → src/theme

Valores verificados con `get_variable_defs` en 4:440 (light) y 4:1560 (dark).

| Variable Figma | Light | Dark | Token SCSS (`_tokens.scss`) | CSS var |
| --- | --- | --- | --- | --- |
| `color/primary-dark` | `#3a2e5c` | `#edeaf5` | `$color-primary-dark` | `--app-primary-dark` |
| `color/text` | `#2e2547` | `#edeaf5` | `$color-text` | `--app-text` |
| `color/accent-link` | `#3aa8e0` | `#3aa8e0` | `$color-accent-link` | `--app-accent-link` |
| `fs/badge` | `11` | `11` | ya existe | `--app-font-size-badge` |
| `radius/badge` | `2` | `2` | `$radius-badge` | `--app-radius-badge` |
| `radius/input` | `10` | `10` | `$radius-input` | `--app-radius-input` |
| `fs/body` | `14` | `14` | ya existe | `--app-font-size-body` |
| `space/16` | `16` | `16` | `$space-16` | `--app-space-16` |
| `space/8` | `8` | `8` | `$space-8` | `--app-space-8` |

### Token nuevo

| Token | Light | Dark | Origen | Para qué |
| --- | --- | --- | --- | --- |
| `--app-tab-label` | `#3a2e5c` | `#edeaf5` | `color/primary-dark` en claro, `color/text` en oscuro | Texto de las pestañas del rail |

`--app-tab-label` ya existía en `variables.scss` apuntando a `$color-primary-dark`, pero `_dark.scss` no lo invertía, así que el texto del rail se quedaba en `#3a2e5c` sobre rellenos claros translúcidos en oscuro. Se declara en `dark-palette` como `--app-tab-label: var(--app-text)` y `.rail-tab` lo consume.

### Medidas del badge

| Medida | Valor | Origen |
| --- | --- | --- |
| Alto del badge | 21 | `TodayBadge h=21` de `docs/design.json` en 4:440 |
| Ancho mínimo | 63 | `TodayBadge w=63` de `docs/design.json` en 4:440 |
| Tamaño del icono | 16 | decisión de diseño para que quepa junto al texto |
| Tamaño del texto | `--app-font-size-badge` | `fs/badge` = 11 |

El cambio de comportamiento es que `.today-badge` pasa a dimensionarse por su contenido. Antes ocupaba el ancho libre del flex (336 px observados). Se le da `flex: 0 0 auto` para que deje de crecer, y se le fija `padding-inline` para que el texto no toque el borde. `--app-day-actions-height` (26) se mantiene como alto del grupo `.top-actions`, que es lo que reserva el espacio vertical.

## Decisions

### 1. `ion-modal` en lugar de `ion-alert`

**Decisión:** `ion-modal` con `ion-datetime` dentro, con `breakpoints` para que sea una hoja.

**Alternativa 1: `ion-alert` con `contentInputs`.** Descartada. `AlertInput.type` no admite un calendario, y además el resultado sería un par de campos de texto, que es exactamente lo que la instrucción dice que no quiere. Es además la peor opción accesible: dos inputs de fecha sueltos sin calendario visible.

**Alternativa 2: `ion-alert` con `template`.** Descartada por el paquete instalado. La propiedad no existe en `alert.d.ts` de `@ionic/core@8.8.19`, ni en ningún otro overlay de esa versión. Escribir `[template]` en el template daría un error de tipos de Angular en compilación, no un fallo silencioso.

**Alternativa 3: `ion-popover` con `component`.** Tiene `component?: ComponentRef`, pero requiere construir un componente extra para un popup que en móvil debe ser una hoja. Descartada por complejidad sin ganancia en este tamaño de pantalla.

**Por qué modal y no popover:** el proyecto ya usa `ion-modal` como hoja en dos sitios (`tasks.page.html` para el editor, `category-sheet.component.html` para categorías). El filtro de fecha es el mismo patrón: una hoja que sube desde abajo. Reutilizar el patrón conocido reduce la superficie de riesgo.

**Se mantiene el requisito funcional del usuario**: el grupo es un icono de calendario al lado de HOY y ese icono abre el selector de rango. Lo que cambia es el tipo de overlay, y está justificado arriba.

### 2. El calendario va dentro de un componente shared presentacional

El `ion-datetime` va en `DateRangeFilterComponent`, en `src/app/shared/components/date-range-filter/`.

**Por qué un componente nuevo:** el proyecto tiene 7 componentes en `shared` y todos se usan en más de un sitio. Este tiene hoy un uso real y uno previsto, que es lo que `AGENTS.md` exige como mínimo para crear uno nuevo:

| Uso | Estado |
| --- | --- |
| `TasksPage`, filtro de fecha de la pantalla de tareas | real, este change |
| `CategoriesPage`, filtro de fecha junto a los chips de categoría | previsto, siguiente change |

**Por qué presentacional:** no importa `TaskStore` ni `CategoryStore`. Recibe `isOpen`, `today` y `initialRange` por `input`, y emite `rangeChange` y `dismiss` por `output`. Solo `TasksPage` inyecta el store. Cumple la regla de que los componentes shared no importan `store` ni `data`.

**Patrón elegido: presentacional.** No hay piezas opcionales combinables ni proyección que justifique un Compound Component. Es el patrón más simple que sirve.

### 3. El rango vive en `TaskStore`, no en un signal de la página

`setDateRange(range)` pega a `setCategory` y `setSection`: `patchState(store, { dateRange, pageCount: 1 })`. El rango es un filtro de la lista, igual que el estado y la categoría, y los tres viven en el store.

Esto importa por la paginación: `TasksPage` tiene su propia `tabPage` en paralelo al `pageCount` del store, y `chooseCategory()` pone las dos a 1. `setDateRange` pone el `pageCount` del store a 1, y `TasksPage` pone su `tabPage` a 1 en el método que la invoca, igual que hace `chooseCategory`.

### 4. El rango filtra por `dueDate` con comparación de string

`Task.dueDate` es una fecha ISO `YYYY-MM-DD` en formato local, ya validada por `Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)` en el editor. La comparación es de string, que en ISO de ancho fijo equivale a orden cronológico y no tiene desfase de zona horaria. `dueDate >= from && dueDate <= to` es inclusivo en ambos extremos.

Se descarta `Date` a propósito: parsear a `Date` en UTC y volver a formatear es donde aparecen los bugs de un día de desfase.

### 5. `focusToday()` pasa a fijar el rango a hoy

El usuario describe HOY como "filtro por el día actual". Hoy `focusToday()` solo restablece categoría y estados, así que el botón no filtra nada por fecha, que es incoherente con lo que dice.

**Decisión:** `focusToday()` añade `setDateRange({ from: today, to: today })`. El resto de su comportamiento se conserva intacto: `chooseCategory(undefined)`, `setStatuses([...VIEW_STATUSES])`, `panelOpen.set(true)`, `scrollListToTop()`.

**Riesgo:** cambia el comportamiento observable de un método existente. Se mitiga con tests que cubren tanto el rango nuevo como la conservación de los otros tres efectos. El escenario `DATE-FILTER-04.1` lo fija explícitamente.

### 6. El título del día se formatea con `Intl`, con el idioma inyectado

`day-title.ts` pasa de constantes `WEEKDAY` y `MONTH` a `Intl.DateTimeFormat`. El idioma entra como parámetro, no como lectura del servicio de traducción dentro del módulo, para que `day-title.ts` siga siendo una función pura y testeable sin TestBed.

- `formatDayTitle(isoDate, locale)` devuelve `23.lun` en español y `23.Mon` en inglés.
- `formatLongDate(isoDate, locale)` devuelve `23 de febrero` en español y `February 23` en inglés.
- El idioma sale de `TranslateService.currentLang`, con respaldo a inglés.
- Se conserva `parseLocalIsoDate`, que construye la fecha en hora local a propósito: `new Date(2026, 1, 23)` es 23 de febrero local. Parsear `2026-02-23` con `new Date(str)` lo interpretaría como UTC y en zonas negativas retrocedería un día.

**Nota de formato:** el formato de día corto no existe como patrón estándar con punto en `Intl`, así que se compone con `day: 'short'` y se une con el número del día. El resultado en español es `18.dom`, que es lo natural, no `18.Sun`.

### 7. El icono se importa de `ionicons/icons` y se pasa por `[icon]`

`calendarOutline` se importa de `ionicons/icons` y se expone como `readonly icons = { calendarOutline }`, consumido con `[icon]="icons.calendarOutline"`.

El repo no llama `addIcons`, así que un `name="calendar-outline"` a secas produce `[Iionicons Warning]: Could not load icon` en consola. Es lo que ya pasó con `chevron-forward`.

## Riesgos / Trade-offs

**[Riesgo] El `ion-datetime` no cabe en un alert aunque existiera `template`.** → Mitigado por el análisis de arriba: se usa `ion-modal`, que ya se usa en el proyecto para las hojas. El `ion-datetime` recibe `showDefaultTitle={false}` y un alto explícito porque el overlay dimensiona a sus hijos, tal como pedía la instrucción.

**[Riesgo] `focusToday()` cambia de comportamiento.** → Mitigado con los escenarios `DATE-FILTER-04.1` y `DATE-FILTER-04.2`, y con la conservación explícita de los tres efectos anteriores.

**[Riesgo] El rango de hoy oculta las tareas de otros días, que antes se veían.** → Es la consecuencia de lo que pidió el usuario ("filtro por el día actual"). El botón de calendario permite cambiar o limpiar el rango. Se documenta como cambio de comportamiento visible, no como bug.

**[Riesgo] `Intl` devuelve nombres de día distintos de los de Figma.** → Figma muestra `18.Sun` porque es un mock en inglés. `18.Sun` en inglés y `18.dom` en español es el comportamiento correcto; el mock no se altera.

**[Riesgo] Un componente shared nuevo con un solo uso real.** → Cubierto por la tabla de dos usos de la decisión 2, uno de ellos previsto y anotado como tal.

**[Riesgo] Evidencia visual por captura no disponible si no hay servidor.** → Marcado Blocked en `tasks.md` y `verify-report.md`. No se inventan archivos.

## Migration Plan

Sin migración. No hay cambio de esquema, de almacenamiento ni de formato de datos persistidos. El rango vive en memoria; recargar la app lo pierde, y es el comportamiento previsto.

Rollback: revertir la rama.

## Open Questions

- Si el filtro por fecha debe persistirse entre sesiones. Ahora no.
- Si la pantalla de Categories quiere el mismo filtro (uso previsto del componente shared). Queda para el siguiente change.