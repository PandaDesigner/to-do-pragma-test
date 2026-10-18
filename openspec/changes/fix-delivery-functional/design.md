## Decisiones

| Responsabilidad | Quién | Por qué | Alternativa descartada |
| --- | --- | --- | --- |
| Saber qué sección muestra una página | La página, con la sección de su ruta | El store raíz se queda con la última pestaña cacheada | Reescribir la sección solo en `ionViewWillEnter` |
| Filtrar sin categorías | El panel de pendientes, encima del filtro que ya tenía | La lista conserva `filterTasksBySection` con catálogo vacío | Reemplazar el filtro de la lista |
| Abrir borrar en la fila | `ion-item-sliding` | Figma 4:1404 y `docs/design.md` | Handler de puntero |
| Confirmar el borrado | `DeletionConfirmation` | Ya existe | Otro diálogo |
| Mostrar el flag en pantalla | Nadie | El texto técnico ensucia la demo | Token de modo desarrollo |
| Avisar un fallo remoto | `ion-toast` | No intercepta el FAB | Panel fijo |

## CRC

| Clase | Responsabilidades | Colaboradores |
| --- | --- | --- |
| `TaskItemComponent` | Fila y opción de borrar | `ion-item-sliding`, salida `remove` |
| `DeletionConfirmation` | Diálogo traducido | `AlertController`, `TranslateService` |
| `TaskStore` / `TasksPage` | Lista filtrada por sección y página | `filterTasksBySection` |
| `RemoteConfigService` | Una lectura y dos signals | `RemoteConfigPort` |
| `ShellComponent` | Toast de error, sin banner fijo | `ToastController` |
| `SettingsPage` | Debug real y borrado confirmado | `DeletionConfirmation` |
| `CategoryStore` | Borrar categoría y soltar tareas | `TaskStore.clearCategory` |

## Fuente Figma

| Nodo | Pantalla |
| --- | --- |
| [4:1404](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1404) | Confirmar borrado |
| [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520) | Lista y paginador |
| [4:1062](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1062) | Vacío |
| [4:1113](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1113) | Flag de categorías apagado |
| [4:1496](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1496) | Ajustes |
| [4:788](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-788) | Lista de categorías |
| [4:869](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869) | Hoja de categoría |

## Mapeo

`--app-swipe-action-width` = 80px, opción de 4:1404. El resto de este corte reutiliza tokens ya existentes.

## Riesgo

Remote Config y el store de tareas son compartidos. Revertir es volver `fix/delivery-functional`. El gesto real no se mide en Jest: el test comprueba que la opción existe y que el clic emite `remove`.
