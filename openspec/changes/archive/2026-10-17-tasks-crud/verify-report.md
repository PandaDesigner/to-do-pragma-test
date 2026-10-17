# Reporte de verificación: tasks-crud (C1)

## Resultado

14/14 tareas completadas. Cobertura, pruebas, documentación y entrega verificadas. Sin cambios de código productivo ni dependencias. El cambio no está archivado ni fusionado.

## Estado al reanudar

- Rama `feature/tasks-crud`, basada en `develop` tras el merge `aa6d6b4` de C0.5.
- Commit previo de C1: `aadf1ff`. PR #7 ya abierto como borrador hacia `develop`: https://github.com/PandaDesigner/to-do-pragma-test/pull/7.
- Los tres archivos de pruebas de C1 ya existían. Los cuatro archivos dirigidos pasaban con 60 pruebas; la suite completa previa pasaba con 31 suites y 219 pruebas.
- El checklist estaba sin marcar y este reporte solo contenía resultados esperados. No se toman como evidencia de esta sesión.

## Contrato confirmado

El usuario aprobó conservar la app y corregir la spec para describir su comportamiento:

- `setCategory(null)` muestra solo tareas sin categoría; `setCategory(undefined)` quita el filtro de categoría.
- `upsert` y `upsertMany` conservan los timestamps recibidos. `dispatch` y `clearCategory` actualizan `updatedAt` con el reloj inyectado.
- El escenario integrado habilita `PENDING` y `COMPLETED` antes de filtrar por categoría. El filtro inicial excluye tareas completadas.
- `Task` es una interfaz: no genera ids ni valida campos en ejecución. Se comprueban campos obligatorios en el tipo y reemplazo por id sin duplicados en el store.
- No se promete una cola de operaciones ni transacciones de repositorio. Un fallo mantiene la vista anterior del store, pero varias escrituras pueden persistir parcialmente.

## Cambios comprobados

- `src/app/domain/task.spec.ts`: categoría por defecto corregida, campos opcionales y obligatorios y conservación de identidad. Eliminado el cast que introducía `undefined` en un campo no opcional.
- `src/app/domain/task-state.spec.ts`: pruebas directas de los cuatro estados, acciones, nueve transiciones válidas, todos los pares estado/evento no permitidos e inmutabilidad de `updateTaskStatus`.
- `src/app/store/task.spec.ts`: flujo crear/completar/filtrar/quitar filtro con persistencia y ordenación; `upsert` sin duplicados; distinción `null`/`undefined`; filtro por estado y fechas; fallos y reintentos de operaciones, incluida la persistencia durante expiración.
- Spec con identificadores `TSK-n.m`; diseño corregido para reflejar filtros, timestamps, concurrencia y orden de drivers existente.
- Las pruebas nuevas pasaron al ejecutarse contra la app existente. No hubo RED de comportamiento ni se alega TDD retroactivo. El checklist se corrigió para reflejar auditoría y ampliación de cobertura, no archivos ausentes ni fallos inventados.

## Verificaciones ejecutadas

Resultados de esta sesión, posteriores a los cambios:

| Comando                                                                                                                                                                | Resultado                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `npm test -- --runTestsByPath src/app/domain/task.spec.ts src/app/domain/task-state.spec.ts src/app/data/states/task-state-machine.spec.ts src/app/store/task.spec.ts` | Exit 0; 4 suites, 89 pruebas                               |
| `npm test -- --coverage --coverageReporters=json-summary --coverageReporters=text`                                                                                     | Exit 0; 31 suites, 248 pruebas; umbrales de Jest cumplidos |
| `openspec validate tasks-crud --strict`                                                                                                                                | Exit 0; `Change 'tasks-crud' is valid`                     |
| `npm run typecheck`                                                                                                                                                    | Exit 0                                                     |
| `npm run lint`                                                                                                                                                         | Exit 0; `All files pass linting.`                          |
| `npm run lint:styles`                                                                                                                                                  | Exit 0                                                     |
| `npm run format:check`                                                                                                                                                 | Exit 0; `All matched files use Prettier code style!`       |
| `npm run build -- --configuration production`                                                                                                                          | Exit 0; salida en `www`                                    |
| `git diff --check`                                                                                                                                                     | Exit 0                                                     |

Cobertura total de cada archivo objetivo, no incremento porcentual atribuible solo a C1:

| Archivo                        | Sentencias | Ramas | Funciones | Líneas |
| ------------------------------ | ---------- | ----- | --------- | ------ |
| `src/app/domain/task.ts`       | 100 %      | 100 % | 100 %     | 100 %  |
| `src/app/domain/task-state.ts` | 100 %      | 100 % | 100 %     | 100 %  |
| `src/app/store/task.ts`        | 100 %      | 100 % | 100 %     | 100 %  |

Fuente: `coverage/coverage-summary.json` generado por Jest. Ya existía cobertura del 100 % de esos archivos en la línea base; C1 amplía escenarios, no reclama una mejora ficticia del porcentaje.

## Avisos y límites

- Watchman avisa de un recrawl del directorio. No impide ejecutar las pruebas; no se cambia su configuración.
- Build avisa de CommonJS para `localforage` y `localforage-cordovasqlitedriver`. Sin errores de compilación.
- El escenario integrado usa `InMemoryRepository<Task>` y reloj fijo. No es una prueba de navegador ni verifica SQLite en dispositivo.
- Los checks remotos anteriores del PR correspondían a `aadf1ff`; no prueban todavía los commits nuevos. No se ejecutaron builds nativos locales en esta sesión.
- Los archivos ajenos ya sin seguimiento al inicio se conservan sin añadirlos a los commits de C1.

## Entrega

- Commit de pruebas y verificación publicado: `ebf20ea` (`test(tasks-crud): verify TSK-1 through TSK-10 contracts`). Solo incluye los siete archivos de C1.
- PR #7 actualizado y comprobado como borrador hacia `develop`: https://github.com/PandaDesigner/to-do-pragma-test/pull/7.
- Notion actualizado en la página autorizada `3fbcb4419773815db397fe4678dec2f0`, solo en `Status` y `Note`, añadiendo la sección C1 al texto existente. Incluye enlace, conteo real, pruebas y hash. Estado `In progress` porque falta revisión; el texto de C0.5 se conserva.
- Este cierre documental completa el checklist de C1. La nota final de Notion y el PR referencian el hash publicado del cierre.
- No se archivó el cambio, no se fusionó el PR, no se hizo force-push ni se marcó listo. La revisión sigue pendiente.
