## Why

El repositorio contiene la prueba y referencias visuales, pero no una app ejecutable ni controles de calidad. La instalación inicial debe quedar reproducible y revisable antes de implementar funcionalidades.

## What Changes

- Generar con Ionic CLI una aplicación Angular standalone en la raíz, conservando `docs/` y OpenSpec, con Ionic 8 y Cordova, sin Capacitor.
- Instalar las dependencias requeridas: SignalStore, Ionic Storage, driver SQLite, Firebase y CDK; no activar servicios ni introducir credenciales.
- Configurar TypeScript strict, alias de capas, Jest, ESLint, Prettier, comprobación de tipos y build de producción.
- Añadir tests de arranque y configuración; desarrollar configuración propia con RED-GREEN-REFACTOR.
- Inicializar Gitflow, conectar el repositorio público autorizado y publicar avances en `feature/init`; abrir PR hacia `develop` con trazabilidad.

## Capabilities

### New Capabilities

- `project-bootstrap`: instalación reproducible, app mínima, Cordova, controles de calidad y publicación trazable.

### Modified Capabilities

Ninguna; no existen specs previas.

## Impact

Afecta configuración raíz, `src/`, scripts, CI, README y el cambio OpenSpec `init`. Repositorio autorizado: `PandaDesigner/to-do-pragma-test`. Rama `feature/init`, destino `develop`; `main` queda como rama de entregas y se crea un commit documental de origen para disponer de historial común.

No incluye CRUD, persistencia funcional, Remote Config activo, pantallas finales, builds nativos firmados ni otras fases. La app base requerida por la prueba se entregará como un cambio posterior; el scaffolding no se presentará como app funcional. Los tests se escriben durante cada cambio, no al final de la prueba.
