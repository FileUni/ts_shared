export {
  DEFAULT_LOCALE,
  LOCALE_METADATA,
  SUPPORTED_LOCALES,
  SUPPORTED_LOCALE_SET,
  type LocaleMetadata,
  type SupportedLocale,
} from '../locale/locales';
export { detectLocale, detectLocaleFromNavigator, isSupportedLocale, normalizeLocale } from '../locale/detect';
export {
  getAlternateLocaleEntries,
  getLocaleFromPathname,
  getPathBasedLocaleOptions,
  stripLocalePrefix,
  translatePathWithLocale,
} from '../locale/paths';
export { defineLocaleBundle, pickLocale, type LocaleMessageValue, type LocaleShape } from '../locale/dictionary';
export {
  AUTO_LOCALE_PREFERENCE,
  FILEUNI_LANGUAGE_STORAGE_KEY,
  FILEUNI_LANG_COOKIE_KEY,
  getFileUniCookieDomain,
  parseLocalePreference,
  resolveLocalePreference,
  type LocalePreference,
} from '../locale/preferences';
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
} from '../controls/ui';
export {
  createDisclosureState,
  reduceDisclosureState,
  type DisclosureAction,
  type DisclosureState,
} from '../controls/disclosure';
export { getNextBinaryTheme, type BinaryTheme } from '../theme/toggle';
export {
  applyClassDarkTheme,
  parseThemePreference,
  resolveThemePreference,
  type ThemePreference,
} from '../theme/preference';
export {
  buildThemeHeadBootstrap,
  type ThemeHeadBootstrap,
  type ThemeHeadBootstrapOptions,
} from '../theme/head';
export {
  buildLocalePath,
  getLocaleFromPath,
  isLocaleRootPath,
  readCookieValue,
  stripLocalePrefixFromPath,
  writeCookieValue,
  type LocalePathOption,
} from '../locale/browser';
export { attachDropdownMenu, mountPathLocaleDropdown } from '../controls/dropdown';
export { definePathLocaleDropdownElement } from '../controls/language-element';
export { defineBinaryThemeToggleElement } from '../controls/theme-element';
export { observeColorSchemePreference, observeDocumentAttribute } from '../controls/observe';
export {
  applyBrowserTheme,
  initPathLocaleThemeBootstrap,
  parseBrowserThemePreference,
  resolveBrowserThemePreference,
  type BrowserThemePreference,
  type ThemeApplyStrategy,
} from '../theme/browser';
export { buildLocaleUrl } from '../locale/urls';
export { getSiteChromeMeta, type SiteChromeLocale, type SiteChromeMeta } from '../locale/site-chrome';
export { toTraditionalChineseDeep, toTraditionalChineseString } from '../locale/traditional-chinese';
