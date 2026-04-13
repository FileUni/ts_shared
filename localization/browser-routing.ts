import { DEFAULT_LOCALE, type SupportedLocale } from './metadata';
import { getFileUniCookieDomain } from './preference';

export type LocalePathOption = {
  readonly code: SupportedLocale;
  readonly pathPrefix: string;
};

export function readCookieValue(cookieSource: string, name: string): string | null {
  const prefix = `${name}=`;
  for (const rawCookie of cookieSource.split(';')) {
    const cookie = rawCookie.trim();
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.slice(prefix.length));
    }
  }
  return null;
}

export function writeCookieValue(
  documentRef: Document,
  locationRef: Location,
  name: string,
  value: string,
  maxAgeSeconds: number,
): void {
  const domain = getFileUniCookieDomain(locationRef.hostname);
  const domainPart = domain ? `; domain=${domain}` : '';
  const securePart = locationRef.protocol === 'https:' ? '; Secure' : '';
  documentRef.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${securePart}${domainPart}`;
}

export function stripLocalePrefixFromPath(pathname: string, options: readonly LocalePathOption[]): string {
  for (const option of options) {
    if (!option.pathPrefix) {
      continue;
    }
    if (pathname === option.pathPrefix) {
      return '/';
    }
    if (pathname.startsWith(`${option.pathPrefix}/`)) {
      const stripped = pathname.slice(option.pathPrefix.length);
      return stripped || '/';
    }
  }
  return pathname;
}

export function getLocaleFromPath(
  pathname: string,
  options: readonly LocalePathOption[],
  defaultLocale: SupportedLocale = DEFAULT_LOCALE,
): SupportedLocale {
  const matched = options.find(
    (option) => option.pathPrefix && (pathname === option.pathPrefix || pathname.startsWith(`${option.pathPrefix}/`)),
  );
  return matched?.code ?? defaultLocale;
}

export function buildLocalePath(
  pathname: string,
  locale: SupportedLocale,
  options: readonly LocalePathOption[],
): string {
  const target = options.find((option) => option.code === locale);
  if (!target) {
    return pathname;
  }
  const basePath = stripLocalePrefixFromPath(pathname, options);
  if (!target.pathPrefix) {
    return basePath;
  }
  return basePath === '/' ? `${target.pathPrefix}/` : `${target.pathPrefix}${basePath}`;
}

export function isLocaleRootPath(pathname: string, options: readonly LocalePathOption[]): boolean {
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return options.some((option) => {
    const localePath = option.pathPrefix || '/';
    const normalizedLocalePath = localePath.endsWith('/') ? localePath : `${localePath}/`;
    return normalizedPath === normalizedLocalePath;
  });
}
