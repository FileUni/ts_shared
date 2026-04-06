import {
  DEFAULT_LOCALE,
  LOCALE_METADATA,
  type SupportedLocale,
} from './locales';

const BASE_LOCALE_MAP: Record<string, SupportedLocale> = {
  en: 'en',
  zh: 'zh-CN',
  es: 'es',
  de: 'de',
  fr: 'fr',
  ru: 'ru',
  ja: 'ja',
};

const normalizeRawLocale = (value: string): string => {
  return value.trim().toLowerCase().replace(/_/g, '-');
};

const CANONICAL_LOCALE_BY_NORMALIZED = Object.fromEntries(
  (Object.keys(LOCALE_METADATA) as SupportedLocale[]).map((locale) => [
    normalizeRawLocale(locale),
    locale,
  ]),
) as Record<string, SupportedLocale>;

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return typeof value === 'string' && normalizeLocale(value) !== null;
}

export function normalizeLocale(value: string | null | undefined): SupportedLocale | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = normalizeRawLocale(value);
  if (!normalized) {
    return null;
  }

  const canonical = CANONICAL_LOCALE_BY_NORMALIZED[normalized];
  if (canonical) {
    return canonical;
  }

  for (const locale of Object.keys(LOCALE_METADATA) as SupportedLocale[]) {
    if (LOCALE_METADATA[locale].aliases.includes(normalized)) {
      return locale;
    }
  }

  const base = normalized.split('-')[0] || DEFAULT_LOCALE;
  return BASE_LOCALE_MAP[base] ?? null;
}

export function detectLocale(value: string | null | undefined): SupportedLocale {
  return normalizeLocale(value) ?? DEFAULT_LOCALE;
}

export function detectLocaleFromNavigator(
  language: string | null | undefined,
  languages?: readonly string[] | null | undefined,
): SupportedLocale {
  const candidates = [language, ...(languages || [])];
  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}
