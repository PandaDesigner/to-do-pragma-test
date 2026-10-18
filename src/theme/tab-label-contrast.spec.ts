import { compileString } from 'sass';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function compileTheme(): string {
  const dark = readFileSync(resolve(__dirname, '_dark.scss'), 'utf8');
  const variables = readFileSync(resolve(__dirname, 'variables.scss'), 'utf8');
  return compileString(`${variables}\n${dark}`, {
    loadPaths: [resolve(__dirname)],
  }).css;
}

function railRule(): string {
  const scss = readFileSync(
    resolve(__dirname, '../app/layout/shell/side-tab-rail.component.scss'),
    'utf8',
  );
  const start = scss.indexOf('.rail-tab {');
  return scss.slice(start, scss.indexOf('}', start));
}

describe('UI-25 Contraste del texto de las pestañas', () => {
  it('[UI-25.2] la tinta de las pestañas usa un token propio, no la marca invertida', () => {
    expect(railRule()).toContain('color: var(--app-tab-label)');
    expect(railRule()).not.toContain('color: var(--app-primary-dark)');
  });

  it('[UI-25.2] la paleta oscura invierte la tinta de las pestañas a la tinta de texto', () => {
    const css = compileTheme();
    expect(css).toMatch(/--app-tab-label:\s*var\(--app-text\)/);
    expect(css).toMatch(
      /\.ion-palette-dark\s*\{[^}]*--app-tab-label:\s*var\(--app-text\)/,
    );
  });

  it('[UI-25.2] en claro la tinta de las pestañas sigue siendo la marca', () => {
    const variables = readFileSync(
      resolve(__dirname, 'variables.scss'),
      'utf8',
    );
    expect(variables).toMatch(/--app-tab-label:\s*#\{t\.\$color-primary-dark\}/);
  });

  it('[UI-25.2] la marca invertida se reserva a la marca y no se usa para el texto del rail', () => {
    const css = compileTheme();
    // El rail ya no debe depender de --app-primary-dark para su texto.
    expect(railRule()).not.toContain('--app-primary-dark');
    expect(css).toMatch(/--app-primary-dark:\s*#edeaf5/);
  });
});
