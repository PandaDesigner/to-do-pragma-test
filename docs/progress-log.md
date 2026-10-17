# Registro de avance

- 2026-10-17: F0 `chore/align-docs` alinea reglas, auditoría, inventario y trazabilidad. `init` y `app-base` se archivan sin pisar specs porque sus deltas difieren del código. `trace:check` pasa para los 15 nodos registrados.
- 2026-10-17: F1 `theme-aliases` fusionado en el PR #9. Ajustes e idioma quedaron en `feature/i18n`.
- 2026-10-17: F2 `i18n` fusionado en el PR #11. La evidencia está en el archivo. El marco 4:1496 no cumple 2 px: faltan el rail, categorías y depuración. El siguiente change es `todo-screen`.
- 2026-10-17: hotfix loadMore + `chore/prettier-fmt` fusionados en el PR #30. develop estaba roto (`TS2339: loadMore()` no existía en `TasksPage`); el fix se cherry-pick desde PR #29 y se combina con el formato de 17 archivos para que `verify` pase en una operación. PR #29 cerrado como superseded. tests 46/46, `ng build` OK, `trace:check` limpio sobre develop post-merge.
