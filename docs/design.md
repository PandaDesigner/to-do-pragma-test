# design.md — Todo Notebook (v3, basado en el Figma APROBADO)

Fuente de verdad: https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA (páginas *Tokens & Components* y *Screens*).
Spec máquina: `design.json` (misma información, con coordenadas y node ids). PNG de referencia: `../mocks/*.png` (13/13).
Todo valor marcado **(estimado)** no se pudo leer de Figma y se infirió del PNG.

## 1. Concepto
Agenda/cuaderno físico. Un **rail de separadores pastel** de 27 pt en el canto izquierdo hace de navegación; la pestaña activa es blanca y se "funde" con la hoja. Hoja blanca sin toolbar, títulos serif grandes (DM Serif Display) frente a contenido en Inter. Un único color de acción (morado `#4B3F6B`). Sombras solo en el panel flotante y en el FAB.

## 2. Tokens de color (variables Figma → CSS)
| Token | Light | Dark | CSS var |
|---|---|---|---|
| color/primary | #4B3F6B | #8B7FC0 | --color-primary |
| color/primary-dark | #3A2E5C | #EDEAF5 | --color-primary-dark |
| color/text | #2E2547 | #EDEAF5 | --color-text |
| color/text-muted | #6B6580 | #6B6580 | --color-text-muted |
| color/surface | #FFFFFF | #1E1A2B | --color-surface |
| color/surface-muted | #F2F2F4 | #2A2539 | --color-surface-muted |
| color/border | #E6E4EC | #332D45 | --color-border |
| color/card-border | #D9D6E2 | #332D45 | --color-card-border |
| color/check-empty | #E4E1EE | #E4E1EE | --color-check-empty |
| color/accent-link | #3AA8E0 | #3AA8E0 | --color-accent-link |
| color/on-primary | #FFFFFF | #FFFFFF | --color-on-primary |
| color/danger | #C5000F | #C5000F | --ion-color-danger |
| color/scrim | #000000 66 (40 %) | igual | --ion-backdrop-color |
| tab/todo | #B8CFA8 | #B8CFA8 al 85 % | --tab-todo |
| tab/routine | #F28B8B | 85 % | --tab-routine |
| tab/event | #9FC3CF | 85 % | --tab-event |
| tab/my | #E8E1B8 | 85 % | --tab-my |
| tab/more | #C9C9C9 | 85 % | --tab-more |
| tab/filler | #4B3F6B | 85 % | --tab-filler |
| shadow/card | #2E2547 14 (8 %) | igual | --shadow-card-color |
| shadow/fab | #4B3F6B 59 (35 %) | igual | --shadow-fab-color |

Nota: en Figma Light y Dark son **dos colecciones** (`Color · Light`, `Color · Dark`) por el límite del plan Starter. En código son un solo set de variables con `.ion-palette-dark`.

**Dimensiones:** radios badge 2, checkbox 3, button 6, tab 8, card 10, input 10, round 50 %; accent underline 1,5; sheet superior 16 (estimado). Espaciado 4/8/12/16/24/32. Strokes: checkbox 1,5; divider 1; iconos 1,5 tipo Lucide (estimado).
**Sombras:** card `0 4px 16px var(--shadow-card-color)`; FAB `drop-shadow(0 8px 10px var(--shadow-fab-color))`.

## 3. Tipografía (11 text styles, line-height 100 %)
| Style | Familia | Peso | Tamaño | Tracking | Uso |
|---|---|---|---|---|---|
| Display/Date | DM Serif Display | 400 | 38 | -0.3 | "23.Mon" |
| Display/Title | DM Serif Display | 400 | 36 | 0 | Títulos de página y sheet |
| Body/Overline | Inter | 600 | 15 | 0 | "July 4th", "My notes", "Settings" |
| Body/Panel Title | Inter | 600 | 15 | 0 | Panel, diálogo, Debug |
| Body/Task Title | Inter | 700 | 17 | 0 | Título TaskItem |
| Body/Note Title | Inter | 700 | 16 | 0 | NoteItem, CategoryRow, SettingRow |
| Body/Regular | Inter | 400 | 14 | 0 | Texto general |
| Body/Meta | Inter | 400 | 14 | 0 | "12:24,  30 mins, 1 hour" |
| Body/Button | Inter | 600 | 14 | 0 | Botones, labels de campo |
| Body/Tab | Inter | 600 | 13 | 0 | Rail (rotado -90°) |
| Body/Badge | Inter | 600 | 11 | 0.4 | "TODAY ›" |
DM Serif Display solo existe en Regular: no simular negrita. Empaquetar fuentes en `assets/fonts` (Cordova offline).

## 4. Grid y alineaciones
- Lienzo 375×812. Raíz: `flex row` → rail 27 + Content (flex 1, padding-top 55, padding-left 37).
- **Columna de contenido x = 64**, ancho 311 (llega al borde derecho 375). Top actions con padding-right 18.
- Encabezado del día: Top actions (y 55, alto 26) → gap 8 → Overline (y 89) → gap 3 → Display/Date (y 110, 52 alto) → gap 15 → Header rule (y 177).
- Encabezado de página (My/Categories/More): Page header y 82 (61 alto) → gap 11 → Header rule y 154.
- Header rule: divider 311×1 color/border + accent underline 84×3 (83 en páginas) color/primary radio 1,5, alineado a la izquierda.
- Lista: gap 16 bajo la regla (83 cuando hay panel colapsado), filas de 65 (TaskItem) o 77 (Note/Category/Setting), gap 24 hasta NewTaskInput.
- Panel flotante: x 62, y 187, ancho 300. FAB: x 292, y 730, 68×68. Sheet: y 325, alto 487 (breakpoint 0,6).

## 5. Componentes (variantes y estados)
- **SideTabRail** (composite) — `active`: Todo/Routine/Event/My/More; `categories`: On/Off. Alturas: Todo 185, Routine 126, Event 132, My 127, Filler 131 (sin texto, morado), More 111. Texto Body/Tab color/primary-dark rotado -90°, padding-top 24. Radio solo a la derecha (0 8 8 0). Activa: fill surface sin radio. Off: sin My y Filler 258.
- **TodayBadge** — 63×21, borde 1 accent-link, radio 2, Body/Badge.
- **Checkbox** — Square 29 (borde 1,5 primary-dark, radio 3; checked con relleno primary + check, estimado) / Circle 26 (off check-empty; on primary + check 12 blanco).
- **TaskItem** — Default/Completed × meta On/Off. 311×65, borde inferior, pt 4; check + gap 13 + columna (título, meta con reloj 15 + gap 6). Completed: título tachado.
- **NoteItem** — dot sí/no; 311×77, checkbox + título Body/Note Title + punto a la derecha (estimado 5 px).
- **NewTaskInput** — checkbox + bloque 252×69 surface-muted radio 10, sin placeholder.
- **UncompletedTasksCard** (composite) — expanded true (321) / false (62). Header 60 px 25 con chevron 14; lista pl 31 pr 34, ítems de 56; footer con border-top, padding 19/32/21/29, botón "Reschedule to Today". Borde card-border, radio 10, shadow/card.
- **Button** — Primary / Secondary (outline primary-dark) / Danger (rojo). Alto 50, radio 6, Body/Button.
- **FAB** — círculo 68 primary, plus 24 blanco.
- **CategoryChip** — selected (fill primary, texto blanco, 33 alto) / unselected (borde border, 35 alto); dot 8 del color de la categoría (estimado); radio round; gap 8; fila con scroll horizontal.
- **CategoryRow** — swatch 27 (radio 4 estimado) con emoji, nombre + "N tasks" text-muted, lápiz y papelera 18 (gap 16).
- **SettingRow** — trailing toggle / chevron / value. Toggle 51×31 (estilo iOS).
- **FormField**, **ColorPicker** (6 círculos de 32, gap 16, seleccionado con borde + check), **EmptyState**, **BottomSheet**, **ConfirmDialog** (300×190, padding 24).

Estados interactivos (no dibujados en Figma, estimados): pressed = opacidad 0,85; focus = outline 2 px color/primary; disabled = opacidad 0,4.

## 6. Pantallas (13)
1. **todo-day-panel-open (4:440)** — Rail activo Todo. Top actions: TODAY › + calendario. "July 4th" / "23.Mon". Panel abierto (x62 y187 300×321) con 3 tareas atrasadas: Clean my flat (círculo vacío), Finish reports y Buy groceries (marcadas), y "Reschedule to Today". Debajo asoma "Clean my flat" con meta (y 528) y NewTaskInput (y 617). FAB.
2. **todo-panel-closed (4:520)** — Panel colapsado (62). Lista desde y 263: Clean my flat (con meta), Finish reports, Buy groceries; NewTaskInput y 482.
3. **my-notes-shopping (4:617)** — Rail activo My. "My notes" + 🛒 + "Shopping" (título desplazado 35) + lápiz. NoteItems: Nitendo switch •, Cat tower •, Winter shoes for mom. NewTaskInput y 410.
4. **todo-completed-task (4:664)** — Sin panel; lista desde y 196; Clean my flat en Completed.
5. **categories-list (4:788)** — "My notes" / "Categories". Filas: Shopping 3 tasks (crema), Work 5 tasks (azul), Home 2 tasks (verde), Health 1 task (coral) (colores inferidos del PNG).
6. **categories-form-sheet (4:869)** — Lista de categorías bajo scrim 40 %; sheet "Edit category": Name "Shopping", Icon 🛒, Color con tab/my seleccionado, botón "Save category".
7. **todo-filtered-by-category (4:973)** — Chips All, Shopping (activo), Work, Home (cortado). Tareas: Buy groceries, Nitendo switch, Winter shoes for mom.
8. **todo-empty-state (4:1062)** — "24.Tue"; ilustración 68 con clipboard, "No tasks for today", "Tap + or write in the field below to add your first task.", CTA 239×50.
9. **todo-categories-flag-off (4:1113)** — `enable_categories=false`: sin pestaña My (Filler 258), sin chips; resto igual a la 2.
10. **new-task-modal (4:1267)** — Sheet "New task": Title "Clean my flat"; Time 12:24 · Duration 30 mins · Reminder 1 hour (3×101, gap 12); Category chips Shopping (sel.), Work, Home, None; "Add task".
11. **todo-swipe-delete-confirm (4:1404)** — Finish reports desplazada -80 con opción roja "Eliminar" (papelera + texto blanco); scrim + diálogo "¿Eliminar tarea?" / "“Finish reports” se eliminará de forma permanente." con Cancelar (secundario) y Eliminar (danger).
12. **more-settings (4:1496)** — Rail activo More. "Settings" / "More". Dark mode (toggle off), Categories (chevron), enable_categories "true" (solo lectura). Debug: bicho + "Debug", texto "Crea 5.000 tareas de prueba para medir el rendimiento (virtual scroll).", botón outline "generar 5000 tareas".
13. **todo-dark-mode (4:1560)** — Igual que la 1 con tokens dark: fondo #1E1A2B, texto #EDEAF5, primario #8B7FC0, pestañas al 85 %.

## 7. Interacciones
FAB o NewTaskInput → sheet New task · check → completar/reabrir · swipe 80 pt → Eliminar + ion-alert · header del panel → expandir/colapsar · Reschedule → overdue a hoy · chip → filtro · pestaña → navegación · lápiz/papelera → editar/eliminar categoría (las tareas pasan a "Sin categoría") · toggle → modo oscuro persistido · "generar 5000 tareas" → seed + virtual scroll · TODAY › → hoy. Animación del panel: 200 ms ease-out (estimado).

## 8. Accesibilidad
Áreas táctiles ≥ 44 pt (checkbox 29 con padding invisible), `aria-label` en FAB, iconos y checkboxes, rail como `role="tablist"` con `aria-selected`, contraste AA (primary-dark sobre pastel cumple; verificar text-muted en dark), soporte de Dynamic Type sin cortar títulos, foco visible, `prefers-reduced-motion`.

## 9. Mapeo a Ionic
| Figma | Ionic/Angular |
|---|---|
| Pantalla | `ion-content` sin `ion-header`; layout flex rail + contenido |
| SideTabRail | componente propio + `ion-tabs` sin `ion-tab-bar` visible (o router outlet) |
| TaskItem + swipe | `ion-item-sliding` > `ion-item` + `ion-item-options side="end"` (opción 80) |
| Checkbox | `ion-checkbox` con estilos custom (o componente propio) |
| UncompletedTasksCard | `ion-card` / componente propio con `@if (expanded())` |
| BottomSheet | `ion-modal [breakpoints]="[0,0.6]" [initialBreakpoint]="0.6"` |
| ConfirmDialog | `AlertController` (botones Cancelar / Eliminar role destructive) |
| CategoryChip | `ion-chip` en contenedor con `overflow-x:auto` |
| Toggle | `ion-toggle` |
| FAB | `ion-fab vertical="bottom" horizontal="end"` + `ion-fab-button` |
| Lista grande | `cdk-virtual-scroll-viewport itemSize="65"` |
| Dark | clase `.ion-palette-dark` en `<html>` |
