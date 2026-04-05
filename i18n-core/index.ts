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
  FILEUNI_LANGUAGE_MENU_CLASSNAMES,
  FILEUNI_CONTROL_METRICS,
  FILEUNI_ICON_BUTTON_CLASSNAMES,
  FILEUNI_TRANSLATION_ICON_PATHS,
  FILEUNI_THEME_TOGGLE_CLASSNAMES,
  LOCALE_PICKER_OPTIONS,
  getLocaleFlag,
  getLocaleNativeLabel,
  getLocalePickerOption,
  type LocalePickerOption,
} from './ui';
export {
  createDisclosureState,
  getNextBinaryTheme,
  reduceDisclosureState,
  type BinaryTheme,
  type DisclosureAction,
  type DisclosureState,
} from './headless';
export {
  attachDropdownMenu,
  buildLocalePath,
  getLocaleFromPath,
  isLocaleRootPath,
  readCookieValue,
  stripLocalePrefixFromPath,
  writeCookieValue,
  type LocalePathOption,
} from './browser-client';
export {
  applyBrowserTheme,
  initPathLocaleThemeBootstrap,
  mountPathLocaleDropdown,
  parseBrowserThemePreference,
  resolveBrowserThemePreference,
  type BrowserThemePreference,
  type ThemeApplyStrategy,
} from './browser-bootstrap';
export { buildLocaleUrl } from './urls';
export { getSiteChromeMeta, type SiteChromeLocale, type SiteChromeMeta } from './site-chrome';
export { toTraditionalChineseDeep, toTraditionalChineseString } from './traditional-chinese';
