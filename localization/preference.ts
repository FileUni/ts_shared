import { detectLocaleFromNavigator, normalizeLocale } from './detection';
import type { SupportedLocale } from './metadata';

export const AUTO_LANGUAGE_PREFERENCE = 'auto';
export const LANGUAGE_STORAGE_KEY = 'fileuni-language';
export const LANGUAGE_COOKIE_KEY = 'lang';

export type LocalePreference = SupportedLocale | typeof AUTO_LANGUAGE_PREFERENCE;

export function parseLocalePreference(value: string | null | undefined): LocalePreference | null {
  if (value === AUTO_LANGUAGE_PREFERENCE) {
    return AUTO_LANGUAGE_PREFERENCE;
  }
  return normalizeLocale(value);
}

export function resolveLocalePreference(
  preference: LocalePreference,
  language: string | null | undefined,
  languages?: readonly string[] | null | undefined,
): SupportedLocale {
  if (preference === AUTO_LANGUAGE_PREFERENCE) {
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
