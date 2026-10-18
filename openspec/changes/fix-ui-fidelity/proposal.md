## Why

Pedro detectó tres desalineaciones visuales en el navegador. Ninguna es lógica rota: las tres son pantallas que no usan bien componentes shared que ya funcionan. Este change solo toca la capa de presentación.

- El empty state de Categories sí usa mal `app-empty-state`: le faltan la ilustración y el CTA. Corrección real.
- El orden de los botones del sheet sí está mal: `category-sheet.component.html` pone Cancelar antes que Guardar, y `tasks.page.html` pone Guardar antes que Cancelar. Corrección real, solo reordenación del DOM.
- El chevron del badge HOY está mal de construir: es el carácter `›` dentro del texto traducible, no un icono. El mock sí muestra chevron, así que se convierte en icono real.

## What Changes

- `CategoriesPage` pasa `[illustrated]="true"`, `[actionLabel]` y `(action)` a `app-empty-state`, con los valores por defecto del componente (68 px, 239x50). No se cambia ningún default de `EmptyStateComponent` para no afectar a Tasks.
- `category-sheet.component.html` reordena `.form-actions` para poner el botón primario antes que Cancelar, igual que `tasks.page.html`. No se toca el SCSS: no hay selectores dependientes del orden (`.form-actions`, `.primary-action`, `.sheet-cancel` y `.danger-link` se aplican por clase, sin `:first-child`, `:nth-*` ni selectores hermanos). En modo `Edit` el orden final es Guardar, Cancelar, Eliminar.
- El badge HOY deja de llevar el `›` en la traducción y lo pinta como `ion-icon chevron-forward` real, para que el `gap` del flex separe texto e icono. El ancho fijo de 63 px pasa a `min-width` para que el texto nunca se parta.

## Capabilities

### New Capabilities

- `fix-ui-fidelity`: fidelidad visual de categories, el sheet y el badge HOY.

### Modified Capabilities

- `todo-screen`: el empty state de Categories y la composición del badge HOY.

## Impact

UI en la página Categories, en el `CategorySheetComponent` y en el badge HOY de la página Tasks. Figma: [4:1062](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1062) (empty state), [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440) y [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520) (badge HOY), [4:869](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869) (sheet). Sin dependencias nuevas.

## Known limits

- `docs/mocks/categories-form-sheet.png` y `docs/design.json` 4:869 solo componen un botón de acción de 327x50 en `y=730` y no dibujan Cancel ni Delete, así que el mock no fija el orden relativo de esos botones. El orden se toma de `docs/mocks/new-task-modal.png` (nodo 4:1267), donde el editor de tareas compone Guardar arriba y Cancelar abajo, y de la intención reportada de que ambas hojas coincidan. La comparación visual del resultado se documenta en `verify-report.md` como comparación de orden relativa, no como diff de 2 px.
- El punto 3 usa `min-width` en lugar del ancho fijo de 63 px. El mock mide 63x21 y el texto con `chevron-forward` cabe; `min-width` conserva 63 px como mínimo sin partir el texto.
- `docs/design.json` describe `TodayBadge` con el texto `'TODAY ›'` como un solo string. Este change separa el chevron del texto, así que esa descripción queda desfasada respecto al DOM. La discrepancia queda documentada en `verify-report.md`; corregir `docs/design.json` no cabe en un `fix/*` que solo toca presentación.

## Out of scope

- Persistencia, Remote Config, paginación, builds firmados y la actualización de `docs/design.json`.
