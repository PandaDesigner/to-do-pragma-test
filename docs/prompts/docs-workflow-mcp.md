Eres MiniMax trabajando en el harness pi, en una sesión de documentación del proyecto Todo Notebook (Ionic 8 + Angular 22 + @ngrx/signals + Cordova; tests con Jest). Proyecto: "/Volumes/Disco Mac/Develop/ionic/pragma/to-do-pragma-test". Persistencia OpenSpec: artifact_store = openspec (nunca Engram). Este es un PR SOLO de documentación y configuración: no toques src/ ni tests.

Objetivo: documentar el uso obligatorio del MCP de Figma (fuente de diseño) y del MCP de Notion (progreso) en los cambios que tocan UI.

1. Parte de develop actualizado (git switch develop && git pull) y crea la rama docs/workflow-mcp. No mezcles cambios de otras ramas locales (fix/native-signing, openspec-cleanup).
2. Crea docs/workflow-mcp.md con el contenido que te pego abajo (archivo 1), tal cual. Si falta algún dato, déjalo como <FIGMA_FILE_URL> u otro marcador explícito; no lo inventes.
3. En openspec/config.yaml añade al final de rules.proposal, rules.specs, rules.design y rules.tasks las líneas del archivo 2, sin borrar ni reescribir las reglas existentes. Mantén YAML válido.
4. En docs/PROMPT.md añade una línea en "FUENTES DE VERDAD": "Flujo MCP (Figma/Notion) obligatorio para cambios UI: docs/workflow-mcp.md".
5. Si existe AGENTS.md en la raíz, añade una sección "MCP" de 3 líneas que remita a docs/workflow-mcp.md. Si no existe, no lo crees en este PR.
6. Verifica y pega la salida de: `openspec validate --all --strict`, `npm run format:check` y `npm run lint`. Aunque no se toque código, la CI debe seguir en verde.
7. Haz un único commit "docs(workflow): Figma y Notion MCP obligatorios en cambios UI" y abre un PR BORRADOR docs/workflow-mcp → develop. En la descripción incluye: los archivos cambiados, que es un cambio solo de documentación, la salida de validate --strict y el enlace a docs/workflow-mcp.md.
8. Notion: no actualices filas de cambios C0..C7 por este PR. Si tienes el MCP notion, añade solo una línea al Note de la fila C0 (3fbcb44197738101a10cea41102607dd): "[MiniMax/pi <fecha hora COT>] PR docs workflow-mcp <url>".
9. NO archives, NO fusiones, NO hagas force-push, NO marques el PR como listo.

Responde con: rama, hash del commit, enlace del PR borrador, salida resumida de los tres comandos y cualquier marcador que haya quedado sin resolver.

--- archivo 1: docs/workflow-mcp.md ---
(pegar /workspace/prueba/docs-mcp/docs/workflow-mcp.md)
--- archivo 2: reglas para openspec/config.yaml ---
(pegar el bloque YAML de /workspace/prueba/docs-mcp/config-yaml-rules.md)
