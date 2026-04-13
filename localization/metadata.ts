export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = ['en', 'zh-CN', 'zh-Hant', 'es', 'de', 'fr', 'ru', 'ja'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type LocaleMetadata = {
  readonly label: string;
  readonly nativeLabel: string;
  readonly flag: string;
  readonly htmlLang: string;
  readonly ogLocale: string;
  readonly pathPrefix: string;
  readonly dateLocale: string;
  readonly aliases: readonly string[];
};

const joinLocale = (language: string, subtag: string, separator: '-' | '_'): string => {
  return `${language}${separator}${subtag}`;
};

const joinChineseLocale = (subtag: string): string => {
  return joinLocale('zh', subtag, '-');
};

const joinChineseOgLocale = (region: string): string => {
  return joinLocale('zh', region, '_');
};

export const LOCALE_METADATA = {
  en: {
    label: 'English',
    nativeLabel: 'English',
    flag: '🇬🇧',
    htmlLang: 'en',
    ogLocale: 'en_US',
    pathPrefix: '',
    dateLocale: 'en-US',
    aliases: ['en-us', 'en-gb', 'en-au', 'en-ca'],
  },
  'zh-CN': {
    label: '简体中文',
    nativeLabel: '简体中文',
    flag: '🇨🇳',
    htmlLang: 'zh-CN',
    ogLocale: joinChineseOgLocale('CN'),
    pathPrefix: '/zh-CN',
    dateLocale: 'zh-CN',
    aliases: ['zh', joinChineseLocale('Hans'), joinChineseLocale('SG')],
  },
  'zh-Hant': {
    label: '繁體中文',
    nativeLabel: '繁體中文',
    flag: '🇹🇼',
    htmlLang: 'zh-Hant',
    ogLocale: joinChineseOgLocale('TW'),
    pathPrefix: '/zh-Hant',
    dateLocale: 'zh-TW',
    aliases: [joinChineseLocale('Hant'), joinChineseLocale('TW'), joinChineseLocale('HK'), joinChineseLocale('MO')],
  },
  es: {
    label: 'Español',
    nativeLabel: 'Español',
    flag: '🇪🇸',
    htmlLang: 'es',
    ogLocale: 'es_ES',
    pathPrefix: '/es',
    dateLocale: 'es-ES',
    aliases: ['es-es', 'es-mx', 'es-ar', 'es-cl', 'es-co'],
  },
  de: {
    label: 'Deutsch',
    nativeLabel: 'Deutsch',
    flag: '🇩🇪',
    htmlLang: 'de',
    ogLocale: 'de_DE',
    pathPrefix: '/de',
    dateLocale: 'de-DE',
    aliases: ['de-de', 'de-at', 'de-ch'],
  },
  fr: {
    label: 'Français',
    nativeLabel: 'Français',
    flag: '🇫🇷',
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    pathPrefix: '/fr',
    dateLocale: 'fr-FR',
    aliases: ['fr-fr', 'fr-ca', 'fr-be', 'fr-ch'],
  },
  ru: {
    label: 'Русский',
    nativeLabel: 'Русский',
    flag: '🇷🇺',
    htmlLang: 'ru',
    ogLocale: 'ru_RU',
    pathPrefix: '/ru',
    dateLocale: 'ru-RU',
    aliases: ['ru-ru'],
  },
  ja: {
    label: '日本語',
    nativeLabel: '日本語',
    flag: '🇯🇵',
    htmlLang: 'ja',
    ogLocale: 'ja_JP',
    pathPrefix: '/ja',
    dateLocale: 'ja-JP',
    aliases: ['ja-jp'],
  },
} satisfies Record<SupportedLocale, LocaleMetadata>;

export const SUPPORTED_LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);
