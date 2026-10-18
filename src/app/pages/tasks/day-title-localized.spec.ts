import { formatDayTitle, formatLongDate } from './day-title';

describe('DATE-FILTER-00 Título del día localizado', () => {
  it('[TODO-01.3] el nombre del dia sale en espanol, no fijo en ingles', () => {
    // 2026-10-18 es domingo.
    expect(formatDayTitle('2026-10-18', 'es')).toBe('18.dom');
    expect(formatDayTitle('2026-10-18', 'en')).toBe('18.Sun');
  });

  it('[TODO-01.2] el formato en ingles conserva la medida de Figma 4:440', () => {
    // 2026-02-23 es lunes.
    expect(formatDayTitle('2026-02-23', 'en')).toBe('23.Mon');
  });

  it('[TODO-01.3] el nombre del mes sale en espanol y en ingles', () => {
    expect(formatLongDate('2026-02-23', 'es')).toBe('23 de febrero');
    expect(formatLongDate('2026-02-23', 'en')).toBe('February 23');
  });

  it('[TODO-01.3] un idioma no soportado cae al respaldo en ingles', () => {
    expect(formatDayTitle('2026-10-18', 'xx-YY')).toBe('18.Sun');
    expect(formatLongDate('2026-02-23', 'xx-YY')).toBe('February 23');
  });

  it('[TODO-01.2] sigue rechazando una fecha que no es un dia de calendario', () => {
    expect(() => formatDayTitle('23.Mon', 'en')).toThrow(
      'Fecha inválida: 23.Mon',
    );
  });

  it('[TODO-01.2] construye la fecha en hora local, sin desfase de un dia', () => {
    // Si se parseara en UTC, una zona negativa retrocederia al 22.
    expect(formatDayTitle('2026-01-01', 'es')).toBe('1.jue');
  });
});
