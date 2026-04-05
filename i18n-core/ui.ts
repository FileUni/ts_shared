import { LOCALE_METADATA, SUPPORTED_LOCALES, type SupportedLocale } from './locales';

export type LocalePickerOption = {
  readonly code: SupportedLocale;
  readonly flag: string;
  readonly label: string;
  readonly nativeLabel: string;
  readonly pathPrefix: string;
  readonly htmlLang: string;
};

export const LOCALE_PICKER_OPTIONS: readonly LocalePickerOption[] = SUPPORTED_LOCALES.map((locale) => ({
  code: locale,
  flag: LOCALE_METADATA[locale].flag,
  label: LOCALE_METADATA[locale].label,
  nativeLabel: LOCALE_METADATA[locale].nativeLabel,
  pathPrefix: LOCALE_METADATA[locale].pathPrefix,
  htmlLang: LOCALE_METADATA[locale].htmlLang,
}));

export function getLocalePickerOption(locale: SupportedLocale): LocalePickerOption {
  return LOCALE_PICKER_OPTIONS.find((option) => option.code === locale) ?? LOCALE_PICKER_OPTIONS[0]!;
}

export function getLocaleFlag(locale: SupportedLocale): string {
  return getLocalePickerOption(locale).flag;
}

export function getLocaleNativeLabel(locale: SupportedLocale): string {
  return getLocalePickerOption(locale).nativeLabel;
}

export const FILEUNI_LANGUAGE_MENU_CLASSNAMES = {
  trigger:
    'h-9 w-10 rounded-xl border inline-flex items-center justify-center transition-all',
  triggerDark: 'bg-white/5 border-white/10 hover:bg-white/10',
  triggerLight: 'bg-gray-100 border-gray-200 hover:bg-gray-200',
  menu:
    'absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl overflow-hidden z-50',
  menuDark: 'bg-zinc-950 border-white/10',
  menuLight: 'bg-white border-gray-200',
  item:
    'w-full text-left px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap',
  itemActiveDark: 'bg-white/10',
  itemActiveLight: 'bg-gray-100',
  itemIdleDark: 'hover:bg-white/5',
  itemIdleLight: 'hover:bg-gray-50',
} as const;
