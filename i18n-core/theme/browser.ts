import { DEFAULT_LOCALE, type SupportedLocale } from '../locale/locales';
import { normalizeLocale } from '../locale/detect';
import {
  buildLocalePath,
  getLocaleFromPath,
  isLocaleRootPath,
  readCookieValue,
  writeCookieValue,
  type LocalePathOption,
} from '../locale/browser';

export type BrowserThemePreference = 'light' | 'dark' | 'auto';
export type ThemeApplyStrategy = 'class-dark' | 'data-theme';

export function parseBrowserThemePreference(
  value: string | null | undefined,
): BrowserThemePreference | null {
  if (value === 'light' || value === 'dark' || value === 'auto') {
    return value;
  }
  return null;
}

export function resolveBrowserThemePreference(
  preference: BrowserThemePreference,
  prefersDark: boolean,
): 'light' | 'dark' {
  if (preference === 'auto') {
    return prefersDark ? 'dark' : 'light';
  }
  return preference;
}

export function applyBrowserTheme(
  documentRef: Document,
  strategy: ThemeApplyStrategy,
  theme: 'light' | 'dark',
): void {
  if (strategy === 'class-dark') {
    documentRef.documentElement.classList.toggle('dark', theme === 'dark');
    return;
  }
  documentRef.documentElement.dataset['theme'] = theme;
}

export function initPathLocaleThemeBootstrap(config: {
  currentLocale: SupportedLocale;
  defaultLocale?: SupportedLocale;
  localeOptions: readonly LocalePathOption[];
  langCookieKey: string;
  themeCookieKey: string;
  cookieMaxAgeSeconds: number;
  themeStrategy: ThemeApplyStrategy;
  respectHash: boolean;
}): {
  parseLang: (value: string | null | undefined) => SupportedLocale | null;
  parseTheme: (value: string | null | undefined) => BrowserThemePreference | null;
  readCookie: (name: string) => string | null;
  writeCookie: (name: string, value: string) => void;
  theme: BrowserThemePreference;
} {
  const readCookie = (name: string) => readCookieValue(document.cookie, name);
  const writeCookie = (name: string, value: string) =>
    writeCookieValue(document, window.location, name, value, config.cookieMaxAgeSeconds);
  const parseLang = (value: string | null | undefined) => normalizeLocale(value);
  const parseTheme = parseBrowserThemePreference;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = (theme: BrowserThemePreference) => {
    applyBrowserTheme(
      document,
      config.themeStrategy,
      resolveBrowserThemePreference(theme, mediaQuery.matches),
    );
  };

  const currentTheme = parseTheme(readCookie(config.themeCookieKey)) || 'auto';
  if (!parseTheme(readCookie(config.themeCookieKey))) {
    writeCookie(config.themeCookieKey, 'auto');
  }
  applyTheme(currentTheme);

  mediaQuery.addEventListener('change', () => {
    const nextTheme = parseTheme(readCookie(config.themeCookieKey)) || 'auto';
    if (nextTheme === 'auto') {
      applyTheme(nextTheme);
    }
  });

  const defaultLocale = config.defaultLocale ?? DEFAULT_LOCALE;
  const currentLocale =
    parseLang(config.currentLocale) ??
    getLocaleFromPath(window.location.pathname, config.localeOptions, defaultLocale);
  const cookieLocale = parseLang(readCookie(config.langCookieKey));

  if (!cookieLocale) {
    writeCookie(config.langCookieKey, currentLocale);
  } else if (
    (!config.respectHash || !window.location.hash) &&
    isLocaleRootPath(window.location.pathname, config.localeOptions) &&
    cookieLocale !== currentLocale
  ) {
    const targetPath = buildLocalePath(window.location.pathname, cookieLocale, config.localeOptions);
    if (targetPath !== window.location.pathname) {
      window.location.replace(`${targetPath}${window.location.search}${window.location.hash}`);
    }
  }

  return {
    parseLang,
    parseTheme,
    readCookie,
    writeCookie,
    theme: currentTheme,
  };
}
