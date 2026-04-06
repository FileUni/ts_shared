export {
  DEFAULT_LOCALE,
  LOCALE_METADATA,
  SUPPORTED_LOCALES,
  SUPPORTED_LOCALE_SET,
  type LocaleMetadata,
  type SupportedLocale,
} from './locales';
export { detectLocale, detectLocaleFromNavigator, isSupportedLocale, normalizeLocale } from './detect';
export {
  getAlternateLocaleEntries,
  getLocaleFromPathname,
  getPathBasedLocaleOptions,
  stripLocalePrefix,
  translatePathWithLocale,
} from './paths';
export { defineLocaleBundle, pickLocale, type LocaleMessageValue, type LocaleShape } from './dictionary';
export {
  AUTO_LOCALE_PREFERENCE,
  FILEUNI_LANGUAGE_STORAGE_KEY,
  FILEUNI_LANG_COOKIE_KEY,
  getFileUniCookieDomain,
  parseLocalePreference,
  resolveLocalePreference,
  type LocalePreference,
} from './preferences';
export {
  buildLocalePath,
  getLocaleFromPath,
  isLocaleRootPath,
  readCookieValue,
  stripLocalePrefixFromPath,
  writeCookieValue,
  type LocalePathOption,
} from './browser';
export { buildLocaleUrl } from './urls';
export { getSiteChromeMeta, type SiteChromeLocale, type SiteChromeMeta } from './site-chrome';
export { toTraditionalChineseDeep, toTraditionalChineseString } from './traditional-chinese';
