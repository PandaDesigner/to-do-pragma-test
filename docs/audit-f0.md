# Auditoría F0

Fecha: 2026-10-17. Fuentes: `docs/`, `openspec/`, `docs/prueba-tecnica.pdf`, `docs/design.json`, `docs/mocks/` y el código en `develop`.

## Alineado

- Figma sigue siendo la fuente visual. Los 13 frames y los mocks coinciden en nombre. `design.json` ahora registra los sheets `4:947` y `4:1365`, el diálogo de `4:1404` y el mapa de nombres.
- `mockup-original.png` es una referencia conjunta de Todo y Shopping. No es una pantalla nueva.
- La app ya existe: Ionic 8, Angular 22, Cordova y Jest. `AGENTS.md` sustituye la espera de confirmación entre fases.
- `project-bootstrap` coincide en requisitos con el delta de `init`. Se conserva y su Purpose ya no dice TBD.
- `tasks-crud` quedó archivado y su spec sincronizada, sin duplicar requisitos.
- El inventario de componentes está en `docs/components-inventory.md`. Prioridades: Alta = P1, Media = P2, Baja = P3.

## Corregido en este change

- Reglas de merge, confirmación y sesiones en `docs/workflow-mcp.md`, `docs/PROMPT.md`, `openspec/config.yaml` y `docs/notion-mcp-pi.md`.
- Contexto de OpenSpec: hay código, el PDF está en `docs/prueba-tecnica.pdf` y Angular es 22.
- Purpose de `ui-shell` y `project-bootstrap`.
- Matriz de 15 nodos y `npm run trace:check` en CI.
- `registro` significa nodo registrado sin escenario. Un identificador de escenario sin test hace fallar el control. Un nodo ausente también lo hace fallar.

## Pendiente

- Las pantallas de Figma todavía no están implementadas. Sus escenarios, tests y capturas llegan en F6.
- `init` y `app-base` siguen activos. Sus deltas no coinciden con las specs activas. Aplicarlos duplicaría encabezados y cambiaría contratos ya implementados, como eventos de tarea y `dueDate`. Se archivan con `--skip-specs` para no pisar la spec que describe el código.
- Los textos de la app siguen en español fijo. La migración a español e inglés es F2.
- `var(--color-*)` sigue en los estilos. La migración a `var(--app-*)` es F1.
- El rail todavía no muestra Routine y Event como pestañas visuales deshabilitadas. Eso es F6.
- No hay selector de idioma ni toggle de oscuro en Settings. El modo oscuro actual sigue al sistema. Settings llega en F6 y la decisión D4 se aplica en F1 sobre la spec y el test existentes.
