import * as fs from 'node:fs';
import * as path from 'node:path';

const IONIC_COLOR_KEYS = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'light',
  'medium',
  'dark',
] as const;

type IonicColorKey = (typeof IONIC_COLOR_KEYS)[number];

type IonicColorVariants = {
  base: string;
  baseRgb: string;
  contrast: string;
  contrastRgb: string;
  shade: string;
  tint: string;
};

function readIonicCoreCss(): string {
  const cssPath = path.join(
    __dirname,
    '..',
    '..',
    'node_modules',
    '@ionic',
    'core',
    'css',
    'core.css',
  );
  return fs.readFileSync(cssPath, 'utf8');
}

function extractIonicVariants(
  css: string,
  key: IonicColorKey,
): IonicColorVariants {
  const captureToken = (token: string): string => {
    const pattern = new RegExp(`${token}:\\s*([^;}]+)[;}]`);
    const match = css.match(pattern);
    if (match === null) {
      throw new Error(`Missing Ionic variant: ${token}`);
    }
    return match[1].trim();
  };
  const captureBase = (baseToken: string): string => {
    const pattern = new RegExp(`${baseToken}(?!-[a-z]):\\s*([^;}]+)[;}]`);
    const match = css.match(pattern);
    if (match === null) {
      throw new Error(`Missing Ionic base: ${baseToken}`);
    }
    return match[1].trim();
  };
  const baseToken = `--ion-color-${key}`;
  return {
    base: captureBase(baseToken),
    baseRgb: captureToken(`${baseToken}-rgb`),
    contrast: captureToken(`${baseToken}-contrast`),
    contrastRgb: captureToken(`${baseToken}-contrast-rgb`),
    shade: captureToken(`${baseToken}-shade`),
    tint: captureToken(`${baseToken}-tint`),
  };
}

const expected: Readonly<Record<IonicColorKey, IonicColorVariants>> = {
  primary: {
    base: '#0054e9',
    baseRgb: '0, 84, 233',
    contrast: '#fff',
    contrastRgb: '255, 255, 255',
    shade: '#004acd',
    tint: '#1a65eb',
  },
  secondary: {
    base: '#0163aa',
    baseRgb: '1, 99, 170',
    contrast: '#fff',
    contrastRgb: '255, 255, 255',
    shade: '#015796',
    tint: '#1a73b3',
  },
  tertiary: {
    base: '#6030ff',
    baseRgb: '96, 48, 255',
    contrast: '#fff',
    contrastRgb: '255, 255, 255',
    shade: '#542ae0',
    tint: '#7045ff',
  },
  success: {
    base: '#2dd55b',
    baseRgb: '45, 213, 91',
    contrast: '#000',
    contrastRgb: '0, 0, 0',
    shade: '#28bb50',
    tint: '#42d96b',
  },
  warning: {
    base: '#ffc409',
    baseRgb: '255, 196, 9',
    contrast: '#000',
    contrastRgb: '0, 0, 0',
    shade: '#e0ac08',
    tint: '#ffca22',
  },
  danger: {
    base: '#c5000f',
    baseRgb: '197, 0, 15',
    contrast: '#fff',
    contrastRgb: '255, 255, 255',
    shade: '#ad000d',
    tint: '#cb1a27',
  },
  light: {
    base: '#f4f5f8',
    baseRgb: '244, 245, 248',
    contrast: '#000',
    contrastRgb: '0, 0, 0',
    shade: '#d7d8da',
    tint: '#f5f6f9',
  },
  medium: {
    base: '#636469',
    baseRgb: '99, 100, 105',
    contrast: '#fff',
    contrastRgb: '255, 255, 255',
    shade: '#57585c',
    tint: '#737478',
  },
  dark: {
    base: '#222428',
    baseRgb: '34, 36, 40',
    contrast: '#fff',
    contrastRgb: '255, 255, 255',
    shade: '#1e2023',
    tint: '#383a3e',
  },
};

describe('Ionic color variants (UI-21.2)', () => {
  const css = readIonicCoreCss();

  it.each(IONIC_COLOR_KEYS)(
    'declares base, rgb, contrast, contrast-rgb, shade, tint for %s',
    (key) => {
      const actual = extractIonicVariants(css, key);
      expect(actual).toEqual(expected[key]);
    },
  );

  it('exposes the nine documented Ionic color keys', () => {
    const declared = IONIC_COLOR_KEYS.map(
      (key) => extractIonicVariants(css, key).base,
    );
    expect(declared).toEqual([
      '#0054e9',
      '#0163aa',
      '#6030ff',
      '#2dd55b',
      '#ffc409',
      '#c5000f',
      '#f4f5f8',
      '#636469',
      '#222428',
    ]);
  });
});
