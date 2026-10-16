# Todo Notebook

Scaffolding de la app Todo Notebook con Ionic 8 y Angular standalone. Esta rama deja la base reproducible y **no incluye todavía las pantallas ni la lógica de la prueba**: esos cambios vendrán en PRs posteriores que abrirán desde `develop`.

## Requisitos

- Node.js 24.15.0 LTS (usa `nvm use` con el `.nvmrc` incluido).
- npm 11.

## Comandos

| Acción                             | Comando                                     |
| ---------------------------------- | ------------------------------------------- |
| Instalar dependencias              | `npm ci`                                    |
| Arrancar el servidor de desarrollo | `npm run ionic:serve` (también `npm start`) |
| Ejecutar pruebas                   | `npm test`                                  |
| Revisar el código                  | `npm run lint`                              |
| Comprobar formato                  | `npm run format:check`                      |
| Aplicar formato                    | `npm run format`                            |
| Comprobar tipos                    | `npm run typecheck`                         |
| Generar build de producción        | `npm run build`                             |

## Arquitectura

Capas: `pages → store → domain ← data`; `core/di` conecta implementaciones. Componentes `shared` solo input/output. SignalStore para el estado. Aliases TypeScript: `@core/*`, `@domain/*`, `@data/*`, `@store/*`, `@pages/*`, `@shared/*`.

## Cordova

- Identificador de app: `io.github.pandadesigner.todonotebook`.
- Plugin: `cordova-sqlite-storage`.
- Sin plataformas generadas en `init`; se añaden en su cambio dedicado.

## Auditoría de dependencias

El comando `npm audit` informa 44 avisos heredados de `tar`, `@grpc/grpc-js`, `basic-ftp`, `braces`, `tmp` y `sprintf-js` (ver `openspec/changes/init/verify-report.md`). Ninguno afecta al código del navegador todavía, pero se documentan y quedan pendientes de un cambio dedicado.

## Estado del cambio OpenSpec

Este repositorio implementa el cambio `openspec/changes/init` con escenarios INIT-01 a INIT-05. La trazabilidad vive en:

- `openspec/changes/init/tasks.md`
- `openspec/changes/init/verify-report.md`
- `.github/pull_request_template.md`
