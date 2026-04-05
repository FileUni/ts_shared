export type DictLike = string | readonly (readonly [string, string])[];
export type DictGroup = readonly DictLike[];

export declare function ConverterFactory(...dictGroups: readonly DictGroup[]): (value: string) => string;

export declare const Locale: Readonly<{
  from: Readonly<{
    cn: DictGroup;
  }>;
  to: Readonly<{
    twp: DictGroup;
  }>;
}>;
