## Why

Una build `--configuration production` sigue saliendo con `environment.production === false` en un clon, en el CI y en el APK de cualquiera que no tenga un `environment.ts` local. `resolveDebugActions()` enciende los botones de debug siempre que ese valor es false. El CI está verde porque `scripts/ensure-environment.cjs` copia el example, no porque la producción sea real (NUEVA-01).

## What Changes

- Versionar `environment.ts` y `environment.prod.ts` solo con valores públicos y un tipo `AppEnvironment`.
- Reemplazar el entorno únicamente en la configuración `production` de `angular.json`.
- Quitar el copiado del example y usar `environment.production` como única fuente del modo.
- Intervalo de Remote Config leído del entorno. La propuesta es 60 s en producción y 0 en desarrollo. Queda abierta en la PARADA 1.
- Un script `ensure-firebase-config` que falle en release si falta la config y que no falle en verify.
- README de Firebase y corrección de los textos falsos de OpenSpec y de `debugHint`.

## Capabilities

### New Capabilities

- `build-environments`: entornos versionados y `fileReplacements` de producción.
- `firebase-config`: config de Firebase exigida solo en release.
- `delivery-docs`: README de Firebase sin textos falsos.

### Modified Capabilities

- `remote-config`: el intervalo mínimo sale del entorno. Se mantiene una sola `fetchAndActivate` por arranque.

## Impact

No cambia layout. Toca `angular.json`, `src/environments/`, `src/app/core/config/`, `scripts/`, `package.json`, `.github/workflows/verify.yml`, `.gitignore`, `README.md` y `src/assets/i18n/{es,en}.json`. Rama local `fix/firebase-env-production` hacia `develop`. No se commitea ni se abre PR en esta parada.

## Out of scope

Consola de Firebase, secretos de GitHub, tag `v1.0.0`, PR `develop` → `main`, IPA firmada, grabación de la demo y el resto del prompt de entrega que no sea la parte Firebase de F2-P28-E2 ni los textos de F2-P28-E5 listados en T5. El change B (`regularize-direct-commits`) no se abre aquí. `onConfigUpdate` (RC-07) no entra salvo aprobación en la PARADA 1.
