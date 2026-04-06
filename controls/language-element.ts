import { mountPathLocaleDropdown, type LocalePathOption } from './dropdown';

export function definePathLocaleDropdownElement(config: {
  tagName: string;
  localeOptions: readonly LocalePathOption[];
  langCookieKey: string;
  cookieMaxAgeSeconds: number;
  triggerSelector: string;
  menuSelector: string;
  itemSelector: string;
}) {
  if (customElements.get(config.tagName)) {
    return;
  }

  class PathLocaleDropdownElement extends HTMLElement {
    cleanup: (() => void) | null = null;

    connectedCallback() {
      if (this.cleanup) {
        return;
      }

      this.cleanup = mountPathLocaleDropdown(this, {
        localeOptions: config.localeOptions,
        langCookieKey: config.langCookieKey,
        cookieMaxAgeSeconds: config.cookieMaxAgeSeconds,
        triggerSelector: config.triggerSelector,
        menuSelector: config.menuSelector,
        itemSelector: config.itemSelector,
      });
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = null;
    }
  }

  customElements.define(config.tagName, PathLocaleDropdownElement);
}
