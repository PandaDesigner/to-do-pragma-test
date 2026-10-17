# Fuentes de Todo Notebook

Fuentes usadas en Figma (archivo F6ztYiRO9b0xYZA38xSTIA) según `docs/design.json` (tokens.font y textStyles) y `design.md` del cambio theme-foundation:

| Familia | Pesos | Estilo | Uso |
|---|---|---|---|
| Inter | 400 (Regular), 600 (SemiBold), 700 (Bold) | normal; no se usa itálica | Body/* (Regular, Meta, Overline, Panel Title, Button, Tab, Badge, Task Title, Note Title) |
| DM Serif Display | 400 (Regular) | normal; es el único peso que existe. **No sintetizar negrita** | Display/Date (38), Display/Title (36) |

## Archivos
| Archivo | Tamaño | Origen |
|---|---|---|
| Inter-Regular.woff2 | 57400 B | google/fonts (OFL), ver Procedencia |
| Inter-SemiBold.woff2 | 59512 B | google/fonts (OFL), ver Procedencia |
| Inter-Bold.woff2 | 59456 B | google/fonts (OFL), ver Procedencia |
| DMSerifDisplay-Regular.woff2 | 28548 B | google/fonts (OFL), ver Procedencia |
| Inter-OFL.txt | licencia SIL OFL 1.1 de Inter | google/fonts ofl/inter/OFL.txt |
| DMSerifDisplay-OFL.txt | licencia SIL OFL 1.1 de DM Serif Display | google/fonts ofl/dmserifdisplay/OFL.txt |

## Procedencia y licencia (tarea 0.7)
- **Inter:** `https://github.com/google/fonts/raw/main/ofl/inter/Inter[opsz,wght].ttf`, versión 4.001 (git-66647c0bb), © 2016 The Inter Project Authors (https://github.com/rsms/inter). Licencia: **SIL Open Font License 1.1**. Las instancias estáticas wght 400/600/700 (opsz 14) se generaron con `fontTools.varLib.instancer`.
- **DM Serif Display:** `https://github.com/google/fonts/raw/main/ofl/dmserifdisplay/DMSerifDisplay-Regular.ttf`, versión 5.200, © 2014-2018 Adobe, Reserved Font Name 'Source'; © 2019 Google LLC. Licencia: **SIL Open Font License 1.1**.
- **Conversión:** `pyftsubset` (fontTools 4.65) a woff2 con brotli. Se conservan los subconjuntos Latin y Latin-ext: U+0000-00FF, U+0100-02AF, U+1E00-1EFF, puntuación U+2000-206F, €, ™ y similares, con todas las features OpenType. Al ser un subconjunto modificado, la OFL exige conservar la licencia junto a los archivos (hecho). Los nombres de fuente reservados no se cambian porque no se renombra la fuente.
- La OFL permite empaquetar las fuentes en la app (Cordova offline) y redistribuirlas, siempre junto a la licencia.
- SHA-256:
```
6a937b3870b05aaf43e9b1d7d40507ec21d811eb6715218087a3666a9d91e9e2  DMSerifDisplay-Regular.woff2
d2e62d214b0cea9d62fb27c3223989cc41dd983146e1dec92c7044a610ea3231  Inter-Bold.woff2
777122d6cb58d38da688c90be60dd30b621affe0d41e8057628c61a126d79977  Inter-Regular.woff2
5fe3c81bf7a2b62decc43f45ee73101444dc8ff99e1c5cfd37832a03de569cfc  Inter-SemiBold.woff2
```

## Snippet listo: `src/theme/_fonts.scss`
Las URLs son relativas a `src/theme/`. Este snippet no está aplicado en el tema: lo incorporará la sesión de implementación (tarea 4.2).
```scss
// src/theme/_fonts.scss — fuentes locales (Cordova offline). Licencias: src/assets/fonts/*-OFL.txt
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('../assets/fonts/Inter-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('../assets/fonts/Inter-SemiBold.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('../assets/fonts/Inter-Bold.woff2') format('woff2');
}
@font-face {
  font-family: 'DM Serif Display';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('../assets/fonts/DMSerifDisplay-Regular.woff2') format('woff2');
}

// Uso (tokens): --ion-font-family: 'Inter', -apple-system, Roboto, sans-serif;
//               --app-font-display: 'DM Serif Display', Georgia, serif;
// Títulos con DM Serif Display: font-weight: 400; font-synthesis: none;
```
Nota: con el builder `@angular/build`, las `url()` relativas en SCSS se resuelven respecto al archivo. Si el build las reescribe o las copia con hash, también se puede usar `url('/assets/fonts/…')`, ya que `src/assets` se publica tal cual. Hay que verificarlo con `npm run build` en la tarea 4.2.
