## Why

Los estilos actuales repiten colores y medidas fuera del tema y no aplican de forma consistente las fuentes y paletas de Figma. theme-foundation establece un contrato comprobable antes de continuar con nuevas pantallas.

## What Changes

- Centralizar colores, medidas y tipografía en `src/theme`, con trazabilidad a Figma, `docs/design.json` y `docs/design.md`.
- Mapear tokens a Ionic y a variables `--app-*`, incluidas las cinco categorías derivadas de `tab/*`.
- Mantener estilos claros y oscuros coherentes y fuentes locales para Cordova offline.
- Usar solo `@use` y `@forward` en Sass propio; cargar únicamente `src/theme/global.scss` y `src/theme/variables.scss` desde angular.json.
- Migrar literales de los estilos de la aplicación, conservar comportamiento y añadir comprobaciones Jest y Stylelint en CI.
- Documentar tokens y evidencia visual 375x812 junto a referencias Figma.

## Capabilities

### New Capabilities

Ninguna nueva. La capacidad `ui-shell` existe desde C0 y este cambio la modifica.

### Modified Capabilities

- `ui-shell`: contrato UI-20 a UI-28 para tokens, integración Ionic, paletas, entradas Sass, consumo sin literales, categorías, tipografía, comprobaciones y documentación.

## Impact

Afecta `src/theme`, `src/global.scss`, estilos de shell, tareas, categorías, home y task-item, angular.json, pruebas de configuración, package.json, lockfile, CI y README. Stack conservado: Ionic 8, Angular 22, @ngrx/signals, Cordova y Jest. Sin Capacitor, Vitest o Bun; sin cambios de persistencia, modelos o reglas funcionales.

Rama: `feature/theme-foundation`, creada desde develop. PR borrador hacia `develop`, un solo cambio OpenSpec. Seguimiento: Notion C0.5, fila `3fbcb4419773815db397fe4678dec2f0`. No archivar, fusionar ni marcar el PR como listo.

La creación de estos artefactos fue autorizada por el usuario tras comprobar que los artefactos atribuidos a MiniMax no estaban disponibles. Los documentos de workflow, auditoría, plan y prompts ya están disponibles y se han leído. La fase A debe cerrar el diseño con un PR documental borrador y revisión de Pedro antes de la fase B. Las discrepancias visuales impiden implementar las partes afectadas hasta aclararlas. El prompt docs-workflow-mcp describe otro PR de documentación/configuración: no se ejecuta ni se mezcla automáticamente con theme-foundation.
