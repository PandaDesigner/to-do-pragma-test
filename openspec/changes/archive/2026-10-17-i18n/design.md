# Diseño: i18n

## Fuente Figma

| Nodo                                                                         | Pantalla      | Escenarios                               | Notas                                                     |
| ---------------------------------------------------------------------------- | ------------- | ---------------------------------------- | --------------------------------------------------------- |
| [4:1496](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1496) | more-settings | SET-01.1, SET-01.2, I18N-01.1, I18N-01.2 | Fila Dark mode. El idioma se añade en esa misma pantalla. |

## Decisión

La página solo muestra controles y llama a `SettingsPreferences`. Esa clase guarda el tema y el idioma, aplica `.ion-palette-dark` y cambia el idioma activo. Sin valor guardado, el tema sigue al sistema y el idioma sale del dispositivo, con inglés de respaldo.

Las claves nuevas viven en `src/assets/i18n/es.json` y `en.json` y deben coincidir.
