import { compileString } from 'sass';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DARK_PATH = resolve(__dirname, '_dark.scss');
const VARIABLES_PATH = resolve(__dirname, 'variables.scss');

function compileTheme(): { css: string } {
  const dark = readFileSync(DARK_PATH, 'utf8');
  const variables = readFileSync(VARIABLES_PATH, 'utf8');
  // `variables.scss` ya hace `@use 'tokens' as t`; concateno solo el resto.
  return compileString(`${variables}\n${dark}`, {
    loadPaths: [resolve(__dirname)],
  });
}

describe('UI-22 Paleta oscura verificable', () => {
  const css = compileTheme().css;

  it('exposes the Figma 4:1560 dark palette under prefers-color-scheme: dark', () => {
    expect(css).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
    expect(css).toMatch(/--app-primary:\s*#8b7fc0/);
    expect(css).toMatch(/--app-primary-dark:\s*#edeaf5/);
    expect(css).toMatch(/--app-text:\s*#edeaf5/);
    expect(css).toMatch(/--app-surface:\s*#1e1a2b/);
  });

  it('keeps the system preference as the only dark activation path', () => {
    expect(css).not.toMatch(/ion-palette-dark/);
  });
});
