## 1. Fase A, diseño

- [x] 1.1 Leer `AGENTS.md`, `docs/workflow-mcp.md` y el skill `openspec-propose`
- [x] 1.2 Confirmar que el archivado de `fix-ui-fidelity` está mergeado en `origin/develop` (PR #52)
- [x] 1.3 Consultar Figma por MCP (`get_variable_defs` sobre 4:440 y 4:1560) para la fuente visual
- [x] 1.4 Verificar en el paquete instalado si `ion-alert` tiene la propiedad `template` (no la tiene en 8.8.19) y documentarlo
- [x] 1.5 Escribir `proposal.md`, `design.md`, los tres delta specs y este `tasks.md`
- [x] 1.6 `npx openspec validate tasks-date-filter --strict`

## 2. Filtro por fecha en el dominio (RED)

- [x] 2.1 `test(task-strategy)`: `filterTasks` acepta `dateRange`, es inclusivo en ambos extremos, sin rango no filtra, y combina con estados y categoría. Escenarios DATE-FILTER-03.1, 03.3, 03.4
- [x] 2.2 Commit `test(domain):` (d59e756)

## 3. Filtro por fecha en el dominio (GREEN)

- [x] 3.1 `TaskFilter` acepta `dateRange` opcional
- [x] 3.2 `filterTasks` aplica el rango por `dueDate` con comparación de string
- [x] 3.3 Commit `feat(domain):`

## 4. Rango en el store (RED)

- [x] 4.1 `test(store/task)`: `setDateRange` guarda el rango, restablece `pageCount` a 1 y `filteredTasks` respeta el rango. Escenarios DATE-FILTER-03.1, 03.2
- [x] 4.2 Commit `test(store):` (e7ca4ef)

## 5. Rango en el store (GREEN)

- [x] 5.1 Estado `dateRange` en `TaskStoreState`, inicial `null`
- [x] 5.2 `setDateRange(range)` con `patchState` y `pageCount: 1`
- [x] 5.3 `filteredTasks` encadena el rango con los filtros existentes
- [x] 5.4 Commit `feat(store):`

## 6. Componente shared del selector (RED)

- [x] 6.1 `test(date-range-filter)`: el calendario se monta por `template` del overlay y no declara `contentInputs`, declara título desactivado y alto explícito, es rango, e inicializa a hoy. Escenarios DATE-FILTER-02.1, 02.2, 02.3, 02.4
- [x] 6.2 Commit `test(ui):` (a6923d2)

## 7. Componente shared del selector (GREEN)

- [x] 7.1 `DateRangeFilterComponent` presentacional: `isOpen`, `today`, `initialRange` por input; `rangeChange`, `dismiss` por output
- [x] 7.2 `ion-modal` con `ion-datetime` en modo rango, `showDefaultTitle` desactivado y alto explícito
- [x] 7.3 Un rango vacío no emite rango
- [x] 7.4 Estilos solo con `var(--app-*)`
- [x] 7.5 Exportar desde `src/app/shared/index.ts` — **omitido**: el barrel `shared/index.ts` está vacío (`export {}`) en `develop` y ningún componente actual se exporta por ahí. Se importa por ruta, como hacen `TaskItemComponent` y `PageHeaderComponent`. Anotado aquí para no perderlo.
- [x] 7.6 Commit `feat(shared):`

## 8. Grupo de filtro en la pantalla de tareas (RED)

- [x] 8.1 `test(tasks.page)`: `.top-actions` expone HOY y el botón de calendario, el icono se pasa por `[icon]` desde `icons`, ningún icono usa `name`, y el botón de calendario abre el selector. Escenarios DATE-FILTER-01.1, 01.2, 01.3
- [x] 8.2 `test(tasks.page)`: `focusToday()` fija el rango a hoy y conserva categoría, estados y panel. Escenarios DATE-FILTER-04.1, 04.2
- [x] 8.3 Commit `test(tasks):`

## 9. Grupo de filtro en la pantalla de tareas (GREEN)

- [x] 9.1 Importar `calendarOutline` de `ionicons/icons` y exponer `readonly icons`
- [x] 9.2 Botón de calendario al lado del badge, con `aria-label` traducido
- [x] 9.3 Montar `app-date-range-filter` y conectar su salida con `setDateRange`
- [x] 9.4 `focusToday()` añade `setDateRange({ from: today, to: today })` sin romper lo demás
- [x] 9.5 Commit `feat(tasks):`

## 10. Reducción del badge HOY (RED)

- [x] 10.1 `test(theme)`: el badge se dimensiona por su contenido y no por el ancho disponible del grupo. Escenario TODO-01.4
- [x] 10.2 Commit `test(theme):`

## 11. Reducción del badge HOY (GREEN)

- [x] 11.1 `.today-badge` con `flex: 0 0 auto`, alto 21 y ancho mínimo 63, todo con tokens
- [x] 11.2 `.top-actions` con separación entre el badge y el icono
- [x] 11.3 Commit `feat(theme):`

## 12. Localización del título del día (RED)

- [x] 12.1 `test(day-title)`: el nombre del día y del mes salen en español y en inglés, y una fecha inválida se rechaza. Escenario TODO-01.3
- [x] 12.2 Commit `test(i18n):`

## 13. Localización del título del día (GREEN)

- [x] 13.1 `formatDayTitle` y `formatLongDate` reciben el idioma y usan `Intl.DateTimeFormat`
- [x] 13.2 Se conservan `parseLocalIsoDate` en hora local y el respaldo a inglés
- [x] 13.3 `TasksPage` pasa el idioma activo, leído de `TranslateService`
- [x] 13.4 Commit `feat(i18n):`

## 14. Contraste del rail en oscuro (RED)

- [x] 14.1 `test(theme)`: `--app-tab-label` se invierte en la paleta oscura a la tinta de texto y `.rail-tab` lo consume. Escenario UI-25.2
- [x] 14.2 Commit `test(theme):`

## 15. Contraste del rail en oscuro (GREEN)

- [x] 15.1 `--app-tab-label` en `dark-palette` apuntando a la tinta de texto
- [x] 15.2 `.rail-tab` consume `var(--app-tab-label)`
- [x] 15.3 Commit `fix(theme):`

## 16. Traducciones

- [x] 16.1 Claves del alert y del botón de calendario en `es.json` y `en.json`
- [x] 16.2 Commit `feat(i18n):`

## 17. Trazabilidad y verificación

- [x] 17.1 `openspec/traceability.md` con una fila por escenario: nodo, pantalla, mock, requisito, escenario, tarea, test y evidencia
- [x] 17.2 `npm run trace:check`
- [x] 17.3 `npx jest --runInBand --watchman=false`
- [x] 17.4 `npm run lint`
- [x] 17.5 `npm run lint:styles`
- [x] 17.6 `npm run format:check`
- [x] 17.7 `npm run typecheck`
- [x] 17.8 `npm run build`
- [x] 17.9 `npx openspec validate --all --strict`
- [x] 17.10 Escribir `verify-report.md` con los resultados reales

## 18. Evidencia visual

- [ ] 18.1 Capturas de `tasks-filter` en light y dark, en español e inglés, a 375x812
- [x] 18.2 **BLOCKED**: se intentó capturar y no fue posible. `ng serve` muere con `EMFILE` de chokidar en
      el sandbox; servido el build estatico de `www/` con un servidor node propio, responde 200 en
      `127.0.0.1:4292`, pero el navegador del entorno no alcanza el loopback (devuelve `chrome-error`) y tampoco
      acepta `file://` por restricción de seguridad. No se inventan archivos. Detalle en `verify-report.md`, seccion 4

## 19. Notion

- [x] 19.1 Actualizar Status y Note de la fila del change, solo al terminar

## 20. Entrega

- [x] 20.1 Push de la rama y PR hacia `develop`
- [x] 20.2 Cuerpo del PR con sección `Reutilización` y enlace a los nodos de Figma
- [x] 20.3 El PR queda abierto, sin archivar y sin fusionar

## 21. Corrección de acciones inalcanzables

Detectado en revisión visual sobre `localhost:8100`: los tres botones existían en el DOM, con sus
handlers y sus traducciones, pero quedaban 306px por debajo del viewport sin scroll posible. El
filtro no se podía aplicar ni limpiar. Ninguno de los 550 tests previos lo detectó porque
comprobaban presencia en el DOM, no posición respecto al área visible.

- [x] 21.1 `test`: `[DATE-FILTER-02.5]` falla con el breakpoint anterior, exige `>= 0.8`
- [x] 21.2 `test`: `[DATE-FILTER-02.6]` falla con el SCSS anterior, exige `min-height: 0` en el cuerpo y `max-height` en el calendario
- [x] 21.3 Declarar ambos escenarios en el spec delta de `tasks-date-filter`
- [x] 21.4 `fix`: subir el breakpoint del modal a `0.85`
- [x] 21.5 `fix`: añadir `min-height: 0` al cuerpo y `max-height: 330px` al calendario
- [x] 21.6 Verificar en navegador: los tres botones dentro del viewport (`top: 570`, `bottom: 606`, viewport 915)
- [x] 21.7 Suite completa, lint, formato, tipos, `trace:check` y `openspec validate --all --strict` en verde

## 22. Corrección del calendario en modo oscuro

Detectado en revisión visual: en oscuro el calendario se veía como un bloque blanco dentro del
modal y los días se perdían. Causa medida: `ion-datetime` fija `background: rgb(255,255,255)` y
consume el sistema de steps de Ionic (`--ion-color-base`, `--ion-color-step-100/300/500/650`), que el
proyecto solo define para `--ion-text-color`. El resto cae en los fallbacks claros de Ionic.

- [x] 22.1 `test`: `[DATE-FILTER-02.7]` y `[DATE-FILTER-02.8]` en rojo
- [x] 22.2 `test`: `[DATE-FILTER-02.9]` fija los contrastes AA de los días atenuados por paleta
- [x] 22.3 `test`: `[DATE-FILTER-02.10]` y `[DATE-FILTER-02.11]` cubren la aplicación de la paleta
- [x] 22.4 Declarar los cinco escenarios en el spec delta de `tasks-date-filter`
- [x] 22.5 `fix`: mapear los steps de Ionic a los tokens del proyecto en `.date-filter__calendar`
- [x] 22.6 `fix`: token `--app-calendar-adjacent` por paleta, con AA verificado (5.93:1 y 5.22:1)
- [x] 22.7 `fix`: aplicar la paleta por atributo `data-palette`, con `MutationObserver` sobre `<html>`
- [x] 22.8 Verificar en navegador: `data-palette="dark"`, fondo `rgb(30,26,43)`, 91 días legibles
- [x] 22.9 Verificar que el modo claro no se rompió: `data-palette="light"`, fondo blanco
- [x] 22.10 Suite completa (557 tests), lint, stylelint, formato, tipos, `trace:check` y `openspec validate` en verde

## 23. Alineación de la fila de acciones con el calendario

Medido en navegador: la fila de acciones y el calendario ya medían los mismos 382 px, pero los
botones dentro no. Con `justify-content: flex-end` el grupo iba de 59 a 396, con 43 px de aire a la
izquierda y el centro del grupo en 228 frente al 207 del calendario.

- [x] 23.1 `test`: `[DATE-FILTER-02.12]` falla con `flex-end` y exige `space-between`
- [x] 23.2 Declarar el escenario en el spec delta de `tasks-date-filter`
- [x] 23.3 `fix`: `justify-content: space-between` en la fila de acciones
- [x] 23.4 `fix`: neutralizar los 2 px de margen por lado que `ion-button` aplica
- [x] 23.5 Verificar en navegador: CLEAR FILTER en 16 y APPLY en 398, los bordes exactos del calendario
- [x] 23.6 Suite completa (558 tests), lint, stylelint, tipos, `trace:check` y `openspec validate` en verde

## 24. Revisión de los tres puntos de la captura

- **Punto 1, calendario más claro**: ya estaba resuelto en el commit `d5d27d8`. Medido tras recargar:
  `.date-filter__body` y `.date-filter__calendar` comparten `rgb(30, 26, 43)`, y `data-palette="dark"`.
  La captura del usuario correspondía al bundle anterior.
- **Punto 2, coherencia con la sección**: resuelto en el mismo commit, con el paso 23.5 además para los
  bordes horizontales.
- **Punto 3, botones del tamaño del calendario**: resuelto en la sección 23.

Nota sobre el ancho del body: se pidió ajustarlo por asimetría, pero la medición da 414 con 16 px de
padding a cada lado y hijos de 382, que cuadra exacto. No había asimetría que corregir.

## 25. Centrado del calendario

Medido: el `ion-datetime` se auto-limita a `max-width: 350px` y, al ser `display: flex`, se quedaba
pegado a la izquierda. Quedaban 0 px de holgura a la izquierda y 32 a la derecha, con el centro en 191
frente al 207 de la fila, que mide 382.

- [x] 25.1 `test`: `[DATE-FILTER-02.13]` falla sin las reglas de centrado
- [x] 25.2 Declarar el escenario en el spec delta de `tasks-date-filter`
- [x] 25.3 `fix`: `max-width: none` y `width: 100%` con `margin-inline: auto` en el calendario
- [x] 25.4 Verificar en navegador: calendario, fila y acciones los tres en 382 px, centro 207, holgura 0 a cada lado
- [x] 25.5 Suite completa (559 tests), lint, stylelint, tipos, `trace:check` y `openspec validate` en verde

## 26. Anchos iguales en los tres botones

Medido: los botones ocupaban la fila completa pero con anchos desiguales, 136, 97 y 80 px, porque
cada uno tomaba lo que necesitaba su texto.

- [x] 26.1 `test`: `[DATE-FILTER-02.14]` falla sin `flex: 1 1 0` y `gap: 0`
- [x] 26.2 Declarar el escenario en el spec delta de `tasks-date-filter`
- [x] 26.3 `fix`: `flex: 1 1 0` y `min-width: 0` en los botones, `gap: 0` en la fila
- [x] 26.4 `fix`: acortar la etiqueta `todo.dateFilter.clear` a "CLEAR" / "Quitar", porque el texto largo flotaba en un botón de 127 px
- [x] 26.5 Verificar en navegador: los tres en 127 px, contiguos de 16 a 398, sin huecos
- [x] 26.6 Suite completa (560 tests), lint, stylelint, tipos, `trace:check` y `openspec validate` en verde

## 27. Jerarquía visual del título del modal

Medido: el título medía 21 px de alto con 16 px de aire arriba y compartía tamaño con la
pista, así que ambas piezas se leían como una sola línea y no se distinguía el título.

- [x] 27.1 `test`: `[DATE-FILTER-02.15]` falla con el título al tamaño de la pista y sin margen propio
- [x] 27.2 Declarar el escenario `DATE-FILTER-02.15` y el requisito `DATE-FILTER-05` en el spec delta
- [x] 27.3 `fix`: título a `--app-font-size-note-title` y `margin: var(--app-space-24) 0 var(--app-space-4) 0`
- [x] 27.4 Suite completa (564 tests), lint, stylelint, tipos, `trace:check` y prettier en verde

## 28. Tamaño de los botones de acción

Medido: los tres botones ocupaban 127 px cada uno, un tercio exacto del calendario, con
`gap: 0`. La fila se leía como una banda continua pegada al borde y los botones, unidos.

- [x] 28.1 `test`: `[DATE-FILTER-02.16]` falla con el ancho a un tercio y `gap: 0`
- [x] 28.2 Declarar el escenario `DATE-FILTER-02.16` y el requisito `DATE-FILTER-06` en el spec delta
- [x] 28.3 `fix`: `width: 100px` y `flex: 0 0 auto` en los botones, `gap: var(--app-space-8)` y `justify-content: flex-start` en la fila
- [x] 28.4 `test`: `[DATE-FILTER-02.14]` pasa a comprobar la alineación con el ancho del calendario, que es lo que sobrevive del reparto por tercios
- [x] 28.5 Verificar en navegador: los tres en 100 px, huecos de 8 px, sin texto recortado (CANCEL necesita 57 px)
- [x] 28.6 Suite completa (565 tests), lint, stylelint, `trace:check` y `openspec validate` en verde

## 29. Quitar ocupa el doble que los otros dos

Medido: los tres en 100 px iguales. Pedido: que Quitar se lleve el doble de ancho
que Cancelar y Aplicar, que comparten un cuarto.

- [x] 29.1 `test`: `[DATE-FILTER-02.16]` falla sin `flex: 2 1 0` en el botón de Quitar
- [x] 29.2 Reescribir el requisito `DATE-FILTER-06` y el escenario `DATE-FILTER-02.16` para el reparto 2:1:1
- [x] 29.3 `fix`: `flex: 1 1 0` en la fila y `flex: 2 1 0` en Quitar por `data-testid`
- [x] 29.4 Verificar en navegador que ninguna etiqueta se recorta: en inglés 179/97/90 y en español 151/118/97
- [x] 29.5 Evidencia capturada en oscuro y español
- [x] 29.6 Suite completa (565 tests), stylelint, `trace:check` y `openspec validate` en verde

## 30. Tamaño de display del título del modal

Medido: el título estaba a 16 px, del tamaño de una nota. Se probaron 48 px y quedó
demasiado grande: el modal parecía un cartel y la pista y el calendario parecían
texto secundario. El tamaño final es 32 px.

- [x] 30.1 `test`: `[DATE-FILTER-02.17]` falla con el título al tamaño de nota
- [x] 30.2 Declarar el escenario `DATE-FILTER-02.17` y el token `--app-font-size-modal-title`
- [x] 30.3 `fix`: el token pasa a 32 px tras revisar 48 px en el navegador
- [x] 30.4 Verificar en ambos idiomas que la etiqueta no se desborda: "Filtrar por fecha" ocupa 231 px de 382
- [x] 30.5 Evidencia capturada en oscuro, en español y en inglés
- [x] 30.6 Suite completa (566 tests), stylelint, `trace:check` y `openspec validate` en verde
