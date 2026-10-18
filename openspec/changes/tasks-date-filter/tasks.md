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

- [ ] 8.1 `test(tasks.page)`: `.top-actions` expone HOY y el botón de calendario, el icono se pasa por `[icon]` desde `icons`, ningún icono usa `name`, y el botón de calendario abre el selector. Escenarios DATE-FILTER-01.1, 01.2, 01.3
- [ ] 8.2 `test(tasks.page)`: `focusToday()` fija el rango a hoy y conserva categoría, estados y panel. Escenarios DATE-FILTER-04.1, 04.2
- [ ] 8.3 Commit `test(tasks):`

## 9. Grupo de filtro en la pantalla de tareas (GREEN)

- [ ] 9.1 Importar `calendarOutline` de `ionicons/icons` y exponer `readonly icons`
- [ ] 9.2 Botón de calendario al lado del badge, con `aria-label` traducido
- [ ] 9.3 Montar `app-date-range-filter` y conectar su salida con `setDateRange`
- [ ] 9.4 `focusToday()` añade `setDateRange({ from: today, to: today })` sin romper lo demás
- [ ] 9.5 Commit `feat(tasks):`

## 10. Reducción del badge HOY (RED)

- [ ] 10.1 `test(theme)`: el badge se dimensiona por su contenido y no por el ancho disponible del grupo. Escenario TODO-01.4
- [ ] 10.2 Commit `test(theme):`

## 11. Reducción del badge HOY (GREEN)

- [ ] 11.1 `.today-badge` con `flex: 0 0 auto`, alto 21 y ancho mínimo 63, todo con tokens
- [ ] 11.2 `.top-actions` con separación entre el badge y el icono
- [ ] 11.3 Commit `feat(theme):`

## 12. Localización del título del día (RED)

- [ ] 12.1 `test(day-title)`: el nombre del día y del mes salen en español y en inglés, y una fecha inválida se rechaza. Escenario TODO-01.3
- [ ] 12.2 Commit `test(i18n):`

## 13. Localización del título del día (GREEN)

- [ ] 13.1 `formatDayTitle` y `formatLongDate` reciben el idioma y usan `Intl.DateTimeFormat`
- [ ] 13.2 Se conservan `parseLocalIsoDate` en hora local y el respaldo a inglés
- [ ] 13.3 `TasksPage` pasa el idioma activo, leído de `TranslateService`
- [ ] 13.4 Commit `feat(i18n):`

## 14. Contraste del rail en oscuro (RED)

- [ ] 14.1 `test(theme)`: `--app-tab-label` se invierte en la paleta oscura a la tinta de texto y `.rail-tab` lo consume. Escenario UI-25.2
- [ ] 14.2 Commit `test(theme):`

## 15. Contraste del rail en oscuro (GREEN)

- [ ] 15.1 `--app-tab-label` en `dark-palette` apuntando a la tinta de texto
- [ ] 15.2 `.rail-tab` consume `var(--app-tab-label)`
- [ ] 15.3 Commit `fix(theme):`

## 16. Traducciones

- [ ] 16.1 Claves del alert y del botón de calendario en `es.json` y `en.json`
- [ ] 16.2 Commit `feat(i18n):`

## 17. Trazabilidad y verificación

- [ ] 17.1 `openspec/traceability.md` con una fila por escenario: nodo, pantalla, mock, requisito, escenario, tarea, test y evidencia
- [ ] 17.2 `npm run trace:check`
- [ ] 17.3 `npx jest --runInBand --watchman=false`
- [ ] 17.4 `npm run lint`
- [ ] 17.5 `npm run lint:styles`
- [ ] 17.6 `npm run format:check`
- [ ] 17.7 `npm run typecheck`
- [ ] 17.8 `npm run build`
- [ ] 17.9 `npx openspec validate --all --strict`
- [ ] 17.10 Escribir `verify-report.md` con los resultados reales

## 18. Evidencia visual

- [ ] 18.1 Capturas de `tasks-filter` en light y dark, en español e inglés, a 375x812
- [ ] 18.2 **BLOCKED**: las capturas dependen de levantar el servidor y de un navegador. Si no hay servidor, queda Blocked y no se inventan archivos. Reportado en `verify-report.md`

## 19. Notion

- [ ] 19.1 Actualizar Status y Note de la fila del change, solo al terminar

## 20. Entrega

- [ ] 20.1 Push de la rama y PR hacia `develop`
- [ ] 20.2 Cuerpo del PR con sección `Reutilización` y enlace a los nodos de Figma
- [ ] 20.3 El PR queda abierto, sin archivar y sin fusionar