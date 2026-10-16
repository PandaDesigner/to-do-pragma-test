# Verificación parcial de app-base

Rama de continuación: `feature/app-base-2`, creada desde `develop`. Este informe no declara completo el cambio ni autoriza fusionarlo o archivarlo.

## Tarea 1.1: modelos y State

Se adoptó el modelo de `docs/PROMPT.md` sin compatibilidad ni migración del modelo anterior, según confirmación del usuario. Dominio define contratos, reloj y error; las clases State y su máquina están en `data/states/`. El reloj se inyecta por llamada. Las nueve transiciones válidas actualizan `updatedAt`; RESCHEDULE usa el día local del reloj. Los quince pares estado/evento restantes y EXPIRE sin vencimiento lanzan `InvalidTransitionError`.

Evidencia RED: el test State falló por ausencia del módulo requerido. El test de categoría también falló al esperar `list` y recibir `default`. Después de implementar, las 31 pruebas de la máquina pasaron. No se atribuye TDD retroactivo al código previo.

Se adaptaron los fixtures y el ordenamiento al `dueDate` obligatorio aprobado. Los casos límite adicionales de estrategias y la extracción de tokens Angular corresponden a las tareas 1.2 y 1.3.

La comprobación raíz primero reprodujo TS5101. Se retiró `baseUrl`, se hicieron relativos los aliases y se eliminaron las supresiones de deprecaciones. Después se detectaron tipos Jest/Node ausentes en la configuración raíz con TS 6: se declararon explícitamente, manteniendo `types: []` para la app.

Comprobaciones ejecutadas:

- `npx tsc --noEmit`: correcto.
- `npm run typecheck`: correcto para app y pruebas.
- `npm run lint`: correcto.
- `npm test -- --coverage --collectCoverageFrom='src/app/domain/**/*.ts' --collectCoverageFrom='src/app/data/states/**/*.ts' --coverageThreshold='{"global":{"statements":95,"branches":95,"functions":95,"lines":95}}'`: 11 suites, 73 pruebas correctas; 100% en statements, branches, functions y lines de domain y State. Este alcance no demuestra los umbrales de todo data o store.
- `openspec validate app-base --type change --strict`: correcto. La ejecución inicial sin `--type change` se rechazó por ambigüedad con la spec principal del mismo nombre.
- `npx ionic build`: correcto; 484,58 kB iniciales. Advierte navegadores antiguos no soportados en Browserslist; no se cambió esa configuración.
- Prettier aplicado a los archivos modificados; `git diff --check`: correcto.

## Pendientes de entrega

Stores, persistencia completa, Remote Config, UI, generación masiva, thresholds permanentes, CI, documentación final y APK firmado/IPA siguen sujetos a sus tareas. No se ha abierto ni fusionado un PR en esta continuación.

No existe `docs/ci-cd-propuesta.md` en el árbol inspeccionado. Será necesario resolver esa fuente antes de implementar el workflow solicitado. Los archivos locales de limpieza y las copias de archivo preexistentes no forman parte de esta implementación.
