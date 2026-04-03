export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = ['en', 'zh-cn', 'es', 'de', 'fr', 'ru', 'ja'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type LocaleMetadata = {
  readonly label: string;
  readonly flag: string;
  readonly htmlLang: string;
  readonly ogLocale: string;
  readonly pathPrefix: string;
  readonly dateLocale: string;
  readonly aliases: readonly string[];
};

export const LOCALE_METADATA = {
  en: {
    label: 'English',
    flag: '🇬🇧',
    htmlLang: 'en',
    ogLocale: 'en_US',
    pathPrefix: '',
    dateLocale: 'en-US',
    aliases: ['en-us', 'en-gb', 'en-au', 'en-ca'],
  },
  'zh-cn': {
    label: '简体中文',
    flag: '🇨🇳',
    htmlLang: 'zh-CN',
    ogLocale: 'zh_CN',
    pathPrefix: '/zh-cn',
    dateLocale: 'zh-CN',
    aliases: ['zh', 'zh-hans', 'zh-sg', 'zh-cn'],
  },
  es: {
    label: 'Español',
    flag: '🇪🇸',
    htmlLang: 'es',
    ogLocale: 'es_ES',
    pathPrefix: '/es',
    dateLocale: 'es-ES',
    aliases: ['es-es', 'es-mx', 'es-ar', 'es-cl', 'es-co'],
  },
  de: {
    label: 'Deutsch',
    flag: '🇩🇪',
    htmlLang: 'de',
    ogLocale: 'de_DE',
    pathPrefix: '/de',
    dateLocale: 'de-DE',
    aliases: ['de-de', 'de-at', 'de-ch'],
  },
  fr: {
    label: 'Français',
    flag: '🇫🇷',
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    pathPrefix: '/fr',
    dateLocale: 'fr-FR',
    aliases: ['fr-fr', 'fr-ca', 'fr-be', 'fr-ch'],
  },
  ru: {
    label: 'Русский',
    flag: '🇷🇺',
    htmlLang: 'ru',
    ogLocale: 'ru_RU',
    pathPrefix: '/ru',
    dateLocale: 'ru-RU',
    aliases: ['ru-ru'],
  },
  ja: {
    label: '日本語',
    flag: '🇯🇵',
    htmlLang: 'ja',
    ogLocale: 'ja_JP',
    pathPrefix: '/ja',
    dateLocale: 'ja-JP',
    aliases: ['ja-jp'],
  },
} satisfies Record<SupportedLocale, LocaleMetadata>;

export const SUPPORTED_LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);
