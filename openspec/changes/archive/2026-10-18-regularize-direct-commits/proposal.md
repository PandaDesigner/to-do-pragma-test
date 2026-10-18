## Why

Dieciocho commits de UI (`c2fca8d`..`cffd11e`) entraron en `develop` sin un change OpenSpec. Además, el delta `TODO-09` de `fix-delivery-functional` repetía el `TODO-09` ya archivado en la spec principal, y `TODO-10.1` estaba definido dos veces.

## What Changes

- Se documentan esos commits sin revertirlos.
- `TODO-09` del delta pasó a `TODO-12` y `fix-delivery-functional` quedó archivado.
- El escenario de swipe por puntero de `finish-remaining-ui` pasó a `SWIPE-02.1`. `SWIPE-01.1` ya nombra la opción deslizante. Ese change no se archiva: tiene tareas abiertas.

## Capabilities

### New Capabilities

- `direct-commits`: comportamiento que ya está en `develop` y que estos commits dejaron.

### Modified Capabilities

Ninguna. Este change no cambia el comportamiento.

## Impact

- Specs y tests de caracterización. Sin cambios de UI.
- Rama prevista: `chore/regularize-direct-commits`. El trabajo quedó en el working tree de `fix/firebase-env-production` porque no se pidió commit.

## Out of scope

- Revertir cualquiera de los 18 commits.
- Archivar `finish-remaining-ui`.
- Comparar píxel a píxel contra Figma. Si un comportamiento contradice el nodo, se anota y no se corrige aquí.
