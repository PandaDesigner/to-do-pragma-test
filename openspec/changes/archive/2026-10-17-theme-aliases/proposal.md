## Why

Los estilos todavía usan `var(--color-*)` junto a los tokens `--app-*`. La paleta oscura solo responde al sistema y no puede activarse con la clase pedida por UI-22.

## What Changes

- Sustituir los 42 usos de `var(--color-*)` por `var(--app-*)`.
- Publicar categorías, relleno, sombras, fondo del diálogo y radio redondo como tokens.
- Aplicar la paleta de Figma 4:1560 con `.ion-palette-dark` y conservar el seguimiento del sistema cuando no hay preferencia.
- No incluye la pantalla de Ajustes ni el idioma. Eso va en `feature/i18n`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `ui-shell`: UI-22 distingue sistema, oscuro por clase y claro guardado.

## Impact

Afecta `src/theme`, los estilos que consumían `var(--color-*)` y los tests de UI-22. No cambia páginas ni almacenamiento de ajustes.
