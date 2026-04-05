import { DEFAULT_LOCALE, type SupportedLocale } from './locales';
import { toTraditionalChineseDeep } from './traditional-chinese';

const DERIVED_LOCALE_FALLBACKS = {
  'zh-Hant': 'zh-CN',
} as const satisfies Partial<Record<SupportedLocale, SupportedLocale>>;

type LocaleScalar = string | number | boolean | null;

export type LocaleMessageValue =
  | LocaleScalar
  | readonly LocaleMessageValue[]
  | { readonly [key: string]: LocaleMessageValue };

export type LocaleShape<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends null
        ? null
        : T extends readonly (infer U)[]
          ? readonly LocaleShape<U>[]
          : T extends object
            ? { readonly [K in keyof T]: LocaleShape<T[K]> }
            : never;

export function defineLocaleBundle<const Base extends Record<string, LocaleMessageValue>>(
  bundle: { readonly en: Base } & {
    readonly [Locale in Exclude<SupportedLocale, 'en'>]?: LocaleShape<Base>;
  },
) {
  const resolved = { ...(bundle as unknown as Record<SupportedLocale, LocaleShape<Base>>) };

  for (const [locale, fallbackLocale] of Object.entries(DERIVED_LOCALE_FALLBACKS) as Array<
    [SupportedLocale, SupportedLocale]
  >) {
    if (!resolved[locale] && resolved[fallbackLocale]) {
      resolved[locale] =
        locale === 'zh-Hant'
          ? toTraditionalChineseDeep(resolved[fallbackLocale])
          : resolved[fallbackLocale];
    }
  }

  return resolved as { readonly [Locale in SupportedLocale]: LocaleShape<Base> };
}

export function pickLocale<T>(bundle: Record<SupportedLocale, T>, locale: SupportedLocale): T {
  return bundle[locale] ?? bundle[DEFAULT_LOCALE];
}
