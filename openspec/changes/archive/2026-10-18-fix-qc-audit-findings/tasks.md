# Tareas

## 1. Specs y trazabilidad

- [x] 1.1 Registrar `QC-01` a `QC-04` en `openspec/traceability.md` cuando exista cada test
- [x] 1.2 Anadir las cuatro filas con su test y evidencia al cerrar el change

## 2. QC-01 El filtro por rango acota la lista

- [x] 2.1 `test(...)`: test en rojo que fija una tarea fuera del rango y la sigue viendo en `filteredTasks`
- [x] 2.2 `fix(...)`: pasar `dateRange: this.store.dateRange()` a `filterTasks` en `tasks.page.ts`
- [x] 2.3 `test(...)`: cubrir que quitar el filtro devuelve la lista completa

## 3. QC-02 El atributo lang sigue al idioma

- [x] 3.1 `test(...)`: test en rojo que fija `lang` en `en` con la interfaz en español
- [x] 3.2 Localizar el punto único donde se resuelve el idioma activo de la traducción
- [x] 3.3 `fix(...)`: actualizar `document.documentElement.lang` al cambiar de idioma

## 4. QC-03 El rango aplicado recoge los días elegidos

- [x] 4.1 `test(...)`: test en rojo con tres días marcados que espera rango primer-último
- [x] 4.2 `test(...)`: test en rojo que aplica tras un solo clic y descarta el día semilla
- [x] 4.3 `fix(...)`: normalizar la selección tomando extremos en `toDateRange`
- [x] 4.4 `fix(...)`: ignorar el valor semilla cuando el usuario ya interactuó con el calendario

## 5. QC-04 La cabecera nombra la sección

- [x] 5.1 `test(...)`: test en rojo que exige título distinto por sección
- [x] 5.2 `fix(...)`: derivar el título del `categorySection` de la ruta
- [x] 5.3 `test(...)`: cubrir la sección sin tareas
- [x] 5.4 Añadir las claves i18n del nombre de sección en `es.json` y `en.json`

## 6. Verificación

- [x] 6.1 `npm test` en verde con cobertura
- [x] 6.2 `npm run lint`, `lint:styles` y formato limpios
- [x] 6.3 `npm run trace:check` y `openspec validate --all --strict` en verde
- [x] 6.4 Repetir los cinco flujos en la app con los cuatro arreglos aplicados
- [x] 6.5 Capturar evidencia visual de la cabecera por sección
- [x] 6.6 Escribir `verify-report.md`