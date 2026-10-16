# Verificación parcial de app-base

Rama de continuación: `feature/app-base-2`, creada desde `develop`. Este informe no declara completo el cambio ni autoriza fusionarlo o archivarlo.

## Tarea 1.1: modelos y State

Se adoptó el modelo de `docs/PROMPT.md` sin compatibilidad ni migración del modelo anterior, según confirmación del usuario. Dominio define contratos, reloj y error; las clases State y su máquina están en `data/states/`. El reloj se inyecta por llamada. Las nueve transiciones válidas actualizan `updatedAt`; RESCHEDULE usa el día local del reloj. Los quince pares estado/evento restantes y EXPIRE sin vencimiento lanzan `InvalidTransitionError`.

Evidencia RED: el test State falló por ausencia del módulo requerido. El test de categoría también falló al esperar `list` y recibir `default`. Después de implementar, las 31 pruebas de la máquina pasaron. No se atribuye TDD retroactivo al código previo.

Se adaptaron los fixtures y el ordenamiento al `dueDate` obligatorio aprobado. Los casos límite adicionales de estrategias y la extracción de tokens Angular se verifican por separado en las tareas 1.2 y 1.3, documentadas abajo.

La comprobación raíz primero reprodujo TS5101. Se retiró `baseUrl`, se hicieron relativos los aliases y se eliminaron las supresiones de deprecaciones. Después se detectaron tipos Jest/Node ausentes en la configuración raíz con TS 6: se declararon explícitamente, manteniendo `types: []` para la app.

Comprobaciones ejecutadas:

- `npx tsc --noEmit`: correcto.
- `npm run typecheck`: correcto para app y pruebas.
- `npm run lint`: correcto.
- `npm test -- --coverage --collectCoverageFrom='src/app/domain/**/*.ts' --collectCoverageFrom='src/app/data/states/**/*.ts' --coverageThreshold='{"global":{"statements":95,"branches":95,"functions":95,"lines":95}}'`: 11 suites, 73 pruebas correctas; 100% en statements, branches, functions y lines de domain y State. Este alcance no demuestra los umbrales de todo data o store.
- `openspec validate app-base --type change --strict`: correcto. La ejecución inicial sin `--type change` se rechazó por ambigüedad con la spec principal del mismo nombre.
- `npx ionic build`: correcto; 484,58 kB iniciales. Advierte navegadores antiguos no soportados en Browserslist; no se cambió esa configuración.
- Prettier aplicado a los archivos modificados; `git diff --check`: correcto.

## Tarea 1.2: estrategias

Se añadieron pruebas de colecciones vacías, filtro sin estados, categoría inexistente, filtro explícito `null`, fechas iguales y arrays/tareas congelados. La comprobación de tipos falló primero con TS2322 porque el filtro no admitía `categoryId: null`; se amplió ese contrato para distinguir tareas sin categoría de filtro omitido. Los demás casos verifican comportamiento ya existente, sin atribuirles un RED que no ocurrió.

`npm test -- --runTestsByPath src/app/domain/task-strategy.spec.ts`: 6 pruebas correctas. `npx tsc --noEmit`, `npm run lint` y Prettier: correctos.

## Tarea 1.3: contratos y tokens

Los contratos `Repository<T>`, `TaskRepository` y `CategoryRepository` están en domain sin imports Angular. Los tokens viven en `core/di/tokens.ts`. Una prueba con `Injector.create` confirma la resolución independiente de ambos repositorios.

La misma suite de cinco pruebas corre contra tareas InMemory, tareas Ionic Storage con almacenamiento simulado y categorías InMemory. Verifica colección vacía, guardado/listado, actualización sin duplicados, eliminación idempotente y snapshots independientes. No acredita aún el driver SQLite en dispositivo ni un repositorio de categorías persistente.

RED real: 10 pruebas fallaron porque el repositorio InMemory generado no tenía `list/save/remove`; las cinco contra Storage mock ya pasaban. El test de inyección falló inicialmente por ausencia del módulo de tokens. Tras implementar, las 16 pruebas de contrato/inyección pasaron.

Una ejecución previa falló por ENOSPC en el directorio temporal de macOS, no por el código. Se repitió usando `--cacheDirectory=node_modules/.cache/jest` en el volumen del proyecto, sin borrar archivos ajenos. La comprobación final con el comando normal también pasó.

## Comprobación final de la fase 1 de tasks.md

- `npm test -- --coverage`: 12 suites y 89 pruebas correctas. Cobertura de domain y State: 100% en las cuatro métricas. Cobertura global de archivos ejecutados: 97,87% statements, 94,11% branches, 96,36% functions y 97,75% lines. Esto no sustituye los thresholds permanentes ni la inclusión de archivos no ejecutados pendientes de 5.1.
- `npx tsc --noEmit` y `npm run typecheck`: correctos.
- `npm run lint` y `npm run format:check`: correctos.
- `npx ionic build`: correcto, con la advertencia Browserslist ya indicada.

Se revisaron los cambios contra la guía TypeScript, incluida la regla 20: la máquina delega en clases State; la suite de contrato se separa de las fábricas concretas. No se añadió una dependencia de infraestructura al dominio ni se cambió código ajeno a estas tareas. La fase termina con tareas 1.1, 1.2 y 1.3 completas. Esperar confirmación antes de persistencia y stores.

## Continuación autorizada para cierre completo

Pedro autorizó completar todas las tareas sin las pausas entre fases anteriores y reconstruir la propuesta CI ausente. Se mantiene un solo change y rama hasta su cierre. No fusionar el PR; el archivado requiere primero la fusión por Pedro.

### Tarea 3.2

Commit `fe224da`. Los decoradores exponen los nombres requeridos y conservan los aliases anteriores. Debounce comparte la promesa entre llamadas agrupadas, espera el resultado, propaga errores y serializa lotes por instancia. RED: cuatro fallos de las seis pruebas de decoradores; GREEN: 92 pruebas totales, tipos y lint correctos. Se adaptaron los tests de Storage al contrato de confirmación aprobado.

### Tarea 2.1

Colección persistente compartida por tareas y categorías, claves separadas, operaciones por ID y error explícito antes de inicializar o ante contenido inválido. El arranque espera la plataforma y registra SQLite, con IndexedDB y LocalStorage como alternativas. Se añadió dependencia directa de `@ionic/storage` para sus constantes públicas.

RED: dos fallos por falta de persistencia de categorías y operaciones permitidas antes de inicializar. GREEN: 14 suites, 97 pruebas; `npx tsc --noEmit`, typecheck, lint y formato correctos. Build web correcto. Se probaron recarga en nuevas instancias, aislamiento de claves, errores y reintento manual. La ejecución SQLite en dispositivo queda por demostrar en la entrega nativa 4.4; estos tests no la sustituyen.

Advertencias observadas: Browserslist y dependencias CommonJS del almacenamiento. npm indicó que la sesión usa Node 26 frente al Node 24 declarado y reportó vulnerabilidades; no se ejecutó una actualización forzada de dependencias.

### Tarea 2.2

SignalStore de tareas y categorías implementados con filtros, orden por fecha, refresh, upsert, borrado y operaciones en bloque. El reloj se inyecta; refresh expira únicamente tareas pending de días anteriores. Las transiciones delegan en la máquina State existente.

La eliminación de categoría carga primero todas las tareas y persiste sus referencias a null antes de eliminar la categoría. Ante fallo se conserva la vista anterior, se muestra el mensaje en el estado del store y la operación puede reintentarse explícitamente. La integración visual del mensaje y botón de reintento corresponde a 4.1.

Validación: 16 suites, 105 pruebas; cobertura de los archivos ejecutados de store, data y domain al 100% en las cuatro métricas. Tipos, lint, formato y build correctos. Los umbrales permanentes siguen pendientes de 5.1; estos porcentajes no los sustituyen.

### Tarea 3.1

Puerto y servicio Remote Config implementados; bootstrap espera como máximo 3 segundos por la consulta completa. Se conserva true ante timeout, clave ausente o error y se expone diagnóstico para el aviso/reintento de la UI pendiente. Las respuestas tardías no cambian el flag resuelto.

El adaptador usa el SDK Firebase instalado, carga diferida, fetchAndActivate, valores predeterminados e intervalos dev/prod requeridos. El JSON real recibido para to-do-pragma está solo en assets local y está ignorado; el ejemplo versionado no contiene valores reales. No se añadió Analytics.

RED: las 10 pruebas del servicio fallaban por ausencia de servicio/puerto. GREEN: 18 suites y 126 pruebas con cobertura; tipos raíz y app/spec, lint, formato, build y diff-check correctos. Las pruebas del SDK son simuladas y no acreditan publicación ni cambio remoto del parámetro. La demo remota y las capturas siguen pendientes; la configuración web no autentica el MCP administrativo.

### Tarea 4.1

Páginas tasks/categories generadas con CLI Ionic, standalone y OnPush. Formularios con validación, CRUD, asignación/filtro de categorías, acciones delegadas a State y confirmación de borrado. Componente TaskItem presentacional con inputs/outputs; servicio de feedback muestra errores sin promesas rechazadas sin manejar.

Las listas usan @for por ID por debajo de 200 y CDK desde 200, con trackById y alturas fijas de 65/77 px. Se probaron 199/200, CRUD, flags apagados y recuperación de errores. Los nombres y recuentos de categorías se calculan una vez por cambio.

Validación: 21 suites y 136 pruebas, tipos/lint/formato/build correctos. Prueba manual automatizada con Chromium, sesión aislada app-base-validation, en localhost:8117/tasks: crear una tarea por formulario, recargar y comprobar que sigue presente. Sin errores de página. El servicio Firebase devolvió enabled=true y error=null con la configuración real; esto no demuestra todavía la demo de false remoto.

Los estilos usan la paleta aprobada. No se acredita fidelidad visual de 2 px ni fuentes locales todavía. Shell y navegación inicial siguen pendientes de 4.2.

### Tarea 4.2

Shell con Ionic tabs y rail lateral de 27 px: Todas y Mis listas. Entrada raíz a /tabs/tasks y rutas lazy; home/tasks/categories mantienen redirecciones para sus URLs previas. El guard redirige /tabs/my cuando el flag es false. Un cambio posterior a false limpia el filtro de categoría y redirige si esa vista estaba abierta, sin borrar asignaciones.

El selector y los chips ya respetan el flag en TaskPage. Shell muestra el valor solo lectura y ofrece el aviso/reintento remoto aprobados. Se prueban tab oculta, conservación de tareas, guard, redirección y reintento.

Validación: 22 suites, 140 pruebas; tipos, lint y formato correctos. Build correcto. Chromium aislado a 375×812: entrada por raíz, navegación por Mis listas y página categorías correctas, sin errores. La captura detectó desplazamiento y recorte del rail: se corrigió y se comprobó nuevamente.

### Tarea 4.3

Botón Debug que añade 5.000 tareas en un solo upsertMany, conserva las anteriores y activa la vista pending/overdue sin filtro de categoría. IDs por crypto.randomUUID inyectado, sin dependencia adicional. LogAction registra la acción una vez, no cada tarea. El panel debug se cierra al generar para no ocupar el viewport.

RED: faltaba generateFiveThousand. GREEN: 22 suites, 142 pruebas. El test de página acredita 5 tareas iniciales y 5.005 finales, IDs únicos y CDK activo. El test de Storage acredita una escritura para 5.000 saves. Tipos, lint, formato y build correctos.

Chromium de escritorio en ventana 375×812, build de desarrollo, sesión aislada: una tarea inicial y 5.001 finales; 6 filas DOM inicialmente y máximo 8 durante scroll; una escritura real de la base IndexedDB de la app. Tras recargar permanecen 5.001 tareas. Se alcanzó Tarea de prueba 5000. Viewport de 134,61 px con borde inferior en 780 px, dentro de la pantalla de 812 px.

Medición orientativa de 1.808 ms de scroll automatizado: 125 callbacks de animación, media 69 FPS, intervalo máximo 70 ms. No acredita 60 FPS estables en dispositivo. Heap observado antes/después del lote: 38.779.014 / 40.433.558 bytes; no es una medición de pico ni una comparación release. No hubo errores de página.

## Pendientes de entrega

Stores, persistencia completa, Remote Config, UI, generación masiva, thresholds permanentes, CI, documentación final y APK firmado/IPA siguen sujetos a sus tareas. No se ha abierto ni fusionado un PR en esta continuación.

No existe `docs/ci-cd-propuesta.md` en el árbol inspeccionado. Será necesario resolver esa fuente antes de implementar el workflow solicitado. Los archivos locales de limpieza y las copias de archivo preexistentes no forman parte de esta implementación.
