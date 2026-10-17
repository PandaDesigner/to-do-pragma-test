import { formatDayTitle, formatLongDate } from './day-title';

describe('day title', () => {
  it('formats a local Monday as 23.Mon', () => {
    expect(formatDayTitle('2026-02-23')).toBe('23.Mon');
    expect(formatLongDate('2026-02-23')).toBe('February 23');
  });

  it('rejects a date that is not a calendar day', () => {
    expect(() => formatDayTitle('23.Mon')).toThrow('Fecha inválida: 23.Mon');
  });
});
