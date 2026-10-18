# Prompts del cambio C0.5 theme-foundation

**Modelo de trabajo:** MiniMax es el agente y pi el harness donde se ejecuta, en dos sesiones secuenciales.
Secuencia: Sesión 1 (diseño) → revisión y aprobación de Pedro → Sesión 2 (implementación) → revisión → merge de Pedro → archivo.

Paleta: variables de Figma F6ztYiRO9b0xYZA38xSTIA (4:440 claro / 4:1560 oscuro). text-muted #6B6580 también en oscuro, por decisión de Pedro del 16-oct. La paleta del icono es solo para el icono.

## Sesión 1: diseño (fase A)
```text
Eres MiniMax trabajando en el harness pi, en la SESIÓN 1 (DISEÑO) del cambio theme-foundation del proyecto Todo Notebook (Ionic 8 + Angular 22 + @ngrx/signals + Cordova, tests con Jest). Trabaja en "/Volumes/Disco Mac/Develop/ionic/pragma/to-do-pragma-test", partiendo de develop actualizado (ya incluye C0 restructure-specs con la capacidad ui-shell y el prefijo UI). Persistencia: artifact_store = openspec (NO Engram). Sigue docs/workflow-mcp.md (Figma = fuente visual; Notion = progreso).

Objetivo: crear el cambio OpenSpec "theme-foundation" (C0.5, va antes de tasks-crud). No escribas código de la app.

1. Crea la rama feature/theme-foundation desde develop y ejecuta `openspec new change theme-foundation`.
2. Figma (MCP figma, archivo F6ztYiRO9b0xYZA38xSTIA): ejecuta get_variable_defs en 4:440 (claro) y 4:1560 (oscuro), get_design_context y get_screenshot en 4:440, 4:1560, 4:788 y 4:1267. Si un valor difiere de docs/design.json, manda Figma y actualiza design.json en este cambio.
3. proposal.md: Why / What Changes / Capabilities (Modified: ui-shell) / Impact. La paleta es la de Figma: primary #4B3F6B (oscuro #8B7FC0), primary-dark #3A2E5C (oscuro #EDEAF5), text #2E2547/#EDEAF5, text-muted #6B6580, surface #FFFFFF/#1E1A2B, surface-muted #F2F2F4/#2A2539, border #E6E4EC/#332D45, card-border #D9D6E2/#332D45, danger #C5000F, accent-link #3AA8E0, tab/* (#B8CFA8, #F28B8B, #9FC3CF, #E8E1B8, #C9C9C9; en oscuro con alfa D9). El primary NO cambia respecto al actual. NO uses la paleta del icono (#5D527A/#3CCF8E).
4. specs/ui-shell/spec.md: delta "## ADDED Requirements" con UI-20..UI-28 (o el siguiente rango libre tras C0). Cada requisito con MUST/SHALL y escenarios WHEN/THEN con ID (UI-nn.m) que citen el nodo Figma ("conforme a Figma 4:440"). Contenido: tokens únicos (space 4/8/12/16/24/32, radios badge 2/checkbox 3/button 6/tab 8/card 10/input 10/round 999, tamaños de fuente 11/13/14/15/16/17/36/38 con letter-spacing (-0.3 en date, 0.4 en badge), gaps de layout 3/8/11/13/15/16/24/83, dimensiones (rail 27, top 55, checkbox 29, input/botón 50, FAB 68), fuentes Inter 400/600/700 y DM Serif Display 400 empaquetadas en src/assets/fonts con @font-face, porque hoy no se cargan), mapeo Ionic (primary con -rgb 75,63,107, -contrast #FFFFFF, -shade #3A2E5C; danger #C5000F; background y text), dark por prefers-color-scheme + body.dark/body.light con los valores de 4:1560, angular.json solo con src/theme/global.scss y src/theme/variables.scss, @use/@forward sin @import Sass propio, cero literales fuera de src/theme, --app-category-1..5 desde tab/* más filler, mixins y tipografía, Stylelint en CI y README de tokens. secondary/tertiary/success/warning quedan como "no definido en Figma" (valor por defecto de Ionic). Contraste ≥4.5. text-muted en oscuro = #6B6580 exactamente como Figma (decisión consciente de Pedro (16-oct): fidelidad a Figma por encima de WCAG para este token): exclúyelo del escenario de contraste y regístralo en la sección de riesgos de design.md. El sexto swatch del ColorPicker (4:869) no tiene color en Figma: déjalo como pendiente.
5. design.md: secciones "## Fuente Figma" (nodos con enlace node-id y escenarios) y "## Mapeo Figma → src/theme" (variable, light, dark, token SCSS, CSS var), más la tabla "Responsibility Model (CRC)" con una fila por archivo (_tokens, variables, _dark, _mixins, _typography, global, README, stylelint, theme.spec.ts): estereotipo, responsabilidades y colaboradores, con cada responsabilidad enlazada a un ID de escenario. Decisiones: mover global.scss, reemplazar dark.system.css, reglas de Stylelint, alias --color-*/--tab-* temporales, test light/dark con sass.compile en Jest + capturas, reversión.
6. tasks.md: tripletas RED/GREEN/REFACTOR (1.1–6.3) que citen IDs de escenario y el comando de verificación (npx jest src/theme, npm run lint, npm run lint:styles, npm run build). Incluye la evidencia visual: capturas 375x812 light/dark en openspec/changes/theme-foundation/evidence/ comparadas con get_screenshot de 4:440 y 4:1560. Incluye también los pasos Notion de la fila C0.5 (3fbcb4419773815db397fe4678dec2f0). Sin fase de tests al final.
7. Ejecuta `openspec validate theme-foundation --strict` hasta que pase, y luego `openspec status --change theme-foundation`.
8. Haz commit de los artefactos ("docs(openspec): propose theme-foundation") y abre un PR BORRADOR hacia develop solo con los artefactos. En Notion (fila C0.5, 3fbcb4419773815db397fe4678dec2f0) añade al Note: "[MiniMax/pi <fecha hora COT>] diseño feature/theme-foundation · PR <url> · validate --strict OK" y cambia Status de Blocked a Not started. En esta sesión NO implementes código de la app, no archives y no fusiones. La sesión 2 empieza solo cuando Pedro apruebe el diseño en el PR.
Al terminar responde con: ruta de los artefactos, salida de validate --strict, lista de IDs, discrepancias Figma/design.json encontradas y el enlace del PR borrador.
```

## Sesión 2: implementación (fase B)
Se ejecuta solo después de que Pedro apruebe el PR de diseño de la sesión 1.
```text
Eres MiniMax trabajando en el harness pi, en la SESIÓN 2 (IMPLEMENTACIÓN) del cambio theme-foundation del proyecto Todo Notebook (Ionic 8, Angular 22, @ngrx/signals, Cordova —nunca Capacitor—, tests con Jest —nunca Vitest ni Bun—). Proyecto: "/Volumes/Disco Mac/Develop/ionic/pragma/to-do-pragma-test". Cambio: theme-foundation, rama feature/theme-foundation (creada en la sesión 1 con proposal, spec delta ui-shell, design CRC con "Fuente Figma" y "Mapeo Figma → src/theme", y tasks). Sigue docs/workflow-mcp.md.

Usa el skill sdd-apply con artifact_store = openspec (escribe en openspec/changes/theme-foundation/, nunca en Engram) y TDD estricto:
- Notion (MCP notion), al empezar: fila C0.5 3fbcb4419773815db397fe4678dec2f0 → Status In progress y añade al Note "[MiniMax/pi <fecha hora COT>] inicio fase B feature/theme-foundation". Solo edita Status y añade texto al Note; nunca borres, archives ni crees filas.
- Para cada tarea en orden (1.1 → 6.3): RED: escribe el test Jest, ejecútalo (npx jest <ruta>) y pega la salida que demuestra el fallo. GREEN: el mínimo código para pasar; ejecuta y pega la salida. REFACTOR: limpia y vuelve a ejecutar.
- Marca [x] en tasks.md SOLO las tareas cuya verificación ejecutaste y pasó. Si algo no se pudo verificar, déjalo [ ] y explica por qué. Registra comandos y resultados reales en verify-report.md.
- En esta sesión NO edites proposal.md, design.md ni specs/ (son de la sesión 1). Usa exactamente los valores de la tabla "Mapeo Figma → src/theme" de design.md (paleta Figma: primary #4B3F6B / oscuro #8B7FC0, primary-dark #3A2E5C, text #2E2547/#EDEAF5, surface #FFFFFF/#1E1A2B, danger #C5000F, tab/* para categorías; text-muted #6B6580 también en oscuro, sustituyendo el #B4AEC5 actual: decisión consciente de Pedro (16-oct): fidelidad a Figma por encima de WCAG para este token). Empaqueta Inter y DM Serif Display en src/assets/fonts (@font-face). NO uses la paleta del icono (#5D527A/#3CCF8E). Puedes leer Figma (get_design_context/get_screenshot) en los nodos citados para verificar, pero si falta un valor o hay una discrepancia, detente, marca la fila como Blocked y pide volver a la sesión 1; no inventes valores.
- Reglas: solo @use/@forward en Sass propio; angular.json solo con src/theme/global.scss y src/theme/variables.scss; ningún color, px de espaciado/radio/fuente ni font-family fuera de src/theme (usa var(--ion-*) / var(--app-*)).
- Mantén package.json cordova.platforms == [] (npm run clean:platforms si tocas plataformas). Respeta los umbrales de coverage de jest.config.cjs.
- Evidencia visual: capturas 375x812 light y dark de las pantallas afectadas en openspec/changes/theme-foundation/evidence/, junto al get_screenshot de 4:440 y 4:1560, enlazadas en verify-report.md y en el PR.
- Antes del PR ejecuta y pega: npm test -- --coverage, npm run lint, npm run lint:styles, npm run format:check, npm run typecheck, npm run build -- --configuration production.
- Commits con Conventional Commits que citen IDs (p. ej. "feat(theme): tokens Figma y mapeo Ionic (UI-20, UI-21)"). Abre un PR BORRADOR feature/theme-foundation → develop con: cambio OpenSpec, IDs, nodos Figma, tests, evidencia y la fila Notion. Luego añade al Note de C0.5: "[MiniMax/pi …] PR <url> · tareas x/y · <hash>". Si te bloqueas: Status Blocked con el motivo.
- NO archives, NO fusiones, NO hagas force-push, NO marques el PR como listo.
Al terminar responde con: tareas marcadas, tareas pendientes con motivo, salida resumida de cada comando y el enlace del PR borrador.
```

## Después de la sesión 2
1. **Revisión**: Pedro revisa el PR. Opcionalmente abre en pi una sesión de revisión de MiniMax con el skill `sdd-verify`, que no corrige nada: solo informa contra los escenarios y design.md.
2. **Merge**: lo hace Pedro.
3. **Archivo, solo después del merge**: `openspec archive theme-foundation` en develop (Pedro, o MiniMax en pi si Pedro lo pide).
4. **Notion**: Status Done con el enlace del PR fusionado. Lo hace la sincronización horaria o la propia sesión.
