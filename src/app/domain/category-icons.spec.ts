import {
  pickValue,
  resolveCategoryIcon,
  CATEGORY_ICONS,
} from './category-icons';

describe('pickValue', () => {
  it('returns the mapped value when the key is in the table', () => {
    const mapping: Readonly<Record<string, number>> = {
      routine: 2,
      event: 3,
    };
    const mappedNumber = pickValue<string, number>('routine', mapping, 5);
    expect(mappedNumber).toBe(2);
  });

  it('returns the fallback when the key is not in the table', () => {
    const mapping: Readonly<Record<string, number>> = { routine: 2 };
    const fallbackNumber = pickValue<string, number>('unknown', mapping, 5);
    expect(fallbackNumber).toBe(5);
  });

  it('preserves the type of the fallback even when the input is wider', () => {
    const mapping: Readonly<Record<string, number>> = { foo: 1 };
    const widenedFallback = pickValue<string, number>('nope', mapping, 99);
    expect(widenedFallback).toBe(99);
  });
});

describe('resolveCategoryIcon', () => {
  it('returns the first icon when the key is unknown', () => {
    const fallbackIcon = resolveCategoryIcon('does-not-exist');
    expect(fallbackIcon).toBe(CATEGORY_ICONS[0].icon);
  });

  it('returns the matching icon when the key exists', () => {
    const matchedIcon = resolveCategoryIcon('cart');
    expect(matchedIcon).toBe(CATEGORY_ICONS[0].icon);
  });
});
