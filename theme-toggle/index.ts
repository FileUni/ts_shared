import {
  applyBrowserTheme,
  parseBrowserThemePreference,
  type ThemeApplyStrategy,
} from '../theme-system/browser-theme';
import { getNextBinaryTheme } from '../theme-system/binary-toggle';
import { LOCALE_MENU_METRICS } from '../language-menu/base';

export const THEME_TOGGLE_CLASSNAMES = {
  button: 'h-9 w-10 rounded-xl border inline-flex items-center justify-center transition-all',
  dark: 'bg-white/5 border-white/10 hover:bg-white/10',
  light: 'bg-gray-100 border-gray-200 hover:bg-gray-200',
} as const;

export function createThemeToggleControlStyle(): string {
  return [
    `--fu-control-size:${LOCALE_MENU_METRICS.buttonSizePx}px`,
    `--fu-control-min-height:${LOCALE_MENU_METRICS.buttonMinHeightPx}px`,
    `--fu-control-radius:${LOCALE_MENU_METRICS.borderRadiusPx}px`,
    `--fu-control-icon-size:${LOCALE_MENU_METRICS.iconSizePx}px`,
  ].join(';');
}

type ThemeCookieApi = {
  read: (name: string) => string | null;
  write: (name: string, value: string) => void;
};

export function defineBinaryThemeToggleElement(config: {
  tagName: string;
  buttonSelector: string;
  themeCookieKey: string;
  themeStrategy: ThemeApplyStrategy;
  getCookieApi: () => ThemeCookieApi | null;
}) {
  if (customElements.get(config.tagName)) {
    return;
  }

  class BinaryThemeToggleElement extends HTMLElement {
    connected = false;

    connectedCallback() {
      if (this.connected) {
        return;
      }
      this.connected = true;

      const cookieApi = config.getCookieApi();
      if (!cookieApi) {
        return;
      }

      const parseStoredTheme = () => parseBrowserThemePreference(cookieApi.read(config.themeCookieKey)) || 'auto';

      const applyStoredTheme = () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const storedTheme = parseStoredTheme();
        applyBrowserTheme(
          document,
          config.themeStrategy,
          storedTheme === 'auto'
            ? mediaQuery.matches
              ? 'dark'
              : 'light'
            : storedTheme,
        );
      };

      applyStoredTheme();

      const button = this.querySelector<HTMLButtonElement>(config.buttonSelector);
      if (button) {
        button.addEventListener('click', () => {
          const current =
            config.themeStrategy === 'class-dark'
              ? document.documentElement.classList.contains('dark')
                ? 'dark'
                : 'light'
              : document.documentElement.dataset['theme'] === 'dark'
                ? 'dark'
                : 'light';
          const next = getNextBinaryTheme(current);
          cookieApi.write(config.themeCookieKey, next);
          applyBrowserTheme(document, config.themeStrategy, next);
        });
      }

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (parseStoredTheme() === 'auto') {
          applyStoredTheme();
        }
      });
    }
  }

  customElements.define(config.tagName, BinaryThemeToggleElement);
}

export { createReactBinaryThemeToggleComponent, type ReactBinaryThemeToggleProps } from './react-theme-toggle';
