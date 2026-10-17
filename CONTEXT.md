# Vocabulario

## Fecha de vencimiento

`dueDate` es el día calendario en que vence una tarea. No representa una hora ni un instante UTC.

_Avoid_: `dueAt` para la fecha de vencimiento.

## Categoría de lista

Una categoría de tipo `list` agrupa tareas de una lista general; se distingue de los tipos `daily` y `shopping`.

_Avoid_: `default` como nombre del tipo de categoría.

## Sección de categoría

Cada categoría pertenece a General, Routine o Event. Sus tareas pertenecen a esa sección por su asignación a la categoría, independientemente de si están completadas. La sección es distinta del tipo de categoría y de su color; Todo reúne las tareas de todas las secciones.

_Avoid_: color o tipo como sinónimos de sección; «tarea marcada» para referirse a una tarea asignada a una categoría.
