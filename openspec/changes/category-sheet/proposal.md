## Why

El formulario de categoría está metido dentro de la página Categorías y se parece poco al sheet del nodo `4:869` de Figma. Hoy usa `<select>` para el icono y el color, sin preview en vivo, y no hay un segundo punto de entrada coherente: cuando el NewTaskModal necesita crear una categoría, el flujo no reutiliza nada. El siguiente change tras archivar `todo-screen` cierra esa duplicación y sube la fidelidad visual sin inventar tokens ni componentes nuevos en `shared`.

## What Changes

- Sustituir el `<form>` inline de `CategoriesPage` por un `ion-modal` (`CategorySheetComponent`) con la maqueta de Figma `4:869` y `4:947`: handle, título serif, cuatro campos (Name, Icon, Color, Section) en orden, preview con `ChipComponent`, botón primario de guardar y acción de texto para borrar.
- Introducir un selector visual de icono con doce opciones (carrito, casa, maletín, corazón, libro, avión, tenedor, bíceps, nota musical, huella, billete, estrella) en una rejilla de seis columnas, con borde de selección `--app-primary` cuando la celda está activa.
- Introducir un selector visual de color con seis muestras (Routine, Event, My, More, gris, primary) tomadas de los tokens `tab-*` ya expuestos; la muestra activa lleva anillo de `--app-primary` y un check.
- Mantener el campo Sección (CAT-SEC-01) como cuarta fila con chips General/Routine/Event, sin derivarlo de color ni de contexto.
- Extender `ChipComponent` con soporte de icono vía `ng-content` (sin sumar un input nuevo) para que el preview del sheet reutilice el componente ya compartido.
- Añadir un comando compartido `openCategorySheet(mode, draft?)` en el `CategoriesStore` para que `CategoriesPage` y el selector del NewTaskModal abran el mismo sheet sin duplicar el wiring.
- Quitar el FAB propio del editor en `CategoriesPage` y conservar el FAB de creación (punto 7 de la propuesta) más el botón de creación dentro del selector del NewTaskModal.
- Mover la acción de borrado al sheet en modo `Edit`: deja de ser un botón en la fila y pasa a un enlace inferior en color `--app-danger`.

## Capabilities

### New Capabilities

- `category-sheet`: sheet modal reutilizable con `mode = 'create' | 'edit'`, piezas locales `IconOption` y `ColorSwatch` enlazadas por DI al padre, preview en vivo y comandos `save`, `delete`, `dismiss`. Conforme a Figma `4:869` y `4:947`.

### Modified Capabilities

- `category-sections`: el formulario deja de vivir inline en la página y pasa al sheet; el campo Sección se conserva como cuarta fila. El requisito CAT-SEC-01 sigue vigente sin cambios de contrato.
- `app-base`: la página Categorías usa el sheet para crear y editar; el FAB de creación se mantiene; los botones inline de borrar y los selects de `kind`/`colorToken` desaparecen.

## Impact

Toca `CategoriesPage`, `TasksPage` (selector de categoría del NewTaskModal), `ChipComponent` (extensión con icono proyectado), `CategoriesStore` (nuevo comando `openCategorySheet`), `CategoriesRepository` (sin cambios de contrato) y los estilos globales solo donde se referencia el sheet. Nodos: [`4:869`](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869) y [`4:947`](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-947). La fila de Notion de este change no está en `docs/workflow-mcp.md`; se crea al tener el servidor Notion.