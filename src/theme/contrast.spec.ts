import { compileString } from 'sass';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TOKENS_PATH = resolve(__dirname, '_tokens.scss');
const VARIABLES_PATH = resolve(__dirname, 'variables.scss');

function compileTheme(): { css: string } {
  const source = `${readFileSync(TOKENS_PATH, 'utf8')}\n${readFileSync(VARIABLES_PATH, 'utf8')}`;
  return compileString(source, { loadPaths: [resolve(__dirname)] });
}

function readHex(css: string, name: string): string {
  const match = css.match(new RegExp(`--app-${name}:\\s*(#[0-9a-f]{3,8})`));
  if (!match || !match[1]) {
    throw new Error(`Variable --app-${name} no encontrada.`);
  }
  return match[1].toLowerCase();
}

function expandHex(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : value.slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = expandHex(hex);
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(foreground: string, background: string): number {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const [lighter, darker] = fg >= bg ? [fg, bg] : [bg, fg];
  return (lighter + 0.05) / (darker + 0.05);
}

describe('UI-21.3 Contraste y excepción auditada', () => {
  const css = compileTheme().css;

  it('reaches AA contrast (>= 4.5) for the audited Figma pairs', () => {
    const auditedPairs: ReadonlyArray<{
      foreground: string;
      background: string;
    }> = [
      { foreground: 'on-primary', background: 'primary' },
      { foreground: 'text', background: 'surface' },
      { foreground: 'text', background: 'surface-muted' },
    ];

    for (const { foreground, background } of auditedPairs) {
      const ratio = contrastRatio(
        readHex(css, foreground),
        readHex(css, background),
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps the Figma dark text-muted on dark surface as an accepted exception', () => {
    // Decisión consciente de Pedro (16-oct) registrada en Notion C0.5 y en
    // docs/auditoria-figma.md: fidelidad a Figma por encima de WCAG AA para
    // este token. Aproximadamente 3:1 sobre #1E1A2B; no se declara AA y no se
    // usa para información crítica.
    const darkSurface = '#1e1a2b';
    const darkMuted = '#6b6580';
    const ratio = contrastRatio(darkMuted, darkSurface);
    expect(ratio).toBeGreaterThan(0);
    expect(ratio).toBeLessThan(4.5);
  });
});
