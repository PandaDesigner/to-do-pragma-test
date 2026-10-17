# category-sections Specification

## Purpose
TBD - created by archiving change todo-screen. Update Purpose after archive.
## Requirements
### Requirement: CAT-SEC-01 Sección explícita de categoría

Cada categoría MUST poder asignarse a General, Routine o Event, independientemente de su nombre, tipo y color. El formulario existente MUST ofrecer esa elección. Figma: 4:788 y 4:869; extensión funcional aprobada por el usuario.

#### Scenario: CAT-SEC-01.1 Guardar y editar la sección

- **GIVEN** el formulario de categoría, conforme a Figma 4:869
- **WHEN** se guarda una categoría con sección Routine o Event
- **THEN** esa sección se conserva en el store y repositorio
- **AND** al editar se muestra la sección guardada.

#### Scenario: CAT-SEC-01.2 Compatibilidad con categorías existentes

- **GIVEN** categorías persistidas antes de existir la sección
- **WHEN** se cargan
- **THEN** la sección ausente se interpreta como General
- **AND** no se borran ni reescriben automáticamente sus tareas o sus categorías.

#### Scenario: CAT-SEC-01.3 Nombre y color no determinan la sección

- **GIVEN** una categoría Routine con tareas asignadas, conforme a Figma 4:788
- **WHEN** se cambia su nombre o color
- **THEN** sigue perteneciendo a Routine
- **AND** al cambiar explícitamente su sección a Event sus tareas se muestran en Event sin modificar sus identificadores ni su asignación.

#### Scenario: CAT-SEC-01.4 Rechazar una sección desconocida

- **GIVEN** una categoría con una sección presente distinta de General, Routine o Event
- **WHEN** se intenta cargar o guardar
- **THEN** se informa del error sin publicar un estado de categorías inválido
- **AND** el error conserva el mecanismo de reintento existente.

