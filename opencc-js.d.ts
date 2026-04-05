declare module 'opencc-js/cn2t' {
  export const ConverterFactory: (...args: unknown[]) => (value: string) => string;
  export const Locale: {
    from: Record<string, unknown>;
    to: Record<string, unknown>;
  };
}
