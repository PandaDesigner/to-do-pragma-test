## Why

La app no tiene una pantalla para cambiar el modo oscuro ni el idioma. Pedro pidió ambos controles en More/Settings.

## What Changes

- Añadir la pantalla de Ajustes con el interruptor de modo oscuro y el selector de idioma.
- Guardar ambas elecciones en Ionic Storage.
- Cargar español e inglés con `@ngx-translate/core`. El idioma inicial sale del dispositivo y el respaldo es inglés.

## Capabilities

### New Capabilities

- `settings`: controles de More/Settings.
- `i18n`: idiomas español e inglés.

### Modified Capabilities

Ninguna.

## Impact

Afecta una página nueva, la pestaña Ajustes, el arranque y los archivos `src/assets/i18n/{es,en}.json`. Depende de los tokens y de `.ion-palette-dark` de `theme-aliases`.
