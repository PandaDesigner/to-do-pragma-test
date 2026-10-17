import { compileString } from 'sass';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TYPOGRAPHY_PATH = resolve(__dirname, '_typography.scss');

const REQUIRED_FACES = [
  { family: 'Inter', weight: 400 },
  { family: 'Inter', weight: 600 },
  { family: 'Inter', weight: 700 },
  { family: 'DM Serif Display', weight: 400 },
] as const;

function compileTypography(): { css: string } {
  return compileString(readFileSync(TYPOGRAPHY_PATH, 'utf8'), {
    loadPaths: [resolve(__dirname)],
  });
}

function expectFontFace(css: string, family: string, weight: number): void {
  const blocks = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
  const familyPattern = new RegExp(
    `font-family:\\s*['"]?${family.replace(/\s/g, '\\s')}['"]?`,
  );
  const weightPattern = new RegExp(`font-weight:\\s*${weight}`);
  const face = blocks.find(
    (block) => familyPattern.test(block) && weightPattern.test(block),
  );
  if (!face) {
    throw new Error(`@font-face ausente para ${family} ${weight}.`);
  }
  expect(face).toBeDefined();
}

describe('UI-26.1 @font-face declarations', () => {
  it('declares Inter 400/600/700 and DM Serif Display 400 from local woff2', () => {
    const css = compileTypography().css;
    for (const { family, weight } of REQUIRED_FACES) {
      expectFontFace(css, family, weight);
    }
  });

  it('forbids a synthetic bold weight for DM Serif Display', () => {
    const css = compileTypography().css;
    expect(css).not.toMatch(/DM Serif Display[^}]*font-weight:\s*[56789]\d\d/);
  });
});
