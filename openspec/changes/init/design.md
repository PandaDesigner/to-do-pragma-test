## Context

Solo existen documentos y OpenSpec. El usuario aprobó Gitflow clásico, Jest, scaffolding en init y el repositorio público PandaDesigner/to-do-pragma-test. Ionic CLI 7.2.1 ya está disponible; Node local es 26.8.1. El starter consultado declara Angular 22 e Ionic 9; la guía exige Ionic 8.

## Goals / Non-Goals

**Goals:** app mínima generada por CLI, dependencias coherentes, Cordova configurado, tests ejecutables, controles automatizados y publicación gradual.

**Non-Goals:** funcionalidad de tareas/categorías, diseño final, inicialización de Firebase, firma nativa y plataformas Android/iOS generadas.

## Decisions

- Generar el starter Angular standalone en directorio temporal con `ionic start`, sin dependencias ni Git. Copiar únicamente sus archivos nuevos a la raíz para preservar los documentos existentes. Mantener Angular del starter si satisface peers; fijar Ionic en major 8 según la guía. Node 26 está admitido por Angular 22; documentar una versión LTS compatible para CI y reproducción. El lockfile fija versiones efectivas y no se usa `--legacy-peer-deps`.
- Jest fue elegido explícitamente frente a Jasmine/Karma porque no requiere Chrome. Usar jest-preset-angular y jsdom; consultar los exports instalados antes de configurar el entorno. Separar tests Node de configuración y tests de componentes si sus entornos lo requieren.
- Mantener las capas documentadas mediante alias, sin implementar clases de negocio vacías. Montar solo componente raíz y página mínima. No configurar almacenamiento funcional ni Firebase todavía.
- CLI Ionic y Cordova locales para reproducibilidad; habilitar integración y registrar plugin SQLite. No agregar plataformas hasta su fase nativa.
- Inicializar `main` con documentación de origen; crear `develop` desde ese commit y `feature/init` desde develop. Publicar origen y avances SDD antes de la instalación, sin fusionar el PR automáticamente.
- CI utiliza Node compatible y ejecuta npm ci, tests, lint, formato, tipos y build. Los entornos reales permanecen ignorados; el build mínimo no importa entornos privados.

## Risks / Trade-offs

- Starter adelantado respecto a Ionic 8: validar peers al instalar y documentar versiones reales; detenerse ante incompatibilidad en vez de forzarla.
- Angular/Jest ESM: usar la configuración oficial del preset instalado y comprobar los componentes reales, no reemplazar sus pruebas por mocks vacíos.
- Build nativo necesita SDK y firma: no confundir integración Cordova con APK/IPA verificados.
- Repositorio público: revisar los archivos a publicar, ignorar entornos y artefactos antes del primer push.

## Migration Plan

No hay datos que migrar. La preparación se publica en una rama aislada; revertir init no afecta datos de usuarios. El historial documental de origen permanece intacto. Cada fase posterior requiere confirmación.

## Open Questions

Sin decisiones de producto abiertas para esta instalación. Las versiones efectivas y resultados de compatibilidad quedan en package-lock y verify-report; incompatibilidades son bloqueos, no permisos para cambiar el stack.
