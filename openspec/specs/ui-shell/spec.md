# ui-shell Specification

## Purpose
TBD - created by archiving change theme-foundation. Update Purpose after archive.
## Requirements
### Requirement: UI-20 Tokens trazables y centralizados

El sistema MUST definir los valores crudos aprobados en src/theme/_tokens.scss, sin emitir CSS desde ese parcial, y exponerlos desde variables.scss. Los colores, espaciados, radios y medidas MUST coincidir con la tabla Mapeo Figma → src/theme de design.md. Los valores técnicos heredados autorizados MUST documentarse separados de los valores extraídos de Figma. Cada cambio UI MUST contrastar Figma, docs/design.json y docs/design.md. MUST detener la parte afectada ante un valor ausente o discrepante, sin estimarlo ni usar la paleta del icono.

#### Scenario: UI-20.1 Tokens claros exactos

- **GIVEN** el diseño aprobado con primary #4B3F6B, primary-dark #3A2E5C, text #2E2547, surface #FFFFFF y danger #C5000F
- **WHEN** se carga la paleta clara
- **THEN** las variables públicas resuelven exactamente esos valores y las medidas provienen de la tabla documentada.

#### Scenario: UI-20.2 Discrepancia de fuentes

- **GIVEN** un valor ausente, estimado o contradictorio entre las fuentes
- **WHEN** se prepara su migración
- **THEN** la tarea afectada queda pendiente con motivo y no se introduce un valor inventado.

#### Scenario: UI-20.3 Propagación de un token

- **GIVEN** un consumidor de un token documentado conforme a Figma 4:440
- **WHEN** se cambia ese token en _tokens.scss y se recompila en una prueba aislada
- **THEN** el consumidor refleja el cambio sin editar su hoja de estilos.

### Requirement: UI-21 Puente Ionic

El sistema MUST mapear primary, danger, light, medium y dark a variables Ionic a partir de los tokens aprobados, con base, rgb, contrast, contrast-rgb, shade y tint, además de texto, fondo y familia tipográfica. El primario claro MUST usar rgb 75, 63, 107, contraste #FFFFFF y shade #3A2E5C. Secondary, tertiary, success y warning MUST conservar los valores Ionic por defecto y documentarse como no definidos en Figma, sin usar colores del icono. RGB y variantes MUST corresponder a la paleta activa y la superposición MUST evitar aplicar dos veces el alfa.

#### Scenario: UI-21.1 Cambio de paleta coherente

- **GIVEN** una paleta activa
- **WHEN** un control Ionic consume fondo, texto, primario o contraste
- **THEN** los valores efectivos corresponden al mapeo de esa paleta, sin conservar derivados claros en oscuro.

#### Scenario: UI-21.2 Variantes completas

- **GIVEN** los mapeos Ionic aprobados para las paletas de Figma 4:440 y 4:1560 y el cierre de la tarea 0.4 (variantes verificadas con la API instalada)
- **WHEN** se compila el tema y se inspeccionan los colores definidos
- **THEN** cada color tiene base, rgb, contrast, contrast-rgb, shade y tint consistentes con la paleta activa; si el cierre 0.4 no se ha ejecutado, el escenario se mantiene pendiente.

#### Scenario: UI-21.3 Contraste y excepción auditada

- **GIVEN** los colores Ionic definidos y sus contrastes
- **WHEN** se calcula su relación de contraste
- **THEN** alcanza al menos 4.5:1 para texto normal; si un valor Figma obligatorio impide cumplirlo, se reporta el conflicto sin alterarlo silenciosamente. La excepción ya aceptada por Pedro es text-muted oscuro #6B6580 sobre #1E1A2B, aproximadamente 3:1 según la auditoría del 16-oct; MUST registrarse como riesgo y MUST NOT declararse AA ni usarse para información crítica.

### Requirement: UI-22 Paleta oscura verificable

El sistema MUST ofrecer la paleta de .ion-palette-dark con primary #8B7FC0, primary-dark y text #EDEAF5, surface #1E1A2B y los restantes valores exactos de design.md. El sistema MUST conservar el seguimiento de prefers-color-scheme y permitir forzar oscuro con .ion-palette-dark, conforme a la decisión del usuario. La decisión posterior del usuario sustituye la propuesta body.dark/body.light del plan: esas clases y el forzado claro manual quedan fuera de alcance; retirar .ion-palette-dark restaura el seguimiento del sistema. Este cambio MUST NOT añadir persistencia de preferencias sin autorización.

#### Scenario: UI-22.1 Oscuro por clase

- **GIVEN** .ion-palette-dark aplicada al documento y el sistema en claro, conforme a Figma 4:1560
- **WHEN** se renderiza la pantalla
- **THEN** los colores efectivos corresponden a la columna oscura y no existen overrides locales contradictorios.

#### Scenario: UI-22.2 Oscuro del sistema

- **GIVEN** el documento sin .ion-palette-dark
- **WHEN** el sistema reporta prefers-color-scheme: dark
- **THEN** se aplica la paleta de Figma 4:1560.

#### Scenario: UI-22.3 Retorno al sistema

- **GIVEN** el sistema en claro y la clase forzando oscuro
- **WHEN** se retira .ion-palette-dark
- **THEN** vuelve la paleta clara de Figma 4:440 sin escribir preferencias persistidas.

### Requirement: UI-23 Entradas y módulos Sass

angular.json MUST cargar únicamente src/theme/global.scss y src/theme/variables.scss como estilos globales. El Sass propio MUST usar solo @use y @forward para dependencias, sin @import.

#### Scenario: UI-23.1 Compilación con dos entradas

- **GIVEN** la configuración de build
- **WHEN** se ejecuta el build production
- **THEN** compila con las dos entradas indicadas y conserva el CSS Ionic necesario sin @import propio.

#### Scenario: UI-23.2 Configuración y módulos

- **GIVEN** angular.json y los archivos Sass propios
- **WHEN** se verifican las entradas globales de los targets aplicables y sus dependencias
- **THEN** contienen exactamente las dos rutas exigidas, sin referencias a src/global.scss ni @import propio; Jest sigue usando su configuración existente sin añadir un target Angular de tests innecesario.

### Requirement: UI-24 Consumidores sin literales visuales

Los estilos de la aplicación fuera de src/theme MUST consumir `var(--app-*)` o `var(--ion-*)` para colores, espaciado, radio, tamaño tipográfico y font-family. La migración MUST preservar eventos, estados, accesibilidad y pruebas existentes. Las dimensiones no trazables MUST resolverse antes de su sustitución.

#### Scenario: UI-24.1 Auditoría de consumidores

- **GIVEN** los estilos de shell, tareas, categorías, home y task-item
- **WHEN** se ejecutan las comprobaciones de estilos
- **THEN** no contienen colores, px de espaciado/radio/fuente ni font-family literales fuera del tema.

### Requirement: UI-25 Categorías desde tab Figma

El sistema MUST definir --app-category-1 a --app-category-5 desde tab/todo, tab/routine, tab/event, tab/my y tab/more, respectivamente, más --app-category-filler y sus contrastes, sin cambiar el contrato de datos de categoría. Conforme a Figma 4:788 y la auditoría, Shopping MUST mapear a tab/my, Work a tab/event, Home a tab/todo y Health a tab/routine. El sexto swatch del ColorPicker 4:869 no tiene token definido: MUST permanecer pendiente, sin inventar un sexto color. Los colores claros MUST ser #B8CFA8, #F28B8B, #9FC3CF, #E8E1B8 y #C9C9C9, con alfa D9 en oscuro.

#### Scenario: UI-25.1 Categoría y paleta

- **GIVEN** una categoría que consume uno de los cinco tokens
- **WHEN** se alterna entre paletas
- **THEN** usa el tab Figma correspondiente, con alfa oscuro documentado, sin hexadecimal en el consumidor.

### Requirement: UI-26 Tipografía y reutilización

El sistema MUST usar DM Serif Display 400 e Inter 400/600/700 desde archivos locales con licencia. Los once estilos MUST respetar familia, peso, tamaño, tracking e interlineado resuelto desde las fuentes. MUST NOT simular negrita de DM Serif Display. La tipografía MUST residir en _typography.scss y los mixins en _mixins.scss, incluyendo bp-up, truncate, focus-visible y safe-area. El uso de fuentes woff2 locales MUST funcionar sin conexión. MUST corregirse los hallazgos C0.5 de la auditoría: meta 12 a 14 px, ayudas muted 13 a 14 px y labels/botones a 14 px con pesos de la tabla. Los tokens de fecha y texto general MUST reconocer los nombres Figma --fs-display-date y --fs-body; las diferencias verificadas en la copia offline MUST actualizarse durante fase A, nunca ocultarse.

#### Scenario: UI-26.1 Estilos tipográficos

- **GIVEN** las fuentes cargadas, la unidad de interlineado cerrada por la tarea 0.3 y los archivos de fuente con licencia verificada
- **WHEN** se renderizan título, fecha, tarea, meta, botón y pestaña
- **THEN** sus fuentes efectivas coinciden con la tabla de design.md, incluidos tamaños 36, 38, 17, 14, 14 y 13 px respectivamente.

#### Scenario: UI-26.2 Fuentes offline

- **GIVEN** los archivos locales y sus licencias
- **WHEN** se inicia la aplicación sin acceso a red
- **THEN** carga las familias y pesos requeridos sin depender de un CDN y sin negrita sintética.

#### Scenario: UI-26.3 Mixins y foco

- **GIVEN** fixtures Sass que usan bp-up, truncate, focus-visible y safe-area
- **WHEN** se compilan y un control recibe foco por teclado
- **THEN** emiten las reglas esperadas con los tokens documentados, incluido outline primary y offset del tema; preservan área segura y truncado sin introducir medidas nuevas ni esconder controles.

### Requirement: UI-27 Comprobaciones automatizadas

El proyecto MUST ejecutar Jest, conservar los umbrales de jest.config.cjs y añadir npm run lint:styles con Stylelint en CI. Cada tarea implementable MUST registrar RED, GREEN y REFACTOR reales; tasks.md MUST marcar solo verificaciones ejecutadas y aprobadas. package.json MUST conservar cordova.platforms como lista vacía, sin Capacitor, Vitest o Bun.

#### Scenario: UI-27.1 Regresión de estilos

- **GIVEN** un literal prohibido fuera del tema o un @import propio
- **WHEN** se ejecuta lint:styles
- **THEN** el comando falla con el archivo y la regla aplicable.

#### Scenario: UI-27.2 Calidad antes de PR

- **GIVEN** la implementación terminada
- **WHEN** se ejecutan coverage, lint, lint:styles, format:check, typecheck y build production
- **THEN** todos pasan antes de declarar verificada la implementación y se guardan comandos y resultados reales.

#### Scenario: UI-27.3 CI bloquea estilos inválidos

- **GIVEN** un fixture con un color literal prohibido en src/app
- **WHEN** CI ejecuta el mismo lint:styles que el entorno local
- **THEN** el comando y el job fallan sin rebajar umbrales ni omitir las otras comprobaciones.

### Requirement: UI-28 Documentación y evidencia

El proyecto MUST mantener src/theme/README.md con una fila por token de _tokens.scss, valores claros/oscuros, origen Figma o técnico y uso, verificado por Jest. MUST documentar tokens y su fuente, guardar evidencia 375x812 clara y oscura de las pantallas afectadas junto a get_screenshot de 4:440 y 4:1560 en evidence/, y enlazarla en verify-report.md y el PR borrador. El PR MUST apuntar a develop, citar OpenSpec, IDs, nodos, tests y Notion C0.5. MUST NOT archivarse, fusionarse, hacer force-push ni marcarse listo.

#### Scenario: UI-28.2 Auditoría contemplada sin ampliar alcance

- **GIVEN** los hallazgos de docs/auditoria-figma.md y los nodos 4:440, 4:1560, 4:788 y 4:1267
- **WHEN** se prepara y verifica C0.5
- **THEN** design.md y verify-report.md trazan cada hallazgo C0.5: on-primary blanco, muted oscuro aprobado, tokens faltantes, tabs con alfa D9, filler independiente del primario oscuro, fuentes locales, once estilos, padding superior 55 px, gaps de header 3/15 px, radio del acento 1.5 px, input de alto 50 px con radio 10 y surface-muted sin borde, botón de alto 50 px y padding horizontal 16 px, y eliminación de literales del home sin retirar comportamiento.
- **AND** los hallazgos C1 (rail completo, fecha, panel, FAB, TODAY, checkbox y formularios nuevos, swipe y textos), C2 (swatch 27 px, chips 33/35 px, ColorPicker y sheets), C3 (filler con flag apagado) y C7 (comparativa final) se registran como pendientes de sus cambios, no se implementan ni se declaran resueltos por C0.5.
- **AND** las correcciones offline auditadas incluyen verificar --fs-title/--fs-note-title en 4:788/4:1267, documentar sheets 4:947 y 4:1365 con sus padres y explicitar el sexto swatch pendiente; los elementos estimados no pasan a valores Figma confirmados sin evidencia nueva.

#### Scenario: UI-28.3 Catálogo sincronizado

- **GIVEN** los tokens definidos en _tokens.scss
- **WHEN** Jest compara el catálogo src/theme/README.md
- **THEN** cada token aparece con origen, valores claros/oscuros y uso, diferenciando los técnicos heredados de los extraídos de Figma.

#### Scenario: UI-28.1 Revisión trazable

- **GIVEN** las verificaciones y capturas ejecutadas
- **WHEN** se abre el PR borrador de feature/theme-foundation hacia develop
- **THEN** incluye las referencias y evidencia verificable, y Notion conserva sus notas anteriores con el enlace, conteo real de tareas y hash añadidos.

