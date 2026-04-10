import { normalizeLocale } from './detect';
import { DEFAULT_LOCALE, LOCALE_METADATA, type SupportedLocale } from './locales';

function normalizePath(pathname = ''): string {
  const trimmed = String(pathname).trim();
  if (!trimmed || trimmed === '/') {
    return '/';
  }
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
}

export function buildLocaleUrl(origin: string, locale: SupportedLocale, pathname = '/'): string {
  const normalizedLocale = normalizeLocale(locale) ?? DEFAULT_LOCALE;
  const prefix = LOCALE_METADATA[normalizedLocale].pathPrefix || LOCALE_METADATA[DEFAULT_LOCALE].pathPrefix;
  const normalizedPath = normalizePath(pathname);
  if (normalizedPath === '/') {
    return `${origin}${prefix || '/'}`;
  }
  return `${origin}${prefix}${normalizedPath}`;
}
