## ADDED Requirements

### Requirement: INIT-01 Instalación reproducible

El proyecto MUST usar Ionic 8, Angular standalone 18 o superior compatible con Node, TypeScript strict y un lockfile npm. MUST instalar SignalStore, Ionic Storage, driver SQLite, Firebase y CDK sin activar servicios externos. MUST conservar `docs/` y OpenSpec.

#### Scenario: INIT-01-A Instalación limpia

- **GIVEN** una copia del repositorio con la versión de Node documentada
- **WHEN** se ejecuta `npm ci`
- **THEN** las dependencias se instalan sin ignorar conflictos de peer dependencies.

### Requirement: INIT-02 Cordova sin Capacitor

La configuración MUST habilitar Cordova, incluir CLI local y plugin SQLite, y excluir dependencias Capacitor. Las plataformas generadas MUST quedar fuera de Git.

#### Scenario: INIT-02-A Integración elegida

- **GIVEN** la configuración inicial
- **WHEN** se ejecutan los tests de configuración
- **THEN** confirman Cordova, identificador de app y plugin SQLite sin Capacitor.

### Requirement: INIT-03 Arranque mínimo

La app MUST montar `ion-app`, resolver la ruta inicial mediante carga diferida y mostrar una página mínima de Todo Notebook. Sus componentes MUST ser standalone y OnPush. No MUST afirmar funcionalidad CRUD todavía inexistente.

#### Scenario: INIT-03-A Página inicial

- **GIVEN** el componente raíz y las rutas configuradas
- **WHEN** se monta la app y se abre la ruta inicial
- **THEN** existe el contenedor Ionic y se muestra Todo Notebook sin requerir credenciales Firebase.

### Requirement: INIT-04 Calidad antes de publicar

El proyecto MUST ofrecer comandos de tests Jest sin navegador, lint, formato, tipos y build de producción. Los alias de capas MUST coincidir con la guía. La configuración propia MUST desarrollarse con un fallo observado antes de su implementación; el scaffolding generado se valida sin atribuirle TDD retroactivo.

#### Scenario: INIT-04-A Verificación local y CI

- **GIVEN** dependencias instaladas
- **WHEN** se ejecutan los comandos documentados
- **THEN** pruebas, lint, formato, tipos y build pasan; CI repite estos controles para PR a develop y main.

#### Scenario: INIT-04-B Prueba de configuración detecta regresión

- **GIVEN** el test de configuración y una integración Cordova ausente
- **WHEN** se ejecuta ese test antes de configurar la integración
- **THEN** falla por el requisito ausente y pasa después de implementarlo.

### Requirement: INIT-05 Publicación trazable y segura

Git MUST usar `main`, `develop` y `feature/init` con historia común y remoto HTTPS al repositorio público autorizado. El PR MUST apuntar a `develop`, enlazar este cambio y detallar escenarios, comprobaciones y limitaciones. MUST excluir dependencias instaladas, builds, entornos privados y credenciales.

#### Scenario: INIT-05-A Avance publicado

- **GIVEN** el repositorio público PandaDesigner/to-do-pragma-test
- **WHEN** se publica el cambio init
- **THEN** las ramas remotas existen y un PR feature/init hacia develop describe INIT-01 a INIT-05 y su evidencia.

#### Scenario: INIT-05-B Entornos privados excluidos

- **GIVEN** archivos locales de entorno y plataformas generadas
- **WHEN** se comprueba la lista de archivos versionados
- **THEN** no incluye esos archivos ni secretos; incluye ejemplos sin credenciales.
