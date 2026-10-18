## Exploration

HEAD `36f3fd0`. Node 24.21.0. No se tocó el worktree `docs/testflight-ios` (`844079c`). El prompt nuevo está sin trackear en `docs/prompts/`.

Confirmado en código:

- `remote-config.ts` importa `environment` y `resolveDebugActions()` devuelve true si `production` es false.
- `.gitignore` ignora `environment.ts`, `environment.prod.ts` y `firebase-config.json`.
- En el Mac esos tres archivos existen. Los dos entornos solo tienen la clave `production` y no contienen `apiKey`, `AIza`, `appId`, `password` ni `secret`.
- `angular.json` producción no tiene `fileReplacements`. `defaultConfiguration` del build es `production`. La de `serve` es `development`. No hay target `ionic-cordova-build`.
- `ensure-environment.cjs` y los hooks `pretest`, `prebuild`, `pretypecheck` siguen en `package.json`.
- `build:android:release`, `scripts/ionic-build.cjs` y `scripts/build-android-release.cjs` ya pasan `--configuration production`. `build:ios` no compila la web.
- `isDevMode()` elige entre 60 s y 3600 s. El SDK instalado es `firebase` 13.0.0 y `@firebase/remote-config` 0.9.3, que exporta `onConfigUpdate`.
- README línea de Estado OpenSpec dice "No hay changes activos". Hay `fix-delivery-functional` y `finish-remaining-ui`.
- `debugHint` en `es.json` y `en.json` dice "virtual scroll".

`npm ci` en background salió 3 sin salida (nvm no arrancó en ese shell). La suite de línea base se lanzó con el `node_modules` ya instalado.
