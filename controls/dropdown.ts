import { normalizeLocale } from '../locale/detect';
import { buildLocalePath, writeCookieValue, type LocalePathOption } from '../locale/browser';

export type { LocalePathOption } from '../locale/browser';

import { createDisclosureState, reduceDisclosureState } from './disclosure';

export function attachDropdownMenu(
  root: HTMLElement,
  config: {
    triggerSelector: string;
    menuSelector: string;
    itemSelector: string;
    onSelect: (item: HTMLElement) => void;
  },
): () => void {
  const trigger = root.querySelector<HTMLElement>(config.triggerSelector);
  const menu = root.querySelector<HTMLElement>(config.menuSelector);
  const items = Array.from(root.querySelectorAll<HTMLElement>(config.itemSelector));
  if (!trigger || !menu || items.length === 0) {
    return () => {};
  }

  let state = createDisclosureState(false);

  const syncMenu = () => {
    menu.hidden = !state.open;
    trigger.setAttribute('aria-expanded', state.open ? 'true' : 'false');
  };

  const closeMenu = () => {
    state = reduceDisclosureState(state, { type: 'close' });
    syncMenu();
  };

  const handleTriggerClick = () => {
    state = reduceDisclosureState(state, { type: 'toggle' });
    syncMenu();
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (!(event.target instanceof Node) || root.contains(event.target)) {
      return;
    }
    closeMenu();
  };

  const handleRootKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeMenu();
      trigger.focus();
    }
  };

  trigger.addEventListener('click', handleTriggerClick);
  document.addEventListener('click', handleDocumentClick);
  root.addEventListener('keydown', handleRootKeydown);
  syncMenu();
  for (const item of items) {
    item.addEventListener('click', () => {
      config.onSelect(item);
      closeMenu();
    });
  }

  return () => {
    trigger.removeEventListener('click', handleTriggerClick);
    document.removeEventListener('click', handleDocumentClick);
    root.removeEventListener('keydown', handleRootKeydown);
  };
}

export function mountPathLocaleDropdown(root: HTMLElement, config: {
  localeOptions: readonly LocalePathOption[];
  langCookieKey: string;
  cookieMaxAgeSeconds: number;
  triggerSelector: string;
  menuSelector: string;
  itemSelector: string;
}): () => void {
  return attachDropdownMenu(root, {
    triggerSelector: config.triggerSelector,
    menuSelector: config.menuSelector,
    itemSelector: config.itemSelector,
    onSelect: (item) => {
      const nextLang = normalizeLocale(item.dataset['langValue']);
      if (!nextLang) {
        return;
      }
      writeCookieValue(document, window.location, config.langCookieKey, nextLang, config.cookieMaxAgeSeconds);
      const targetPath = buildLocalePath(window.location.pathname, nextLang, config.localeOptions);
      if (targetPath !== window.location.pathname) {
        window.location.pathname = targetPath;
      }
    },
  });
}
