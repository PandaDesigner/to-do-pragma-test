# AGENTS.md — Pragma To-Do

Reglas permanentes para agentes. Si una instrucción de una fase las contradice, gana este archivo y el conflicto se reporta.

## Fuente y alcance

- Figma `F6ztYiRO9b0xYZA38xSTIA`, canvas `0:1`, es la fuente visual. `docs/design.json` y `docs/mocks/` son la copia local.
- El PDF `docs/prueba-tecnica.pdf` manda en funcionalidad. Si Figma y los documentos se contradicen y la decisión cambia el resultado, detenerse.
- Stack actual: Ionic 8, Angular 22 standalone, TypeScript estricto, Cordova, Jest y `@ngrx/signals`. Sin Capacitor.
- Idiomas: español e inglés con `@ngx-translate/core`, archivos `src/assets/i18n/{es,en}.json`, idioma del dispositivo y respaldo inglés.
- WIP=1: un change OpenSpec a la vez. Se fusiona y archiva antes de abrir el siguiente.

## Flujo

1. Partir de `develop` actualizado con fast-forward y crear la rama del change.
2. Diseño: `proposal.md`, `design.md`, specs con escenarios GIVEN/WHEN/THEN y `tasks.md`. Commit `docs(...)`.
3. Implementación con TDD: primero un commit `test(...)` que falle por el comportamiento ausente y después la implementación mínima. Un commit convencional por tarea, con el tipo que corresponda al contenido real.
4. Verificar localmente. Hasta tres intentos por fallo.
5. Escribir `verify-report.md`, guardar evidencia, actualizar `openspec/traceability.md` y Notion.
6. Abrir PR hacia `develop`, esperar checks y corregir hasta tres veces.
7. Con estado fusionable y limpio, fusionar con merge commit y borrar la rama. Sin `--admin`.
8. Repetir tests y build sobre `develop`. Un fallo posterior usa `fix/<tema>` y este mismo bucle.
9. Archivar en `chore/archive-<change>`, con PR, checks y merge propios.
10. Añadir una línea a `docs/progress-log.md`.

## Cierre

Un change está cerrado solo cuando:

- todas las tareas de `tasks.md` están marcadas;
- pasan tipos, lint, estilos, tests con cobertura y build;
- pasan `npm run trace:check` y `openspec validate --all --strict`;
- existen `verify-report.md` y evidencia;
- el PR está verde y sin conflictos.

Cobertura mínima: 80 % global, 95 % en `domain`, y 90 % en `data`, `store` y `shared`. Nunca bajar umbrales ni desactivar tests o reglas.

## Trazabilidad

- Cada requisito de UI cita `Figma: <nodeId>`.
- Cada escenario UI dice `conforme a Figma <nodeId>`.
- Cada test lleva el identificador del escenario en el título, por ejemplo `it('[TODO-02.1] ...')`.
- `openspec/traceability.md` tiene una fila por escenario: nodo, pantalla, mock, requisito, escenario, tarea, test y evidencia.
- La evidencia visual va en `openspec/changes/<change>/evidence/<pantalla>-{light,dark}-{es,en}.png`, a 375x812 y con tolerancia de 2 px.

## Reutilización

- Buscar componentes existentes antes de crear UI. Uno nuevo en `shared` exige al menos dos usos reales o previstos.
- Los componentes shared son presentacionales: no importan `store` ni `data`. Solo las páginas inyectan stores.
- Elegir el patrón más simple que sirva: presentacional, proyección y, solo si hay piezas opcionales combinables, Compound Component.
- Usar tokens `var(--app-*)`, sin valores visuales sueltos.
- Cada PR incluye una sección `Reutilización`.

## Notion y seguridad

- Actualizar la fila del change según `docs/workflow-mcp.md`. Si no existe, crearla.
- No guardar secretos. No reescribir historial ni usar force-push.
- No generar binarios sin firmar cuando falten credenciales: documentar la ausencia.
- Detenerse si algo falla tras tres intentos, si habría que omitir una tarea o bajar calidad, si se necesitan secretos, o si `main` exige aprobación humana.
