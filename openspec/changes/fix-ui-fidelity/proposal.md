## Why

Pedro detectó tres desalineaciones visuales en el navegador. Ninguna es lógica rota: las tres son pantallas que no usan bien componentes shared que ya funcionan. Este change solo toca la capa de presentación.

La revisión de los mocks antes de implementar cambia el alcance de dos de los tres puntos. Figma manda sobre el síntoma reportado:

- El empty state de Categories sí usa mal `app-empty-state`: le faltan la ilustración y el CTA. Corrección real.
- El orden de los botones del sheet NO está mal. `docs/mocks/categories-form-sheet.png` y `docs/design.json` 4:869 muestran el botón primario de 327x50 en `y=730` y ningún otro botón de acción; el código ya pone Guardar primero. Reordenar a "Guardar arriba" rompería la fidelidad al mock. Se documenta y no se toca.
- El chevron del badge HOY sí está mal de construir: es el carácter `›` dentro del texto traducible, no un icono. El mock sí muestra chevron y el texto cabe en 63 px, así que se convierte en icono real.

## What Changes

- `CategoriesPage` pasa `[illustrated]="true"`, `[actionLabel]` y `(action)` a `app-empty-state`, con los valores por defecto del componente (68 px, 239x50). No se cambia ningún default de `EmptyStateComponent` para no afectar a Tasks.
- El badge HOY deja de llevar el `›` en la traducción y lo pinta como `ion-icon chevron-forward` real, para que el `gap` del flex separe texto e icono. El ancho fijo de 63 px pasa a `min-width` para que el texto nunca se parta. Los valores por defecto de `--app-font-size-badge` y `--app-radius-badge` no se tocan.
- Ningún cambio de comportamiento: las mismas acciones, la misma hoja, los mismos textos traducidos.

## Capabilities

### New Capabilities

- `fix-ui-fidelity`: fidelidad visual de categories, el sheet y el badge HOY.

### Modified Capabilities

- `todo-screen`: el empty state de Categories y la composición del badge HOY.

## Impact

UI en la página Categories y en el badge HOY de la página Tasks. Figma: [4:1062](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1062) (empty state), [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440) y [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520) (badge HOY), [4:869](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869) (sheet, revisado y sin cambio). Sin dependencias nuevas. No se toca `CategorySheetComponent` ni su SCSS.

## Known limits

- El punto 2 no se implementa porque la evidencia visual contradice el síntoma. `docs/mocks/categories-form-sheet.png` y `docs/design.json` 4:869 muestran un único botón de acción a `y=730`; `docs/design.json` lista `Button y=730 h=50` como único hijo de acción y no registra ningún botón Cancelar ni Delete en ese nodo. El orden actual (Guardar primero) coincide con el mock.
- El punto 3 usa `min-width` en lugar del ancho fijo de 63 px. El mock mide 63x21 y el texto con `chevron-forward` cabe en ese ancho; `min-width` preserva 63 px como mínimo sin partir el texto en inglés más largo.
- `docs/design.json` describe `TodayBadge` con el texto `'TODAY ›'` como un solo string. Este change separa el chevron del texto, así que la descripción del componente queda desfasada respecto al DOM. Se documenta la discrepancia en `docs/design.json` en el mismo change, según la regla de `design` de `openspec/config.yaml`.

## Out of scope

- Reordenar los botones del sheet de categorías.
- Corregir la fila 4:869 de `openspec/traceability.md`, que queda como `registro`: no se toca la fila de registro, se añaden filas de escenario nuevas para 4:440, 4:520 y 4:1062.
- Persistencia, Remote Config, paginación y builds firmados.
