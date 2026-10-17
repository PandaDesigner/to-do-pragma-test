import en from '../../../assets/i18n/en.json';
import es from '../../../assets/i18n/es.json';

function keys(value: object, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, nested]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === 'object') {
      return keys(nested, path);
    }
    return [path];
  });
}

describe('settings translations', () => {
  it('keeps the same keys in Spanish and English', () => {
    expect(keys(es).sort()).toEqual(keys(en).sort());
  });
});
