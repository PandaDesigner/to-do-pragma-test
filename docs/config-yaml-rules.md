# Texto para añadir a openspec/config.yaml

Hay que añadir estas líneas **al final de cada lista existente** bajo `rules:` (proposal, specs, design y tasks), sin tocar las reglas actuales. Después se ejecuta `openspec validate --all --strict`.

```yaml
rules:
  proposal:
    # …reglas existentes…
    - Si el cambio toca UI (pages/, shared/components/, layout/, src/theme/), declararlo en Impact y citar las pantallas de Figma afectadas (node ids de docs/design.json); seguir docs/workflow-mcp.md.
    - Indicar la fila Notion del cambio (C0..C7) según docs/workflow-mcp.md §2.
  specs:
    # …reglas existentes…
    - Los escenarios UI deben referenciar la pantalla/nodo Figma que verifican (p. ej. "conforme a Figma 4:788").
  design:
    # …reglas existentes…
    - En cambios UI, la sesión de diseño (MiniMax en pi) MUST consultar el MCP figma (get_variable_defs, get_design_context, get_screenshot) del archivo F6ztYiRO9b0xYZA38xSTIA antes de escribir design.md.
    - design.md de cambios UI MUST incluir "## Fuente Figma" (nodos con enlace node-id y escenarios) y "## Mapeo Figma → src/theme" (variable, light, dark, token SCSS, CSS var); ningún valor visual fuera de tokens.
    - Si Figma y docs/design.json discrepan, prevalece Figma y se actualiza design.json en el mismo cambio.
  tasks:
    # …reglas existentes…
    - Cambios UI MUST incluir una tarea de verificación visual: capturas 375x812 light y dark por pantalla en openspec/changes/<cambio>/evidence/, comparadas con get_screenshot del nodo Figma y enlazadas en verify-report.md y en el PR.
    - Todo cambio MUST incluir pasos Notion (MCP notion, fila del cambio en docs/workflow-mcp.md): In progress al iniciar, nota con PR al abrir borrador, Done con PR listo o Blocked con motivo; nunca borrar/archivar filas.
```
