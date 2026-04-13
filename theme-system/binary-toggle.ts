export type BinaryTheme = 'light' | 'dark';

export function getNextBinaryTheme(theme: BinaryTheme): BinaryTheme {
  return theme === 'dark' ? 'light' : 'dark';
}
