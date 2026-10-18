# Informe de verificación — fix-qc-audit-findings

Fecha: 2026-10-18
Rama: `fix/qc-audit-findings` desde `develop` (86f7f72)

## Resultado

Los cinco hallazgos verificados quedan corregidos y cubiertos por 13 tests. La
auditoría de la que salieron había señalado siete; tres se descartaron al
reproducirlos.

## Qué se corrigió

| ID | Defecto | Causa | Arreglo | Test |
| --- | --- | --- | --- | --- |
| QC-01 | El filtro por rango no acotaba nada | `filteredTasks` omitía `dateRange` al llamar a `filterTasks` | Se le pasa `this.store.dateRange()` | QC-01.1 a QC-01.3 |
| QC-02 | `<html lang>` fijo en `en` | Nada actualizaba el atributo de `index.html` | `applyDocumentLanguage` al cargar y en cada cambio | QC-02.1 a QC-02.3 |
| QC-03 | El selector descartaba los días marcados | `toDateRange` leía solo los dos primeros elementos | Con tres o más días toma primer y último | QC-03.1 a QC-03.3 |
| QC-04 | Rutina y Evento indistinguibles de Todo | Las tres rutas montan la misma `TasksPage` sin nombrar la sección | El nombre de sección antecede al sobretítulo | QC-04.1 a QC-04.4 |
| QC-05 | La fecha se quedaba en inglés con la interfaz en español | `locale` leía `translate.currentLang`, que no es una señal | Lee la señal `language` de `SettingsPreferences` | QC-05.1 a QC-05.3 |

### QC-01 en detalle

`tasks.page.ts` reconstruye su lista visible en vez de leer
`store.visibleTasks()`, y al hacerlo pasaba `statuses` y `categoryId` pero no
`dateRange`. El store sí filtraba por rango, de modo que ambos caminos
discrepaban y el store no era la fuente de la pantalla. Medido en la app antes
del arreglo: con rango `2026-10-17` a `2026-10-19` y cuatro tareas
almacenadas, la pantalla mostraba las cuatro. Después del arreglo muestra solo
la que cae dentro, y coincide con `store.visibleTasks()`.

### QC-05 en detalle

Este hallazgo no figuraba entre los siete de la auditoría, que lo había
reportado como falso positivo ("la cabecera muestra la fecha sin traducir")
tras cambiar el idioma y restaurarlo mal. La afirmación era correcta, el
diagnóstico no: al volver a español y recargar, `lang` valía `es` pero el
título seguía en `18.Sun`.

Había dos candidatos y ninguno bastaba por sí solo. `translate.currentLang`
no es una señal, así que leerlo dentro de un `computed` congela el valor del
primer render. `translate.onLangChange` sí es observable, pero la página se
construye después de que el idioma se aplicó al arrancar, así que ese evento ya
ocurrió y se perdió. La fuente correcta es la señal `language` de
`SettingsPreferences`, que se actualiza en `load()` y en `setLanguage()`, y por
eso sobrevive al arranque.

Comprobado en la app: con la interfaz en español la cabecera renderiza
`18.dom` y `General · 18 de octubre`.

## Qué se descartó

| Hallazgo | Motivo del descarte |
| --- | --- |
| Tema oscuro roto (bloqueante) | Falso positivo. Medido: `--app-surface` resuelve a `#1e1a2b`, `--app-text` a `#edeaf5` y el `body` pasa a `rgb(30, 26, 43)`. El auditor leyó el orden de `:root` en el CSS compilado sin comprobar el resultado |
| Controles sin nombre accesible | Falso positivo. Los inputs tienen `<label>` asociado y las cinco pestañas toman su nombre accesible del texto rotado |
| Findings de responsive y accesibilidad básica | Ninguno. Cero scroll horizontal a 375×812 y 1280×800, cero controles sin nombre |

## Verificación ejecutada

| Comprobación | Resultado |
| --- | --- |
| `npm test` | 587 passed, 0 failed (65 suites) |
| `npm run lint` | All files pass linting |
| `npm run lint:styles` | Sin errores |
| `npx prettier --check` | All matched files use Prettier code style |
| `npm run trace:check` | Sin errores |
| `npx openspec validate --all --strict` | 20 passed, 0 failed |

## Verificación en la app

Sobre `http://localhost:8100` con la interfaz en español, en Chrome a 375×812:

- **QC-01** — tres tareas en `2026-10-05`, `2026-10-18` y `2026-11-20`, más
  una previa. Con rango `2026-10-17` a `2026-10-19` la pantalla muestra solo
  `qc-dentro` y coincide con el store. Al quitar el filtro vuelven las cuatro.
- **QC-02** — `document.documentElement.lang` es `es` con la interfaz en
  español y pasa a `en` al cambiar de idioma en Ajustes.
- **QC-04** — General muestra `General · 18 de octubre` y Rutina
  `Rutina · 18 de octubre`.
- **QC-05** — `18.dom` en lugar de `18.Sun`.

## Evidencia

No se adjuntan capturas. Las cinco correcciones son de comportamiento y las
verifiqué midiendo el DOM y el estado del store en la app en ejecución, no por
inspección visual. La trazabilidad marca esas filas como `n/a: comportamiento,
sin captura`. Las diferencias que sí son visuales (el nombre de sección en el
sobretítulo) quedan cubiertas por la comprobación de texto renderizado.

## Reutilización

No se creó ningún componente en `shared`. Las correcciones tocan la página, el
servicio de preferencias y una función pura del selector existente. La etiqueta
de sección reutiliza las claves `category.sections.*` que ya existían en i18n y
que solo estaban sin usar.

## Notas

`SettingsPreferences` se inyecta ahora en `TasksPage`, lo que obliga a que
`configurePageTesting` provea un stub de `Storage`. Se añadió al fixture
compartido y no a cada spec, para no repetirlo en los seis specs de página.