## 1. Dominio y estrategias

- [x] 1.1 Modelos canónicos de PROMPT (`dueDate`, timestamps, categoría nullable y kind `list`), máquina con clases State en `data/states/`, seis eventos, guard e `InvalidTransitionError`; tests RED→GREEN de las nueve transiciones válidas y todas las inválidas.
- [x] 1.2 Estrategias puras `filterTasks` y `sortTasksByDueDate` con tests de casos límite.
- [ ] 1.3 Contratos puros en domain y tokens `TASK_REPOSITORY` y `CATEGORY_REPOSITORY` en core/di, con tests de inyección y contrato.

## 2. Persistencia y stores

- [ ] 2.1 `IonicStorageTaskRepository` con persistencia y `@Debounce(300)` aplicado a `persist`.
- [ ] 2.2 Stores con `@ngrx/signals` para tareas y categorías.

## 3. Configuración y decoradores

- [ ] 3.1 `RemoteConfigService` con flag `enable_categories` (timeout 3 s, default `true`).
- [ ] 3.2 Decoradores `@Debounce` y `@LogAction` con tests unitarios.

## 4. UI funcional

- [ ] 4.1 Páginas `tasks` y `categories` con `OnPush`, `trackBy` y virtual scroll de CDK desde 200 tareas.
- [ ] 4.2 Shell con tabs y ocultación de "Mis listas" cuando `enable_categories=false`.
- [ ] 4.3 Botón debug que genera 5.000 tareas.
- [ ] 4.4 README con las tres respuestas del PDF, configuración de firma sin secretos y APK firmado e IPA generados.

## 5. Calidad y entrega

- [ ] 5.1 `jest.config.cjs` con thresholds 80/95/90/90.
- [ ] 5.2 `.github/workflows/verify.yml` con job `verify` según la propuesta CI, ejecutando `npm test -- --coverage` y build de producción.
- [ ] 5.3 `verify-report.md` con evidencia real.
- [ ] 5.4 PR `feature/app-base-2 → develop` abierto, sin fusionar ni archivar.
