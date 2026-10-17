# Auditoría de coherencia de diseño: Figma ↔ docs ↔ código ↔ plan

> Las correcciones se aplican con MiniMax trabajando en el harness pi: fase A (diseño) y fase B (implementación). Ver docs/workflow-mcp.md.

Fecha: 16-oct-2026, 18:40 (COT). Archivo Figma F6ztYiRO9b0xYZA38xSTIA. Repo `develop` en `fd4122d` (leído desde el clon del box; el Mac no se modificó).

**Fuentes Figma usadas:**
- `get_metadata` de la página Screens (0:1).
- `get_variable_defs` en 4:440 (claro) y 4:1560 (oscuro).
- Exportación PNG de 11 de las 13 pantallas.

Al llegar a la 12.ª exportación, Figma devolvió el **límite de llamadas MCP del plan Starter**. Por eso no se pudo ejecutar `get_design_context` por pantalla. Para more-settings (4:1496) y todo-dark-mode (4:1560) se usan los mocks del repo. Las dimensiones por componente salen de `get_metadata` y de `design.json`.

## Resumen
| Pareja comparada | Coherencia | Comentario |
|---|---|---|
| Figma ↔ design.json | **97 %** ✅ | Las 13 pantallas, los node ids, los colores claro/oscuro, los radios y la tipografía coinciden. Solo difieren los nombres de algunas variables de fuente y faltan swatch 6 y sheetTop (estimados). |
| Figma ↔ design.md | **97 %** ✅ | Es un reflejo legible de design.json, sin contradicciones. |
| Figma ↔ código (develop) | **≈45 %** ❌ | Los colores base son correctos. Faltan tokens, las fuentes no se cargan, hay medidas distintas, el texto de UI está en español frente al inglés de Figma, el rail tiene 2 pestañas frente a 5 y faltan el panel, el FAB y TODAY. |
| Figma ↔ plan C0.5 | **90 % → 98 %** ✅ | Tras las correcciones aplicadas hoy (ver §5). |

**Puntuación global: 7/10.** La documentación es fiel a Figma; la distancia está en el código, que se cierra con C0.5, C1 y C2.

## 1. Tabla por área
Leyenda: ✅ coincide · ⚠️ difiere poco o falta · ❌ difiere o no existe.

### Color (claro / oscuro)
| Token | Figma | design.md | design.json | código | plan | estado |
|---|---|---|---|---|---|---|
| primary | #4B3F6B / #8B7FC0 | = | = | = | = | ✅ |
| primary-dark | #3A2E5C / #EDEAF5 | = | = | = | = | ✅ |
| on-primary | #FFFFFF | = | = | usa `--color-surface` (en oscuro sería #1E1A2B) | = | ❌ código |
| text | #2E2547 / #EDEAF5 | = | = | = | = | ✅ |
| text-muted | #6B6580 / #6B6580 | = | = | #6B6580 / **#B4AEC5** | #6B6580 (decisión de Pedro 16-oct) | ⚠️ código → C0.5 |
| surface | #FFFFFF / #1E1A2B | = | = | = | = | ✅ |
| surface-muted | #F2F2F4 / #2A2539 | = | = | = | = | ✅ |
| border | #E6E4EC / #332D45 | = | = | = | = | ✅ |
| card-border | #D9D6E2 / #332D45 | = | = | falta | = | ❌ código |
| check-empty | #E4E1EE | = | = | falta | = | ❌ código |
| accent-link | #3AA8E0 | = | = | falta | = | ❌ código |
| danger | #C5000F | = | = | = | = | ✅ |
| scrim | #00000066 | = | = | falta (`--ion-backdrop-color`) | = | ❌ código |
| tab/todo, routine, event, my, more | #B8CFA8 #F28B8B #9FC3CF #E8E1B8 #C9C9C9; oscuro al 85 % (D9) | = | = | claro ✅; **sin alfa en oscuro** | = | ⚠️ código |
| tab/filler | #4B3F6B (D9 en oscuro) | = | = | usa `--color-primary` (en oscuro sería #8B7FC0) | = | ⚠️ código |
| shadow card / fab | #2E254714 / #4B3F6B59 | = | = | falta | = | ❌ código |
| `--color-tab-label` | (primary-dark) | — | — | #3A2E5C (token extra) | alias | ⚠️ |
| primary-tint | (no está en Figma) | — | — | #5D527A (calculado por Ionic) | derivar | ✅ |

### Tipografía
| Estilo | Figma | design.md / design.json | código | estado |
|---|---|---|---|---|
| Familias | Inter 400/600/700; DM Serif Display 400 | = | declaradas, pero **no se cargan** (sin @font-face ni link) | ❌ código |
| Display/Date | 38 / -0.3 / 100 % | = (cssVar `--fs-date` frente a `--fs-display-date` en Figma) | no hay fecha "23.Mon" | ⚠️ docs · ❌ código |
| Display/Title | 36 / 0 | = (`--fs-title`) | h1 36, pero line-height **1.15** en lugar de 100 % | ⚠️ |
| Overline / Panel Title | 15 / 600 | = | overline 15/600 ✅; h2 15 sin peso | ⚠️ |
| Task Title | 17 / 700 | = | `strong` 17, peso por defecto (bold) | ✅ |
| Note Title | 16 / 700 | = | categorías 16 ✅ | ✅ |
| Regular / Meta | 14 / 400 | = (`--fs-regular` frente a `--fs-body` en Figma) | meta **12**, muted **13** | ❌ código |
| Button | 14 / 600 | = | labels **13**/600; botón sin tamaño | ❌ código |
| Tab | 13 / 600 | = | 13/600 ✅ | ✅ |
| Badge | 11 / 600 / 0.4 | = | falta TODAY | ❌ código |

### Espaciado, radios y dimensiones
| Elemento | Figma (metadata y design.json) | código | estado |
|---|---|---|---|
| Rail | 27 de ancho, 5 pestañas, radio 8 | 27 ✅, **2 pestañas** (Todo, My), radio 8 ✅ | ❌ C1/C2 |
| Padding del contenido | x=37, top 55 | padding 32 18 32 37 (top **32**) | ⚠️ C0.5 |
| Header | overline → 3 → title → 15 → regla (311×1 + acento 84×3, radio 1.5) | 20/20 + acento 84×3, radio **2** | ⚠️ C0.5 |
| TaskItem | 311×65, borde inferior 1, checkbox → 13 → texto | 65 ✅, gap **10** | ⚠️ C1 |
| Checkbox Square | 29×29, borde 1.5 **primary-dark**, radio 3 | **26×26**, borde 1.5 **primary**, radio 3 | ❌ C1 |
| Checkbox Circle (panel) | 26, check-empty / primary + check 12 | no existe | ❌ C1 |
| NewTaskInput | 29 + 13 + bloque 252×69, surface-muted, radio 10 | no existe (formulario `.editor` propio) | ❌ C1 |
| FormField / input | alto 50, fill surface-muted, radio 10, padding 16, sin borde | min-height **44**, borde 1, radio **6**, padding 8, fondo surface | ❌ C0.5/C1 |
| Button | alto 50, radio 6, px 16, 14/600 | min-height **44**, radio 6 ✅, px 14 | ⚠️ C0.5 |
| FAB | 68, círculo primary, plus 24, shadow/fab, x292 y730 | no existe | ❌ C1 |
| UncompletedTasksCard | 300 de ancho, radio 10, card-border, shadow/card, 321/62 | no existe | ❌ C1 |
| TodayBadge | 63×21, borde accent-link, radio 2 | no existe | ❌ C1 |
| CategoryChip | alto 33 (seleccionado) / 35, radio round, Body/Regular 14, punto 8 | radio **24**, fuente **12** | ⚠️ C2 |
| CategoryRow | 311×77, swatch **27** radio 4 con emoji 14, iconos 18 con gap 16 | 77 ✅, swatch **32** radio 4, sin emoji | ⚠️ C2 |
| ColorPicker | 6 swatches de 32 con gap 16 | `select` de texto | ❌ C2 |
| BottomSheet | ion-modal [0, 0.6], handle 36×5, padding 24, Display/Title | formulario inline | ❌ C1/C2 |
| Swipe delete | 80 pt + ion-alert "¿Eliminar tarea?" | botón de papelera | ❌ C1 |

### Iconos
| Figma | código | estado |
|---|---|---|
| Estilo Lucide con trazo 1.5: calendar, chevron, clipboard, pencil, trash, plus, check, bug, cart (SVG en exportaciones) | `ion-icon` (ionicons) de 18 | ⚠️ C1: usar ionicons outline equivalentes o los SVG de Figma; documentarlo |

### Texto de la UI
| Figma (inglés) | código (español) | estado |
|---|---|---|
| Todo · Routine · Event · My · More (rail) | "Tu día", "Mis listas" | ❌ |
| July 4th / 23.Mon | "Tu día" | ❌ |
| Uncompleted tasks · Reschedule to Today · TODAY › | — | ❌ |
| My notes / Categories · "3 tasks" | "Categorías" | ❌ |
| New task · Title · Time · Duration · Reminder · Category · None · Add task | "Título", "Fecha", "Categoría", "Sin categoría" | ❌ |
| Edit category · Name · Icon · Color · Save category | "Nombre", "Color", "Tipo" | ❌ |
| No tasks for today · "Tap + or write in the field below…" | "No hay tareas en esta vista" | ❌ |
| Eliminar · ¿Eliminar tarea? · Cancelar · generar 5000 tareas (en español en Figma) | "Cancelar" ✅ | ✅ |

design.json (meta.language) fija que los textos van **en inglés según Figma**, salvo Eliminar, Cancelar y generar 5000 tareas. El código los tiene en español.

### Pantallas, estados y node ids
| Pantalla | Node | design.md/json | Captura | Código |
|---|---|---|---|---|
| todo-day-panel-open | 4:440 | ✅ | figma-screens/4-440… | ❌ sin panel, FAB ni fecha |
| todo-panel-closed | 4:520 | ✅ | ✅ | ⚠️ lista sí; panel no |
| my-notes-shopping | 4:617 | ✅ | ✅ | ❌ NoteItem/Shopping no existen |
| todo-completed-task | 4:664 | ✅ | ✅ | ⚠️ tachado + muted (Figma: checkbox relleno primary) |
| categories-list | 4:788 | ✅ | ✅ | ⚠️ estructura sí; medidas, texto y emoji no |
| categories-form-sheet | 4:869 (sheet 4:947) | ✅ | ✅ | ❌ inline, sin ColorPicker |
| todo-filtered-by-category | 4:973 | ✅ | ✅ | ⚠️ chips con otra medida y texto |
| todo-empty-state | 4:1062 | ✅ | ✅ | ❌ sin ilustración ni CTA |
| todo-categories-flag-off | 4:1113 | ✅ | ✅ | ⚠️ oculta "Mis listas" ✅; filler 258 no existe |
| new-task-modal | 4:1267 (sheet 4:1365) | ✅ | ✅ | ❌ inline |
| todo-swipe-delete-confirm | 4:1404 | ✅ | ✅ | ❌ |
| more-settings | 4:1496 | ✅ | mock del repo (límite MCP) | ❌ pestaña More no existe |
| todo-dark-mode | 4:1560 | ✅ | mock del repo (límite MCP) | ⚠️ colores base sí; text-muted y tabs con alfa no |

La metadata confirma 13 frames de 375×812 más 2 frames de sheet (4:947 y 4:1365) que **no aparecen en design.json**.

## 2. Correcciones exactas para design.json y design.md
1. `textStyles[*].cssVar`: alinear con los nombres de las variables de Figma.
   - `"--fs-date"` → `"--fs-display-date"`.
   - `"--fs-regular"` → `"--fs-body"`.
   - Verificar `--fs-title` y `--fs-note-title` con `get_variable_defs` en 4:788 / 4:1267 cuando se renueve la cuota.
2. `screens`: añadir los sheets.
   - `{"id": "4:947", "name": "categories-form-sheet/sheet", "parent": "4:869"}`
   - `{"id": "4:1365", "name": "new-task-modal/sheet", "parent": "4:1267"}`
3. `components.ColorPicker.anatomy`: añadir "6.º swatch sin token en Figma (pendiente de definir)".
4. `discrepancies`: añadir "text-muted dark #6B6580 sobre #1E1A2B ≈3:1 (no cumple AA); el código usa #B4AEC5. Decisión consciente de Pedro (16-oct): se mantiene #6B6580, fidelidad a Figma por encima de WCAG para este token".
5. design.md §6.5 (categories-list): cambiar "(colores inferidos del PNG)" por "(Shopping=tab/my, Work=tab/event, Home=tab/todo, Health=tab/routine; verificado en export 4:788)".
6. design.md §2: añadir "Fuentes empaquetadas en src/assets/fonts (woff2) con @font-face. Hoy no se cargan."

## 3. Correcciones al plan y a los prompts (ya aplicadas)
Archivos: `theme-change-plan.md` y `theme-prompts-figma.md`.
- **Tipografía:** se añaden los tamaños **16** (note-title) y **36** (title), y el letter-spacing (-0.3 en date, 0.4 en badge). Faltaban.
- **Nuevos tokens:** gaps de layout (3/8/11/13/15/16/24/83), dimensiones (rail 27, top 55, checkbox 29/26, control 50, FAB 68, chip 33/35) y radios sheet 16 y swatch 4.
- **Fuentes:** tarea explícita para empaquetar Inter 400/600/700 y DM Serif Display 400 en `src/assets/fonts` con @font-face (tareas 4.1 y 4.2 y prompts).
- **Colores de categoría:** mapeo de categories-list (Shopping=my, Work=event, Home=todo, Health=routine) y el sexto swatch marcado como pendiente.
- **text-muted en oscuro:** **#6B6580**, exactamente como Figma, por decisión consciente de Pedro (16-oct): fidelidad a Figma por encima de WCAG para este token. Queda registrado en los riesgos de design.md.

## 4. Discrepancias de código por cambio
**C0.5 theme-foundation**
- Tokens que faltan: card-border, check-empty, accent-link, on-primary, scrim, shadows, tab/filler y alfa D9 en oscuro.
- Sustituir text-muted oscuro #B4AEC5 → #6B6580 (decisión consciente de Pedro (16-oct): fidelidad a Figma por encima de WCAG para este token).
- Fuentes sin cargar.
- Escala tipográfica completa: meta 12 → 14, muted 13 → 14, labels 13 → 14, line-height 100 %.
- Padding top 32 → 55; gaps del header 3/15; radio del acento 1.5.
- Controles base: input 50 / radio 10 / surface-muted sin borde; botón 50 / px 16; foco con token.
- Eliminar `#8c8c8c` y los px de `home.page.scss` (página scaffolding; también se puede borrar si no se usa).

**C1 tasks-crud**
- Rail con 5 pestañas y filler.
- Header con overline "July 4th" y fecha "23.Mon".
- TodayBadge, FAB, UncompletedTasksCard abierta/cerrada y Checkbox Square 29 con primary-dark (más Circle 26).
- NewTaskInput y sheet "New task" (ion-modal 0.6).
- Swipe para borrar (80) con ion-alert.
- Empty state con ilustración y CTA.
- Estado completado: relleno primary.
- Textos en inglés según Figma.

**C2 categories**
- CategoryRow con swatch 27 y emoji 14.
- Chips de alto 33/35, radio round, 14 px, punto 8.
- ColorPicker de 6 swatches.
- Sheet "Edit category".
- Pantalla my-notes-shopping (NoteItem).
- Textos "My notes / Categories / N tasks".

**C3:** filler 258 cuando el flag está apagado (4:1113).
**C7:** capturas comparadas con `figma-screens/`.
**Fuera de C0–C2:** more-settings (pestaña More, Dark mode toggle, Debug). Conviene asignarla a C1 (rail) + C4 (Debug 5.000) o crear su propia fila.

## 5. Capturas
- `/workspace/prueba/figma-screens/`: 11 exportaciones de Figma (`4-440…` a `4-1404…`) y 2 mocks del repo (`repo-mock_more-settings.png`, `repo-mock_todo-dark-mode.png`).
- Pendiente: con la cuota renovada (o con un plan de pago), exportar 4:1496 y 4:1560 y ejecutar `get_design_context` en 4:440, 4:788, 4:1267 y 4:1404 para medir el padding interno exacto de los componentes.
