# Proposal: el chevron del badge HOY se entrega como SVG, no como nombre

## Problema

El badge HOY renderiza su chevron así:

```html
<ion-icon name="chevron-forward" aria-hidden="true"></ion-icon>
```

Ionicons solo resuelve un nombre si el icono está registrado con `addIcons`. Esta app no llama a `addIcons`, así que en tiempo de ejecución Ionicons avisa por consola:

```
[Ionicons Warning]: Could not load icon with name "chevron-forward".
Ensure that the icon is registered using addIcons or that the icon SVG data
is passed directly to the icon component.
```

El elemento queda en el DOM con el atributo correcto y no dibuja nada. Es un fallo invisible para la mayor parte de las pruebas: el marcado es válido y el template compila.

## Causa

El arreglo existía en la rama `fix-ui-fidelity` (commit `1302bde`) pero ese commit no llegó a `develop`. El PR #51 se fusionó con squash a las 13:43 del 2026-10-18 y su commit en `develop`, `4e73ce9`, no es ninguno de los ocho de la rama. Los otros dos comportamientos del change sí están en `develop`: el empty state ilustrado de Categorías y el orden primario-antes-que-cancelar del sheet.

## Cambio

`TasksPage` importa el SVG desde `ionicons/icons` y lo expone en `readonly icons`, y el template lo entrega por la entrada `[icon]`. El atributo `name` desaparece.

Además se corrige el escenario publicado `[TODAY-UI-01.1]`, que exige literalmente `name = 'chevron-forward'` y por tanto contradice el comportamiento correcto.

## Fuera de alcance

- El filtro por rango de fecha, que vive en el PR #53.
- Ampliar `openspec-ids.spec.ts` más allá de `openspec/specs/direct-commits`, que es lo que dejó pasar este hueco en verde.