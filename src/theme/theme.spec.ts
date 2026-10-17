import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ANGULAR_CONFIG = 'angular.json';
const REQUIRED_STYLE_ENTRIES = [
  'src/theme/global.scss',
  'src/theme/variables.scss',
] as const;

function readAngularStyles(): string[] {
  const config: { projects: { app: { architect: { build: { options: { styles: string[] } } } } } } = JSON.parse(
    readFileSync(resolve(__dirname, '..', '..', ANGULAR_CONFIG), 'utf8'),
  );
  return config.projects.app.architect.build.options.styles;
}

describe('UI-23 Entradas y módulos Sass', () => {
  it('declares the theme styles as the only global entries', () => {
    expect(readAngularStyles()).toEqual([...REQUIRED_STYLE_ENTRIES]);
  });

  it('does not import the legacy src/global.scss path', () => {
    const styles = readAngularStyles();
    expect(styles.some((entry) => entry === 'src/global.scss')).toBe(false);
  });
});
