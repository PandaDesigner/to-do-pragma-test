## 1. Diseño

- [x] 1.1 Leer `get_design_context` y `get_variable_defs` de 4:440, 4:520, 4:664, 4:973 y 4:1062.
- [x] 1.2 Escribir proposal, design y specs.

## 2. Rail y cabecera

- [x] 2.1 RED: test de TODO-01.1 que falle porque el rail de cinco pestañas no existe.
- [x] 2.2 GREEN: rail en el shell, con Routine y Event deshabilitadas, y sin `ion-tab-bar`.
- [ ] 2.3 RED: test de TODO-01.2 que falle porque la fecha no sale del reloj.
- [ ] 2.4 GREEN: cabecera `23.Mon` y badge de hoy con los tokens del design.

## 3. Lista, panel y vacío

- [ ] 3.1 RED: tests de TODO-02.1 y TODO-02.2 para el panel abierto y cerrado.
- [ ] 3.2 GREEN: panel en left 62, top 187, ancho 300, cabecera 60 y cerrado de 62.
- [ ] 3.3 RED: test de TODO-03.1 para el tachado y el checkbox marcado.
- [ ] 3.4 GREEN: ajustar `TaskItem` sin copiarlo.
- [ ] 3.5 RED: test de TODO-04.1 para el filtro por chip.
- [ ] 3.6 GREEN: extraer `chip` y usarlo en la página.
- [ ] 3.7 RED: test de TODO-05.1 para el estado vacío.
- [ ] 3.8 GREEN: extraer `empty-state` y sustituir también el de Categorías.

## 4. Alta, sheet y depuración

- [ ] 4.1 RED: tests de TODO-06.1 y TODO-06.2 para el alta rápida y el modal.
- [ ] 4.2 GREEN: quitar el editor incrustado, crear la tarea de hoy y abrir `ion-modal`.
- [ ] 4.3 RED: tests de SET-02.1 y APP-11 para el botón ausente en tareas y presente en Ajustes.
- [ ] 4.4 GREEN: mover la depuración a Ajustes.
- [ ] 4.5 Extraer `page-header` y usarlo en Ajustes y Categorías.

## 5. Cierre

- [ ] 5.1 Exportar los iconos de Figma a `src/assets/icon` y quitar literales visuales.
- [ ] 5.2 Capturas 375x812 en claro y oscuro, es y en, con diff visual en `verify-report.md`.
- [ ] 5.3 Actualizar `openspec/traceability.md` y la fila de Notion, o anotar que el servidor no está conectado.
- [ ] 5.4 Pasar tipos, lint, estilos, tests con cobertura, build, `trace:check` y `openspec validate --strict`.
