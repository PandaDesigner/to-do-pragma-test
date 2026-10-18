import { pageCount } from './pagination';

describe('pageCount', () => {
  it.each([
    [0, 1],
    [20, 1],
    [21, 2],
    [40, 2],
    [41, 3],
    [61, 4],
  ])('returns %i pages when total is %i', (total, expected) => {
    expect(pageCount(total, 20)).toBe(expected);
  });

  it('returns 1 when total is below size', () => {
    expect(pageCount(1, 20)).toBe(1);
    expect(pageCount(19, 20)).toBe(1);
  });

  it('rounds up partial pages', () => {
    expect(pageCount(39, 20)).toBe(2);
    expect(pageCount(99, 20)).toBe(5);
    expect(pageCount(100, 20)).toBe(5);
  });

  it('keeps the math consistent with PAGE_SIZE', () => {
    expect(pageCount(60, 20)).toBe(3);
    expect(pageCount(80, 20)).toBe(4);
  });

  it('treats non-positive size as 1 (no division by zero)', () => {
    expect(pageCount(0, 0)).toBe(1);
    expect(pageCount(5, -1)).toBe(5);
  });
});
