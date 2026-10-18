export const APP_LANGUAGE = {
  ES: 'es',
  EN: 'en',
} as const;

export type AppLanguage = (typeof APP_LANGUAGE)[keyof typeof APP_LANGUAGE];

const APP_LANGUAGES = Object.values(APP_LANGUAGE);

export function languageFromDevice(language: string | undefined): AppLanguage {
  if (language?.toLowerCase().startsWith(APP_LANGUAGE.ES)) {
    return APP_LANGUAGE.ES;
  }
  return APP_LANGUAGE.EN;
}

export function parseAppLanguage(value: string): AppLanguage {
  if (!APP_LANGUAGES.includes(value as AppLanguage)) {
    throw new Error(`Idioma desconocido: ${value}`);
  }
  return value as AppLanguage;
}
