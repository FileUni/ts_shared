import { DEFAULT_LOCALE, LOCALE_METADATA, SUPPORTED_LOCALES, type SupportedLocale } from './locales';

const withLeadingSlash = (value: string): string => {
  if (!value) {
    return '/';
  }
  return value.startsWith('/') ? value : `/${value}`;
};

const withTrailingSlash = (value: string): string => {
  if (value === '/') {
    return '/';
  }
  return value.endsWith('/') ? value : `${value}/`;
};

const normalizePathname = (value: string): string => {
  const normalized = withLeadingSlash(value.trim() || '/').replace(/\/+/g, '/');
  return normalized === '' ? '/' : normalized;
};

export function getLocaleFromPathname(pathname: string): SupportedLocale {
  const normalizedPath = normalizePathname(pathname);
  for (const locale of SUPPORTED_LOCALES) {
    const prefix = LOCALE_METADATA[locale].pathPrefix;
    if (!prefix) {
      continue;
    }
    if (normalizedPath === prefix || normalizedPath === `${prefix}/`) {
      return locale;
    }
    if (normalizedPath.startsWith(`${prefix}/`)) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  const normalizedPath = normalizePathname(pathname);
  for (const locale of SUPPORTED_LOCALES) {
    const prefix = LOCALE_METADATA[locale].pathPrefix;
    if (!prefix) {
      continue;
    }
    if (normalizedPath === prefix || normalizedPath === `${prefix}/`) {
      return '/';
    }
    if (normalizedPath.startsWith(`${prefix}/`)) {
      const stripped = normalizedPath.slice(prefix.length);
      return stripped || '/';
    }
  }
  return normalizedPath;
}

export function translatePathWithLocale(pathname: string, locale: SupportedLocale): string {
  const basePath = stripLocalePrefix(pathname);
  const prefix = LOCALE_METADATA[locale].pathPrefix;
  if (!prefix) {
    return withTrailingSlash(basePath);
  }
  if (basePath === '/') {
    return `${prefix}/`;
  }
  return withTrailingSlash(`${prefix}${basePath}`);
}

export function getAlternateLocaleEntries(pathname: string) {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    pathname: translatePathWithLocale(pathname, locale),
  }));
}

export function getPathBasedLocaleOptions() {
  return SUPPORTED_LOCALES.map((locale) => ({
    code: locale,
    label: LOCALE_METADATA[locale].label,
    flag: LOCALE_METADATA[locale].flag,
    pathPrefix: LOCALE_METADATA[locale].pathPrefix,
  }));
}
