## 1. Especificación y publicación inicial

- [x] 1.1 Leer fuentes y resolver Gitflow, repositorio y runner de pruebas.
- [x] 1.2 Escribir propuesta, escenarios INIT-01 a INIT-05 y diseño antes del código.
- [x] 1.3 Validar OpenSpec, inicializar main/develop/feature/init y conectar origin.
- [x] 1.4 Publicar el avance SDD sin secretos ni artefactos generados.

## 2. Instalación reproducible

- [x] 2.1 Generar starter Ionic Angular standalone mediante CLI preservando docs.
- [x] 2.2 Instalar Ionic 8, Angular compatible, Cordova y dependencias requeridas con lockfile.
- [x] 2.3 Configurar Jest y escribir tests de configuración antes de implementar sus requisitos; registrar RED.
- [x] 2.4 Configurar Cordova/SQLite, alias, scripts y exclusiones; comprobar GREEN.

## 3. Arranque y calidad

- [x] 3.1 Escribir test de página mínima antes de cambiar la página generada y comprobar RED.
- [x] 3.2 Mostrar Todo Notebook con componentes standalone OnPush y comprobar GREEN.
- [x] 3.3 Configurar CI, README y plantilla PR con trazabilidad SDD/TDD.
- [x] 3.4 Revisar cambios y ejecutar formato, lint, tipos, tests, build y validación OpenSpec.

## 4. Entrega init

- [x] 4.1 Documentar evidencia, comandos, versiones y límites sin presentar scaffolding como app base.
- [x] 4.2 Subir commits de init y crear PR feature/init hacia develop sin fusionar ni archivar.

## 5. Ampliación funcional (in-app, no app base final)

- [x] 5.1 Modelos de dominio: Task, TaskStatus, Category, CategoryKind, transiciones permitidas y validación.
- [x] 5.2 Máquina de estados: estrategias pure para filtro y orden; pruebas con casos límite.
- [x] 5.3 Token y port de repositorios (InjectionTokens) para Task y Category con tests de contrato.
- [ ] 5.2 Máquina de estados: estrategias pure para filtro y orden; pruebas con casos límite.
- [ ] 5.4 Repositorios in-memory para tests; repositorio IonicStorageTaskRepository con persistencia y debounce 300 ms.
- [ ] 5.5 Stores con @ngrx/signals para tasks y categories; efectos de persistencia por Signal.
- [ ] 5.6 Core/config: RemoteConfigService con flag `enable_categories` (default true, timeout 3 s).
- [ ] 5.7 Decoradores `@Debounce(300)` y `@LogAction`; cobertura de pruebas para cada uno.
- [ ] 5.8 UI: páginas tasks y categories con container/presentational, OnPush, trackBy y virtual scroll desde 200.
- [ ] 5.9 Feature flag: ocultar pestaña Mis listas, chips y selector cuando `enable_categories=false`.
- [ ] 5.10 Botón debug que genera 5.000 tareas y mide primer render.
- [ ] 5.11 Workflow `verify.yml` con umbrales de cobertura: 80% global, 95% domain, 90% data y store.
- [ ] 5.12 README con respuestas del PDF, capturas y guía de build nativo (APK/IPA) sin firma.
