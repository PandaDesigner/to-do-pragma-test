# Conectar el MCP de Notion a pi (Mac de Pedro)

Fecha: 16-oct-2026, 17:50 (COT). Revisé el Mac de Pedro en modo solo lectura y no modifiqué nada.

## 1. Lo que pi soporta (verificado)

- **pi 1.3.0 tiene MCP integrado**. Existe desde la versión 0.99 y funciona por stdio o streamable HTTP, con OAuth y con los comandos `pi mcp add|list|login|logout|remove` y `/mcp` (docs: https://pi.dev/docs/latest/mcp). **No hace falta instalar ninguna extensión.**
- pi lee los servidores del usuario desde `~/.pi/agent/mcp.json` (en el Mac **no existe todavía**) y los del proyecto desde `.pi/mcp.json`. El proyecto ya tiene `firebase` (stdio) y `figma` (HTTP con OAuth). Además ya existe `~/.pi/agent/mcp-auth.json`, que es donde pi guarda los tokens OAuth, así que el flujo OAuth ya se usó con Figma.
- `pi-mcp-adapter` (npm, nicobailon) es opcional: **reemplaza** al MCP integrado y lo desactiva. No lo recomiendo; con el integrado basta.
- Por defecto, las herramientas MCP quedan en exposición `codemode`. MiniMax-M3 tiene que llamarlas desde scripts de codemode. Para que MiniMax las llame directamente desde pi, conviene usar `toolExposure` con `direct` solo en las herramientas que se usan (ver más abajo).

## 2. Opción A, recomendada: MCP remoto oficial de Notion (OAuth)

No hay que guardar ningún token en archivos: pi se registra con OAuth (DCR) y guarda el token en `~/.pi/agent/mcp-auth.json`.

**Comandos (en el Mac):**

```bash
pi mcp add notion --url https://mcp.notion.com/mcp
pi mcp login notion        # abre el navegador → elegir el workspace y aprobar el acceso
pi mcp list                # notion debe aparecer conectado y con herramientas
```

Va en el archivo **de usuario** (`~/.pi/agent/mcp.json`), no en el del proyecto, porque es una cuenta personal. El resultado esperado, ya con la exposición ajustada a mano:

```json
{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.com/mcp",
      "description": "Tablero Notion de Pedro: Tasks y Projects del proyecto Pragma To-Do Test",
      "exposure": "codemode",
      "toolExposure": {
        "notion-fetch": "direct",
        "notion-search": "direct",
        "notion-query-data-sources": "direct",
        "notion-update-page": "direct",
        "notion-create-pages": "direct",
        "notion-delete*": "hidden",
        "notion-move-pages": "hidden",
        "notion-duplicate-page": "hidden"
      }
    }
  }
}
```

(Los nombres exactos de las herramientas se confirman con `pi mcp list`. Si cambian, hay que ajustar las claves de `toolExposure`.)

Si el login rechaza el nombre de cliente `pi`, se puede repetir con `"oauth": { "clientName": "Claude Code" }`, igual que ya está hecho con Figma: primero `pi mcp logout notion` y después `pi mcp login notion`.

**Permisos:** con OAuth, MiniMax (desde pi) ve todas las páginas a las que tiene acceso tu usuario. El Workbench, la base Tasks y Projects ya son tuyos, así que no hay que compartir nada más.

## 3. Opción B: servidor local `@notionhq/notion-mcp-server` (token de integración)

Sirve si se quiere limitar el acceso **solo** al tablero.

1. En https://www.notion.so/profile/integrations → **New integration** (tipo Internal, workspace de Pedro), con permisos Read, Update e Insert content y **sin** Delete. Copiar el token `ntn_…`.
2. En Notion, abrir la página **Workbench** → `•••` → **Connections** → **Add connection** → elegir la integración. Así se heredan la base Tasks, Projects y la página del proyecto. Como mínimo hay que compartir la base Tasks y la página del proyecto.
3. Guardar el token fuera del repo, por ejemplo en `~/.zshenv`: `export NOTION_TOKEN=ntn_xxx`. Otra opción es el llavero de macOS: `security add-generic-password -a "$USER" -s notion-mcp -w ntn_xxx`.
4. Agregar el servidor:

```bash
pi mcp add notion-local --env NOTION_TOKEN='${NOTION_TOKEN}' -- npx -y @notionhq/notion-mcp-server
pi mcp list
```

El JSON equivalente en `~/.pi/agent/mcp.json`:

```json
{
  "mcpServers": {
    "notion-local": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": { "NOTION_TOKEN": "${NOTION_TOKEN}" },
      "description": "Notion (solo páginas compartidas con la integración): tablero Pragma To-Do Test",
      "exposure": "direct"
    }
  }
}
```

Con el llavero: `"NOTION_TOKEN": "!security find-generic-password -s notion-mcp -w"`. Las herramientas son las de la API pública (`API-query-data-source`, `API-patch-page`, etc.), con otros nombres que en la opción A.

**No** hay que poner el token en `.pi/mcp.json` del proyecto. Aunque está en `.gitignore`, es un archivo del proyecto.

## 4. Cómo probarlo

1. `pi mcp list` → `notion  connected  N tools`. Si falla, `/mcp` muestra el error y el log está en `~/.pi/agent/mcp.log`.
2. Dentro de pi, abrir una sesión en el proyecto, ejecutar `/reload` y pedir esta prueba de solo lectura:
   «Usa Notion para leer la base Tasks a831b37ad5994d3f82bf40bdc5178af5 y lista las filas de Phase "OpenSpec changes" ordenadas por Orden, sin modificar nada.»
   Deben aparecer C0, C0.5, C1, C2, C5, C3, C4, C6 y C7.
3. Prueba de escritura controlada: «Añade al final del Note de la fila C0 el texto " [MiniMax/pi] prueba MCP"». Comprobarlo en Notion y luego borrar ese texto a mano.

## 5. IDs del tablero

| Elemento                   | ID / URL                                                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Base Tasks                 | `a831b37ad5994d3f82bf40bdc5178af5` · https://app.notion.com/p/a831b37ad5994d3f82bf40bdc5178af5                                    |
| Data source Tasks          | `collection://b03a6d0b-4161-4619-85ce-5472c5baf748`                                                                               |
| Proyecto Pragma To-Do Test | `3fbcb441977381289ce4e197cc5e274b`                                                                                                |
| Propiedades                | Task name, Status (Not started / In progress / Blocked / Done / Archived), Phase, Prioridad, Bot, Note, Orden, Project (relación) |

Filas por cambio:

| Cambio                     | Página                           |
| -------------------------- | -------------------------------- |
| C0 restructure-specs       | 3fbcb44197738101a10cea41102607dd |
| C0.5 theme-foundation      | 3fbcb4419773815db397fe4678dec2f0 |
| C1 tasks-crud              | 3fbcb441977381efa398f06405c4fa40 |
| C2 categories              | 3fbcb441977381f1b398ff3fe1b668a6 |
| C3 feature-flag-categories | 3fbcb44197738190817ee816ac16b092 |
| C4 performance             | 3fbcb4419773812b9151cb4d7b63d299 |
| C5 quality-ci              | 3fbcb441977381188eacc35a2fee6a2e |
| C6 native-builds           | 3fbcb44197738114ae6bdc9eeb915073 |
| C7 docs-delivery           | 3fbcb4419773817e8a53d35d4e0facd2 |

## 6. Bloque sugerido para AGENTS.md

(MiniMax es el agente que lee este AGENTS.md dentro del harness pi.)

```md
## Notion (tablero Pragma To-Do Test)

Servidor MCP: `notion`. Base Tasks a831b37ad5994d3f82bf40bdc5178af5; proyecto 3fbcb441977381289ce4e197cc5e274b.
Una fila por cambio OpenSpec (actualiza SOLO la fila del cambio en el que trabajas):
C0 3fbcb44197738101a10cea41102607dd · C0.5 3fbcb4419773815db397fe4678dec2f0 · C1 3fbcb441977381efa398f06405c4fa40 ·
C2 3fbcb441977381f1b398ff3fe1b668a6 · C3 3fbcb44197738190817ee816ac16b092 · C4 3fbcb4419773812b9151cb4d7b63d299 ·
C5 3fbcb441977381188eacc35a2fee6a2e · C6 3fbcb44197738114ae6bdc9eeb915073 · C7 3fbcb4419773817e8a53d35d4e0facd2

Cuándo actualizar:

- Al empezar una sesión (diseño = fase A; implementación = fase B, primera tarea RED): Status = In progress; añade al Note "[MiniMax/pi YYYY-MM-DD HH:MM COT] inicio <fase A|B> <rama>".
- Al abrir el PR borrador: añade "[MiniMax/pi …] PR <url> · tareas x/y · <hash corto>". Status sigue In progress.
- Cuando el PR esté listo con CI verde y todas las tareas verificadas: Status = Done con "[MiniMax/pi …] Done · PR <url> · <hash>".
  Done significa implementado y verificado. El agente fusiona si se cumplen las reglas de `AGENTS.md` y archiva después en un PR separado.
- Si te bloqueas: Status = Blocked con "[MiniMax/pi …] Blocked: <motivo concreto y qué se necesita>".
  Reglas:
- Nunca borres, archives, muevas ni dupliques filas o páginas; nunca pongas Status = Archived.
- Solo edita Status y Note (añadiendo al final, sin borrar texto existente). No toques Task name, Orden, Phase, Prioridad, Project ni Bot.
- Si el change no tiene fila, créala y registra su identificador en `docs/workflow-mcp.md`. No dupliques una fila existente.
- Horas siempre en America/Bogota (COT).
```

## 7. Evitar choques con la sincronización horaria de Projects Manager

- **Separar quién escribe qué.** MiniMax (en pi) solo cambia Status y **añade** líneas `[MiniMax/pi …]` al final del Note. La rutina horaria conserva esas líneas y no baja un Status que MiniMax haya subido: no pasa de In progress a Not started ni de Blocked a otro estado sin una evidencia en el repo, como un merge o un CI verde.
- **Precedencia.** Si los dos escriben en la misma hora, manda el evento más reciente del repo (commit o PR). La rutina compara la hora de la última línea `[MiniMax/pi …]` con la del último commit antes de cambiar el Status.
- **El proyecto lo mantiene solo la rutina.** MiniMax no edita la página del proyecto ni la línea "Última sincronización".
- **Archivado.** Solo lo marcan Pedro o la rutina, con aprobación, después del merge y de ejecutar `openspec archive`.
- **Notion no tiene bloqueos.** Cada escritura debe ser una actualización pequeña con `update_properties` y conviene volver a leer la fila justo antes de escribir, para no pisar un Note que haya cambiado.
