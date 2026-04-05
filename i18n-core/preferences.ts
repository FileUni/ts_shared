import { detectLocaleFromNavigator, normalizeLocale } from './detect';
import type { SupportedLocale } from './locales';

export const AUTO_LOCALE_PREFERENCE = 'auto';
export const FILEUNI_LANGUAGE_STORAGE_KEY = 'fileuni-language';
export const FILEUNI_LANG_COOKIE_KEY = 'lang';

export type LocalePreference = SupportedLocale | typeof AUTO_LOCALE_PREFERENCE;

export function parseLocalePreference(value: string | null | undefined): LocalePreference | null {
  if (value === AUTO_LOCALE_PREFERENCE) {
    return AUTO_LOCALE_PREFERENCE;
  }
  return normalizeLocale(value);
}

export function resolveLocalePreference(
  preference: LocalePreference,
  language: string | null | undefined,
  languages?: readonly string[] | null | undefined,
): SupportedLocale {
  if (preference === AUTO_LOCALE_PREFERENCE) {
    return detectLocaleFromNavigator(language, languages);
  }
  return preference;
}

export function getFileUniCookieDomain(hostname: string): string | undefined {
  const normalizedHost = hostname.toLowerCase();
  if (normalizedHost === 'fileuni.com' || normalizedHost.endsWith('.fileuni.com')) {
    return '.fileuni.com';
  }
  if (!normalizedHost.endsWith('.workers.dev')) {
    return undefined;
  }

  const labels = normalizedHost.split('.');
  if (labels.length >= 5) {
    return `.${labels.slice(-4).join('.')}`;
  }
  if (labels.length === 4) {
    return `.${labels.slice(-3).join('.')}`;
  }
  return undefined;
}
