# Correcciones de la auditoría QA sobre tasks-date-filter

## Por qué

Una auditoría QA de los cinco flujos de la app (con Playwright sobre `develop`) destapó varios defectos. Este change corrige los que se han **verificado en código o midiendo el DOM**, y descarta explícitamente los que resultaron ser falsos positivos del auditor.

La auditoría mezcló errores reales con artefactos de su propia sesión. Antes de escribir una línea de código se reprodujo cada hallazgo por separado. El resultado es que tres de los siete no eran defectos de la app, sino del entorno de prueba o de la medición.

## Qué cambia

Cuatro correcciones, todas confirmadas de forma independiente:

1. **El filtro por fecha no filtra nada.** `filteredTasks` en `tasks.page.ts` reconstruye su propia lista y pasa `statuses` y `categoryId` a `filterTasks`, pero **omite `dateRange`**. El store sí lo pasa, por eso `store.visibleTasks()` filtra bien mientras la pantalla no. El filtro queda decorativo y la funcionalidad del PDF inservible.
2. **`<html lang>` queda fijo en `en`.** Está hardcodeado en `index.html` y ninguna parte del código lo actualiza al cambiar de idioma. Con la interfaz en español, `lang="en"` rompe el anuncio del idioma a lectores de pantalla y las reglas `:lang()` de CSS.
3. **El selector de rango pierde la elección del usuario.** `toDateRange` solo lee los dos primeros elementos (`const [from, to] = dates`). Como el borrador se siembra en `[hoy, hoy]` y `ion-datetime` va acumulando, un tercer clic descarta el día elegido y el rango aplicado queda en `hoy..hoy`.
4. **Rutina, Evento y Todo no se distinguen.** Las tres rutas montan la misma `TasksPage` y filtran por `categorySection`, así que con tareas solo en la sección general las tres pantallas muestran contenido idéntico y el usuario no sabe dónde está.

## Qué NO cambia

Tres hallazgos de la auditoría se descartaron al verificarlos:

- **El tema oscuro no funciona (bloqueante).** Falso positivo. Medido en el DOM: `.ion-palette-dark` sí resuelve `--app-surface` a `#1e1a2b` y `--app-text` a `#edeaf5`, y el fondo real del `body` pasa a `rgb(30, 26, 43)`. El auditor leyó el orden de `:root` en el CSS compilado sin comprobar el resultado.
- **La cabecera muestra la fecha sin traducir.** Falso positivo. El sobretítulo `October 18` es correcto porque en la captura la interfaz estaba **en inglés**. `formatDayTitle` y `formatLongDate` reciben `this.locale()` desde la página, y el locale se resuelve bien contra la lista de idiomas de la app.
- **Los elementos interactivos sin nombre accesible.** Falso positivo. Los inputs del formulario tienen `<label>` asociado (`Título`, `Fecha`, `Hora`) y las cinco pestañas del rail toman su nombre accesible del texto rotado con `transform`. El `innerText` sigue siendo legible.

## Impacto

Sin cambios en API pública ni en el modelo de datos. La corrección 1 toca una línea de la página y activa el filtro que el usuario ya podía activar desde el modal pero que no hacía nada. La 2 añade un efecto colateral al servicio de traducción. La 3 normaliza el borrador antes de emitirlo. La 4 añade la etiqueta de sección a la cabecera.

## Fuera de alcance

- La señal visual y textual de la sección activa (corrección 4) se resuelve con el título de la cabecera. No se rediseña el rail.
- El nombre en inglés del tirador del modal es texto interno de Ionic, fuera del control de la app.
- La auditoría no encontró problemas de responsive (cero scroll horizontal en 375×812 y 1280×800) ni de accesibilidad básica (cero controles sin nombre).