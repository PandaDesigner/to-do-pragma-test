## Context

La página de tareas usa `ion-tab-bar` y un formulario incrustado. Figma, leído con `get_design_context` y `get_variable_defs` en 4:440, 4:520, 4:664, 4:973 y 4:1062, muestra un rail lateral, la fecha del día, un panel de pendientes y la lista. Pedro fijó que esa fidelidad va primero. El change `i18n` ya está archivado.

## Goals / Non-Goals

**Goals:**

- La pantalla de tareas coincide en medidas con esos cinco nodos.
- Routine y Event se ven y no navegan.
- El editor incrustado desaparece. El input rápido crea una tarea de hoy. El botón flotante abre un `ion-modal`.
- La depuración de 5.000 tareas pasa a Ajustes.
- Se extraen `page-header`, `empty-state` y `chip`. `TaskItem` se ajusta, no se copia.

**Non-Goals:**

- El sheet 4:1267/4:1365, el swipe, las notas, el CRUD de categorías y el marco con el flag apagado.
- Rehacer el andamiaje que esta pantalla no toca.
- Igualar al píxel el texto español contra un marco en inglés.

## Fuente Figma

| Nodo | Pantalla | Escenarios | Notas |
| --- | --- | --- | --- |
| [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440) | todo-day-panel-open | TODO-01.1, TODO-01.2, TODO-02.1 | Rail, fecha, panel abierto |
| [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520) | todo-panel-closed | TODO-02.2 | Panel de 62 px y lista |
| [4:664](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-664) | todo-completed-task | TODO-03.1 | Tachado y checkbox marcado |
| [4:973](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-973) | todo-filtered-by-category | TODO-04.1 | Chips y filtro |
| [4:1062](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1062) | todo-empty-state | TODO-05.1 | Ilustración y llamada |
| [4:1496](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1496) | more-settings | SET-02.1 | Solo la sección Debug se mueve aquí |

## Mapeo Figma → src/theme

No hay variables nuevas. Se usan los tokens ya expuestos:

| Variable Figma | Light | Dark | Token |
| --- | --- | --- | --- |
| color/primary | #4B3F6B | #8B7FC0 | `--app-primary` |
| color/primary-dark | #3A2E5C | #EDEAF5 | `--app-primary-dark` |
| color/surface | #FFFFFF | #1E1A2B | `--app-surface` |
| color/surface-muted | #F2F2F4 | #2A2539 | `--app-surface-muted` |
| color/border | #E6E4EC | #332D45 | `--app-border` |
| color/card-border | #D9D6E2 | #332D45 | `--app-card-border` |
| color/text | #2E2547 | #EDEAF5 | `--app-text` |
| color/accent-link | #3AA8E0 | #3AA8E0 | `--app-accent-link` |
| color/check-empty | #E4E1EE | #E4E1EE | `--app-check-empty` |
| tab/todo..more | #B8CFA8, #F28B8B, #9FC3CF, #E8E1B8, #C9C9C9 | alfa D9 | `--app-category-1..5` |
| tab/filler | #4B3F6B | #4B3F6BD9 | `--app-category-filler` |
| radius/tab, badge, checkbox, button, card, input | 8, 2, 3, 6, 10, 10 | igual | `--app-radius-*` |
| space 4, 8, 12, 16, 24 | igual | igual | `--app-space-*` |
| fs badge, tab, meta, button, overline, task-title, display-date | 11, 13, 14, 14, 15, 17, 38 | igual | `--app-font-size-*` |
| shadow/card, shadow/fab | #2E254714, #4B3F6B59 | igual | `--app-shadow-card`, `--app-shadow-fab` |

## Medidas de get_design_context

Lienzo 375x812. Rail de 27 px. Alturas: Todo 185, Routine 126, Event 132, My 127, relleno 131, More 111. Radio solo a la derecha, 8. Texto de 13 px, semibold, rotado -90, padding superior 24. La pestaña activa usa surface y no tiene radio.

Contenido con padding superior 55 e izquierdo 37. Columna de 311. Huecos 8, 3 y 15 hasta la regla. La regla tiene el acento de 84 px. Badge 63x21, borde accent-link, radio 2, texto 11 con tracking 0,4.

Fila de tarea 311x65, hueco 13, padding superior 4. Checkbox cuadrado 29, borde 1,5, radio 3. El circular del panel mide 26. El check interior mide 12. Meta: icono 15, hueco 6, alto 18.

Input rápido: checkbox 29 y bloque 252x69, radio 10, hueco 13. Botón 239x50, radio 6. FAB 68, en x 292 y 730.

Panel: left 62, top 187, ancho 300, radio 10, borde card-border, sombra 0 4px 16. El abierto no fija alto: la cabecera mide 60, con padding horizontal 25 y chevron de 14. El cerrado mide 62 de alto y deja un hueco de 83 hasta la lista.

Estado vacío: ilustración 68 y el botón de 239x50. Chips: punto de 8 y hueco 8; el alto lo da el nodo `Category filter chips`, no un número aproximado.

## Decisions

1. El rail vive en el shell y solo recibe pestañas, la activa y si My se muestra. No navega ni lee el store. Routine y Event van deshabilitadas. My sigue oculta si el flag está apagado; el marco 4:1113 no entra aquí.
2. `page-header` se extrae porque Ajustes y Categorías ya repiten la cabecera, y este change toca Ajustes. La fecha del día usa ese mismo componente con el tamaño display-date. No se crea otra cabecera. TodayBadge se queda en la página de tareas: solo tiene un uso.
3. `empty-state` y `chip` son presentacionales. El vacío también sustituye el de Categorías, que es el segundo uso real. El chip filtra en esta pantalla y el sheet siguiente es el segundo uso previsto.
4. `TaskItem` se extiende. No se añade un sexto input: el tachado sale del estado de la tarea y la meta se proyecta.
5. `NewTaskInput` emite el título. La página crea la tarea de hoy. Un título vacío no se envía. El FAB abre `ion-modal` con los campos que hoy están incrustados, para no perder fecha ni categoría. El aspecto de 4:1267 no se promete aquí.
6. La fecha sale de un reloj inyectado. El título visible es `23.Mon` cuando el día es lunes 23. El overline usa esa misma fecha en forma larga. El marco mezcla "July 4th" y "23.Mon"; no se hardcodea esa mezcla.
7. Los iconos se exportan de los nodos de Figma a `src/assets/icon`. No se sustituyen por ionicons.
8. Las etiquetas del rail se quedan como en Figma. El resto de textos nuevos entra en `es.json` y `en.json`. La tolerancia de 2 px se mide en inglés contra el mock. El español se captura para demostrar la traducción, no para igualar un marco inglés.
9. Los componentes nuevos se generan con el CLI de Ionic. No se añaden dependencias.

## Risks / Trade-offs

- [El marco de fecha no es una sola fecha] → El reloj manda. El diff visual lo deja anotado; no se falsea el texto.
- [El español no puede caer dentro de 2 px del mock inglés] → La barra de 2 px vale para las capturas en inglés. El informe separa el diff de español.
- [Mover la depuración cambia APP-11] → El botón sigue generando 5.000 pendientes; solo cambia de página. La virtualización de la lista no se toca.
- [El modal provisional no es el sheet de Figma] → Se abre y guarda. El change siguiente lo maqueta. No se deja el editor en la página.

## Migration Plan

No hay migración de datos. Si el rail falla, se vuelve al `ion-tab-bar` de develop. La depuración no se borra: se mueve.

## Open Questions

Ninguna que cambie el resultado. El panel abierto abraza su contenido; no se le inventa un alto fijo.
