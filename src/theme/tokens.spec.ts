import { compileString } from 'sass';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TOKENS_PATH = resolve(__dirname, '_tokens.scss');
const VARIABLES_PATH = resolve(__dirname, 'variables.scss');

type ColorChannel = number;
type SassColor = {
  r: ColorChannel;
  g: ColorChannel;
  b: ColorChannel;
  a: number;
};

function toChannels(value: SassColor): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  return {
    r: Math.round(value.r),
    g: Math.round(value.g),
    b: Math.round(value.b),
    a: Number(value.a.toFixed(2)),
  };
}

function compileTheme(): { css: string } {
  const tokens = readFileSync(TOKENS_PATH, 'utf8');
  const variables = readFileSync(VARIABLES_PATH, 'utf8');
  const source = `${tokens}\n${variables}`;
  return compileString(source, { loadPaths: [resolve(__dirname)] });
}

describe('UI-20 Tokens trazables y centralizados', () => {
  it('exposes the Figma light palette as CSS custom properties', () => {
    const compiled = compileTheme().css;
    expect(compiled).toMatch(/--app-primary:\s*#4b3f6b/);
    expect(compiled).toMatch(/--app-primary-dark:\s*#3a2e5c/);
    expect(compiled).toMatch(/--app-text:\s*#2e2547/);
    expect(compiled).toMatch(/--app-surface:\s*#fff/);
    expect(compiled).toMatch(/--app-danger:\s*#c5000f/);
  });

  it('exposes the Figma spacing scale as CSS custom properties', () => {
    const compiled = compileTheme().css;
    expect(compiled).toMatch(/--app-space-4:\s*4px/);
    expect(compiled).toMatch(/--app-space-8:\s*8px/);
    expect(compiled).toMatch(/--app-space-16:\s*16px/);
    expect(compiled).toMatch(/--app-space-32:\s*32px/);
  });

  it('exposes the Figma radius scale as CSS custom properties', () => {
    const compiled = compileTheme().css;
    expect(compiled).toMatch(/--app-radius-badge:\s*2px/);
    expect(compiled).toMatch(/--app-radius-checkbox:\s*3px/);
    expect(compiled).toMatch(/--app-radius-button:\s*6px/);
    expect(compiled).toMatch(/--app-radius-card:\s*10px/);
  });
});

describe('UI-21 Puente Ionic', () => {
  it('maps primary to Ionic variables with derived rgb and contrast', () => {
    const compiled = compileTheme().css;
    expect(compiled).toMatch(/--ion-color-primary:\s*#4b3f6b/);
    expect(compiled).toMatch(/--ion-color-primary-rgb:\s*75,\s*63,\s*107/);
    expect(compiled).toMatch(/--ion-color-primary-contrast:\s*#fff/);
    expect(compiled).toMatch(/--ion-color-primary-shade:\s*#3a2e5c/);
  });

  it('maps danger to the Figma value', () => {
    const compiled = compileTheme().css;
    expect(compiled).toMatch(/--ion-color-danger:\s*#c5000f/);
  });
});
