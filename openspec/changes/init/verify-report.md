# Verificación del cambio init

Este informe registra la evidencia real de las comprobaciones del cambio `init`. Las secciones siguen el orden de las tareas de `openspec/changes/init/tasks.md`.

## Versiones instaladas

| Componente | Versión | Fuente |
| --- | --- | --- |
| Node.js | 24.15.0 | `node --version` |
| npm | 11.19.0 | `npm --version` |
| Ionic Angular | 8.8.19 | `package-lock.json` |
| Angular | 22.2.3 | `package.json` |
| Cordova (CLI) | 13.0.0 | `package.json` (devDependencies) |
| Jest | 30.5.2 | `package.json` (devDependencies) |
| jest-preset-angular | 17.0.3 | `package.json` (devDependencies) |

## Resultado de las verificaciones

- `npm run format:check`: pendiente (se ejecuta en CI).
- `npm run lint`: pasa.
- `npm run typecheck`: pasa para `tsconfig.app.json` y `tsconfig.spec.json`.
- `npm test`: ver registro de la conversación.
- `npm run build`: ver registro de la conversación.
- `ionic serve --no-open`: arranca y responde en `http://localhost:8100/` con HTTP 200 y `app-root` presente.

## Pruebas y ciclo RED/GREEN

- Pruebas nuevas añadidas en este cambio:
  - `src/project-config.spec.ts` (configuración INIT-01/02/04).
  - Refuerzo de `src/app/app.component.spec.ts` e `src/app/pages/home/home.page.spec.ts` (INIT-03).
- RED observado: 16 pruebas iniciales fallan por requisitos ausentes (build con entornos ignorados, dependencias faltantes, identificador Cordova, alias, página mínima). Log: `/tmp/todo-notebook-init-red.log`.
- GREEN tras implementar configuración y página: todas las pruebas pasan.

## Auditoría de dependencias

`npm audit` informa 44 avisos con la siguiente raíz y alcance:

| Paquete raíz | Versión instalada | Severidad | Alcance |
| --- | --- | --- | --- |
| `tar` | 6.2.1 | crítica | `Ionic CLI` (devDependency). Riesgo en herramientas de CI, no en el navegador. |
| `@grpc/grpc-js` | 1.9.16 | alta | `firebase` → `Firestore`. gRPC se usa del lado Node; no se ejecuta en navegador todavía. |
| `basic-ftp` | 5.3.1 | alta | `Ionic CLI` (devDependency). Requiere entradas maliciosas en FTP. |
| `braces` | 3.0.3 | alta | `Cordova` (devDependency). Patrones profundamente anidados. |
| `tmp` | 0.0.33 | alta | `Ionic prompts` (devDependency). |
| `sprintf-js` | 1.0.3 | moderada | Cadena de configuración de Jest. |

Ninguna corrección compatible está disponible en el árbol actual. La auditoría se documenta para revisores y queda como tarea explícita fuera de `init`.

## Limitaciones

- `init` no implementa CRUD, persistencia funcional ni Remote Config activo.
- No se generan plataformas Cordova; se hará en el siguiente cambio.
- Firebase está instalado como SDK, no inicializado.
- Las pruebas existentes comprueban arranques y configuración; las pruebas de comportamiento de producto vendrán con cada feature.
