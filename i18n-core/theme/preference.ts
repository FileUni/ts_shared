export type ThemePreference = 'light' | 'dark' | 'auto';

export function parseThemePreference(value: string | null | undefined): ThemePreference | null {
  if (value === 'light' || value === 'dark' || value === 'auto') {
    return value;
  }
  return null;
}

export function resolveThemePreference(
  theme: ThemePreference,
  prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches,
): 'light' | 'dark' {
  if (theme === 'auto') {
    return prefersDark ? 'dark' : 'light';
  }
  return theme;
}

export function applyClassDarkTheme(documentRef: Document, theme: ThemePreference): void {
  documentRef.documentElement.classList.toggle('dark', resolveThemePreference(theme) === 'dark');
}
