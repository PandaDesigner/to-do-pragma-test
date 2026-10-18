# Correcciones para el harness pi (auditoría 16-oct-2026)

Estado: fase init de OpenSpec. Solo tareas 1.1 y 1.2 hechas. Starter en `todo-notebook-init/` DESVIADO.

## Bloqueantes (detener y corregir antes de seguir)
1. **Capacitor → Cordova**: `npm uninstall @capacitor/app @capacitor/core @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/cli`, borrar `capacitor.config.ts`, `ionic integrations disable capacitor`, `ionic integrations enable cordova` (config.xml con id propio, no io.ionic.starter), `npm i -D cordova`, `ionic cordova plugin add cordova-sqlite-storage`.
2. **Ionic 9 → Ionic 8**: fijar `@ionic/angular@^8` con una versión de Angular compatible con sus peers; si Angular 22 no lo es, bajar Angular. Sin `--legacy-peer-deps`.
3. **Vitest → Jest**: quitar vitest; instalar jest, jest-preset-angular, jest-environment-jsdom; ajustar script `test`.
4. **PDF como fuente obligatoria**: usar `docs/prueba-tecnica.pdf` y cambiar `openspec/config.yaml:5` y `:17`.
5. **.gitignore en la raíz**: node_modules, www, platforms, plugins, .angular, environments reales, .claude, .codex, .cursor, .opencode, .pi, .trae.

## Init
6. Instalar `@ngrx/signals @ionic/storage-angular localforage-cordovasqlitedriver firebase @angular/cdk`.
7. Mover el starter a la raíz y eliminar `todo-notebook-init/`.
8. Ampliar INIT-03 con el árbol exacto: `layout/shell/`, `pages/`, `shared/components/`, `core/{services,di,guards,decorators,config}`, `domain/`, `data/{repositories,strategies,decorators,states}`, `store/` + alias tsconfig.
9. Evitar `ls -la` sobre el disco externo (se cuelga); usar `ls` o `rg --files`.

## Cambios OpenSpec a crear (trazados al PDF)
- `app-base`: agregar/completar/eliminar + persistencia.
- `categories`: CRUD, asignación, filtro, reasignar a "Sin categoría".
- `patterns`: SOLID, Strategy, Decorator, State por tipo de categoría.
- `persistence`: Ionic Storage con SQLite → IndexedDB → LocalStorage, debounce 300 ms.
- `remote-config`: `enable_categories` oculta la pestaña My, timeout 3 s.
- `performance`: lazy, OnPush, virtual scroll desde 200, debug 5.000 tareas.
- `design-system`: tokens y pantallas del Figma (docs/design.json).
- `native-build`: APK firmado e IPA.
- `readme`: instrucciones + las 3 preguntas del PDF.
