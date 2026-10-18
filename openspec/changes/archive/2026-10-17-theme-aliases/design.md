# Diseño: theme-aliases

## Fuente Figma

| Nodo                                                                         | Pantalla       | Escenarios                | Notas         |
| ---------------------------------------------------------------------------- | -------------- | ------------------------- | ------------- |
| [4:1560](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1560) | todo-dark-mode | UI-22.1, UI-22.2, UI-22.3 | Paleta oscura |

## Decisión

Los consumidores usan solo `var(--app-*)`. Los nombres `--color-*` desaparecen de los usos. La clase `.ion-palette-dark` fuerza la paleta oscura. `.ion-palette-light` conserva la paleta clara aunque el sistema esté en oscuro. Sin clase, manda `prefers-color-scheme`.

El selector de Ajustes no entra en este cambio.

## Mapeo

| Uso anterior            | Token                 |
| ----------------------- | --------------------- |
| `--color-primary`       | `--app-primary`       |
| `--color-primary-dark`  | `--app-primary-dark`  |
| `--color-text`          | `--app-text`          |
| `--color-text-muted`    | `--app-text-muted`    |
| `--color-surface`       | `--app-surface`       |
| `--color-surface-muted` | `--app-surface-muted` |
| `--color-border`        | `--app-border`        |
| `--color-tab-label`     | `--app-primary-dark`  |
