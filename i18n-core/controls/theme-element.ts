import {
  applyBrowserTheme,
  parseBrowserThemePreference,
  resolveBrowserThemePreference,
  type ThemeApplyStrategy,
} from '../theme/browser';
import { getNextBinaryTheme } from '../theme/toggle';

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

      const parseStoredTheme = () =>
        parseBrowserThemePreference(cookieApi.read(config.themeCookieKey)) || 'auto';

      const applyStoredTheme = () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        applyBrowserTheme(
          document,
          config.themeStrategy,
          resolveBrowserThemePreference(parseStoredTheme(), mediaQuery.matches),
        );
      };

      applyStoredTheme();

      const button = this.querySelector<HTMLButtonElement>(config.buttonSelector);
      if (button) {
        button.addEventListener('click', () => {
          const current =
            config.themeStrategy === 'class-dark'
              ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
              : (document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light');
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
