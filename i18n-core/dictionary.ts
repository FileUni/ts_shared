import { DEFAULT_LOCALE, type SupportedLocale } from './locales';

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
    readonly [Locale in Exclude<SupportedLocale, 'en'>]: LocaleShape<Base>;
  },
) {
  return bundle;
}

export function pickLocale<T>(bundle: Record<SupportedLocale, T>, locale: SupportedLocale): T {
  return bundle[locale] ?? bundle[DEFAULT_LOCALE];
}
