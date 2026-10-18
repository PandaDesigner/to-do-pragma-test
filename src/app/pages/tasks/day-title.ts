const FALLBACK_LOCALE = 'en';

/**
 * Idiomas que la app puede traducir (src/assets/i18n). Intl no lanza con un
 * idioma desconocido: cae al idioma del sistema, que en esta maquina es el
 * espanol y devolveria 'dom' donde se espera 'Sun'. Por eso el idioma se
 * valida contra esta lista antes de construir el formateador.
 */
const APP_LOCALES = ['en', 'es'] as const;

function resolveLocale(locale: string): string {
  if (typeof locale !== 'string' || locale.length === 0) {
    return FALLBACK_LOCALE;
  }
  const language = locale.split('-')[0]?.toLowerCase() ?? '';
  return (APP_LOCALES as readonly string[]).includes(language)
    ? language
    : FALLBACK_LOCALE;
}

function formatter(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(resolveLocale(locale), options);
}

/**
 * Construye la fecha en hora local a proposito. `new Date('2026-02-23')` se
 * interpretaria como UTC y en zonas negativas retrocederia un dia.
 */
export function parseLocalIsoDate(isoDate: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error(`Fecha inválida: ${isoDate}`);
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatDayTitle(
  isoDate: string,
  locale: string = FALLBACK_LOCALE,
): string {
  const date = parseLocalIsoDate(isoDate);
  return `${date.getDate()}.${formatter(locale, { weekday: 'short' }).format(date)}`;
}

export function formatLongDate(
  isoDate: string,
  locale: string = FALLBACK_LOCALE,
): string {
  const date = parseLocalIsoDate(isoDate);
  return formatter(locale, { month: 'long', day: 'numeric' }).format(date);
}
