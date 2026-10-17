## 1. Diseño

- [x] 1.1 Leer `get_design_context` y `get_variable_defs` de 4:440, 4:520, 4:664, 4:973 y 4:1062.
- [x] 1.2 Escribir proposal, design y specs.

## 2. Rail y cabecera

- [x] 2.1 RED: test de TODO-01.1 que falle porque el rail de cinco pestañas no existe.
- [x] 2.2 GREEN: rail en el shell, con Routine y Event deshabilitadas, y sin `ion-tab-bar`.
- [x] 2.3 RED: test de TODO-01.2 que falle porque la fecha no sale del reloj.
- [x] 2.4 GREEN: cabecera `23.Mon` y badge de hoy con los tokens del design.

## 3. Lista, panel y vacío

- [x] 3.1 RED: tests de TODO-02.1 y TODO-02.2 para el panel abierto y cerrado.
- [x] 3.2 GREEN: panel en left 62, top 187, ancho 300, cabecera 60 y cerrado de 62.
- [x] 3.3 RED: test de TODO-03.1 para el tachado y el checkbox marcado.
- [x] 3.4 GREEN: ajustar `TaskItem` sin copiarlo.
- [x] 3.5 RED: test de TODO-04.1 para el filtro por chip.
- [x] 3.6 GREEN: extraer `chip` y usarlo en la página.
- [x] 3.7 RED: test de TODO-05.1 para el estado vacío.
- [x] 3.8 GREEN: extraer `empty-state` y sustituir también el de Categorías.

## 4. Alta, sheet y depuración

- [x] 4.1 RED: tests de TODO-06.1 y TODO-06.2 para el alta rápida y el modal.
- [x] 4.2 GREEN: quitar el editor incrustado, crear la tarea de hoy y abrir `ion-modal`.
- [x] 4.3 RED: tests de SET-02.1 y APP-11 para el botón ausente en tareas y presente en Ajustes.
- [x] 4.4 GREEN: mover la depuración a Ajustes.
- [x] 4.5 Extraer `page-header` y usarlo en Ajustes y Categorías.
- [ ] 4.6 Registrar primero en Figma el fondo de acciones oscuro aprobado `#786AAD`, mantener acentos y paleta clara, y sincronizar la app con prueba de contraste mínimo 4,5:1. Bloqueado por cuota de Figma MCP; no se ha aplicado el token.

## 4A. Ampliación aprobada: Routine y Event

- [x] 4.7 Documentar categorías General/Routine/Event, rutas, estados visibles, flag y alta contextual; actualizar glosario.
- [x] 4.8 RED: pruebas de CAT-SEC-01.1 a CAT-SEC-01.4 para sección, compatibilidad y validación.
- [x] 4.9 GREEN: sección persistida en categoría y selector en su formulario, independiente del color y tipo.
- [ ] 4.10 RED: pruebas de TODO-07.1 a TODO-08.2 para navegación, listas, panel, estados y guard.
- [ ] 4.11 GREEN: rutas propias y rail activo, filtros por sección, completadas visibles y desactivación con el flag.
- [ ] 4.12 RED: pruebas de TODO-09.1 a TODO-09.4 para creación contextual y sección sin categorías.
- [ ] 4.13 GREEN: alta con categoría de sección, título conservado y validación sin pérdida de datos.
- [ ] 4.14 Verificar recorridos y persistencia en navegador, idiomas/temas, virtualización y pruebas completas; guardar evidencia.

## 5. Cierre

- [ ] 5.1 Exportar los iconos de Figma a `src/assets/icon` y quitar literales visuales.
- [ ] 5.2 Capturas 375x812 en claro y oscuro, es y en, con diff visual en `verify-report.md`.
- [ ] 5.3 Actualizar `openspec/traceability.md` y la fila de Notion, o anotar que el servidor no está conectado.
- [ ] 5.4 Pasar tipos, lint, estilos, tests con cobertura, build, `trace:check` y `openspec validate --strict`.
- [ ] 5.5 Actualizar README con rutas, secciones, filtros, idiomas, feature flag, comandos y limitaciones verificadas.
