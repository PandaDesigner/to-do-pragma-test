## Context

En `36f3fd0`, `angular.json` tiene `defaultConfiguration: production` y no tiene `fileReplacements`. `.gitignore` ignora `environment.ts` y `environment.prod.ts`. El CI copia `environment.example.ts` (`production: false`) antes de test, typecheck y build. `resolveDebugActions()` devuelve true si `environment.production` es false. `FirebaseRemoteConfigPort` elige el intervalo con `isDevMode()`, no con `environment`.

En el Mac de Pedro ya existen, ignorados, `environment.ts` y `environment.prod.ts`. Solo declaran `production`. No tienen claves de secreto. Al versionarlos, el pull pisa esos archivos locales.

`firebase-config.json` existe en local y sigue ignorado. No se lee ni se imprime.

## Goals / Non-Goals

**Goals:**

- Toda build de la configuración `production` lleva `production: true` y el intervalo de producción, sin copiar examples.
- `ng serve` (configuración `development`) mantiene `production: false`, así el debug se ve en local.
- Release sin `firebase-config.json` ni variables `FIREBASE_*` falla con un mensaje en español que no imprime valores.
- Verify y debug siguen arrancando sin ese archivo (P-07, `[RC-04]`).

**Non-Goals:**

- No se publica nada en la consola de Firebase ni se habilita la API Realtime.
- No se configuran secretos de GitHub.
- No se incluye RC-07 hasta que Pedro lo apruebe.

## Decisions

### AppEnvironment

Un solo tipo exportado desde `src/environments/environment.ts` y reutilizado por el prod:

```ts
export interface AppEnvironment {
  production: boolean;
  remoteConfigFetchIntervalMs: number;
}
```

`environment.ts`: `production: false`. `environment.prod.ts`: `production: true`. Ningún otro campo. Sin `apiKey`, `appId` ni secretos.

Propuesta de intervalo, pendiente de la PARADA 1: desarrollo `0`, producción `60_000`. Firebase puede throttle si un cliente pide de más; la app solo llama `fetchAndActivate` una vez por arranque, y 60 s alcanza para publicar, esperar, cerrar y volver a abrir. `0` en producción queda solo si Pedro pide un build exclusivo de la demo.

### fileReplacements

Solo en `build.configurations.production`:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

`development` no declara `fileReplacements`. Se quitan de `.gitignore` las dos líneas de `environment.ts` y `environment.prod.ts`. Se borran `scripts/ensure-environment.cjs`, `environment.example.ts` y los scripts `ensure:env`, `pretest`, `prebuild` y `pretypecheck`.

El test `builds without ignored private environment files` exige que `angular.json` no contenga `src/environments/environment`. Ese test se sustituye por `[ENV-01.1]`. La prohibición era para no meter secretos en el build; estos archivos ya no llevan secretos.

### Una fuente de modo

`minimumFetchIntervalMillis` lee `environment.remoteConfigFetchIntervalMs`. Se elimina `FETCH_INTERVAL` y el uso de `isDevMode()` en `src/app/core/config`. Los specs de Remote Config mockean `../../../environments/environment` con `jest.mock` y dejan de mutar el objeto.

### onConfigUpdate

`@firebase/remote-config` 0.9.3 exporta `onConfigUpdate` en `dist/remote-config-public.d.ts:316`. La documentación web (13 oct 2026) lo describe para el SDK web: el listener abre una conexión, `next` recibe `updatedKeys` y hay que llamar `activate`. No menciona Cordova ni WebView. No se comprueba si la API Realtime del proyecto `to-do-pragma` está habilitada y no se habilita. RC-07 queda fuera del spec hasta la PARADA 1. Si Pedro lo aprueba, se añade entonces, con fallo del listener silencioso.

### ensure-firebase-config

`scripts/ensure-firebase-config.cjs` exporta `ensureFirebaseConfig({ root, env, require, log })`.

- Si `src/assets/firebase-config.json` existe, no se toca.
- Si no existe y están `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_MESSAGING_SENDER_ID` y `FIREBASE_APP_ID`, se escribe el JSON. `FIREBASE_AUTH_DOMAIN` y `FIREBASE_STORAGE_BUCKET` son opcionales.
- Si faltan obligatorias, código 1 y el mensaje nombra solo esas claves.
- Sin archivo y sin variables: `--require` sale 1 y nombra la ruta, el `cp` desde `firebase-config.example.json` y las variables; sin `--require` avisa que se usarán los defaults y sale 0.
- `log` no recibe valores.

`--require` va antes de `ng build --configuration production` en `build-android-release.cjs`, en el script `build:android:release` y en la build web de release de iOS. El job `verify` y las builds debug del CI llaman el script sin `--require`. Los secretos de CI quedan documentados en el README y no se crean.

### Qué configuración usa cada build

Hoy `defaultConfiguration` del target `build` es `production`, así que `ng build` y `npm run build` ya seleccionan esa configuración. `ng serve` usa `development`. `build:ios` no compila la web: el job de CI compila antes con `npm run build`.

Propuesta, pendiente de la pregunta 3:

- `ng serve` y `watch`: `development`, debug visible.
- `npm run build`, el job `verify`, el APK debug del CI y la web que luego archiva iOS: configuración `production` (es lo que se entrega).
- Release Android e iOS: `ng build --configuration production` explícito, más `ensure-firebase-config --require`.

`build:android:release`, `ionic:build` e `ionic:build:android` ya invocan `ng build --configuration production`. `[ENV-01.5]` puede nacer verde. Si pasa a la primera, se registra como verificación sin RED y se demuestra el fallo cambiando el comando en local.

`ionic cordova build` no tiene target `ionic-cordova-build` en `angular.json`. No se ejecutó un build firmado. Si en el apply el comando falla por ese target, se para y se pregunta si el release pasa a `cordova build android --release` después del `ng build`.

## Risks / Trade-offs

- Versionar `environment.prod.ts` pisa el archivo local de Pedro. Hoy solo tiene `production`. Avisar antes del pull.
- 60 s puede no bastar si Firebase throttle el cliente. El síntoma es un error de fetch y la app se queda con el último valor activado.
- Quitar `isDevMode()` cambia el intervalo de Jest: el spec actual espera 60000 porque Jest está en dev mode. El mock del entorno pasa a ser la fuente.
- Un tercer change OpenSpec convive con `fix-delivery-functional` y `finish-remaining-ui`. `AGENTS.md` pide WIP=1. Este cambio está solo diseñado. No se implementa hasta la PARADA 1.

## Migration Plan

1. Añadir los dos entornos y `fileReplacements`.
2. Borrar el copiado y el example.
3. Cambiar el port y los specs al mock.
4. Añadir el script de Firebase y engancharlo.
5. README e i18n.
6. Reversión: volver a ignorar los entornos, restaurar el example y el script de copia, y quitar `fileReplacements`. No hay migración de datos.

## Open Questions

1. Intervalo de producción: 60 s o 0 s.
2. ¿Entra RC-07?
3. ¿El APK debug del CI y la web de `build:ios` van en `production` o en `development`?
4. Si `ionic cordova build` falla por falta de `ionic-cordova-build`, ¿se cambia el release a `cordova build android --release`?
5. ¿Algún comportamiento de los 18 commits directos se revierte en el change B en vez de documentarse?
6. ¿Siguen siendo dos changes, A y B?
