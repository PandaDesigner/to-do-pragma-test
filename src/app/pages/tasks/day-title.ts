const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function parseLocalIsoDate(isoDate: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error(`Fecha inválida: ${isoDate}`);
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatDayTitle(isoDate: string): string {
  const date = parseLocalIsoDate(isoDate);
  return `${date.getDate()}.${WEEKDAY[date.getDay()]}`;
}

export function formatLongDate(isoDate: string): string {
  const date = parseLocalIsoDate(isoDate);
  return `${MONTH[date.getMonth()]} ${date.getDate()}`;
}
