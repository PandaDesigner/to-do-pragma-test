# Verificación del cambio init

Este cambio entrega solo configuración reproducible y arranque mínimo. La
funcionalidad de producto queda en `feature/app-base`.

## Comprobaciones

- `npm test`: verde con pruebas de configuración, página mínima y AppComponent.
- `npm run lint`: verde.
- `npm run typecheck`: verde.
- `npm run build -- --configuration production`: verde.
- `ionic serve --no-open`: arranca en `http://localhost:8100/` y sirve `app-root`.

## Versiones

| Componente | Versión |
| --- | --- |
| Node | 24.15.0 (`.nvmrc`) |
| npm | 11 |
| @ionic/angular | 8.8.19 |
| Angular | 22.2.3 |
| Cordova | 13.0.0 |
| Jest | 30.5.2 |
| jest-preset-angular | 17.0.3 |

## Limitaciones

- `init` no implementa dominio, stores, páginas funcionales ni UI de producto.
- `app-base` extenderá los requisitos INIT-06..INIT-09 con la lógica de negocio.
- La auditoría de npm sigue mostrando avisos sin corrección compatible en esta
  ventana; ver `docs/` y OpenSpec.
