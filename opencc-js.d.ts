declare module 'opencc-js/cn2t' {
  export const ConverterFactory: (
    from: unknown,
    to: unknown,
    customDicts?: ReadonlyArray<ReadonlyArray<readonly [string, string]>>,
  ) => (value: string) => string;
  export const Locale: {
    from: {
      cn: unknown;
    };
    to: {
      twp: unknown;
    };
  };
}
