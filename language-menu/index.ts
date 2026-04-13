import { LOCALE_METADATA, SUPPORTED_LOCALES, type SupportedLocale } from '../localization/metadata';
import { normalizeLocale } from '../localization/detection';
import {
  buildLocalePath,
  writeCookieValue,
  type LocalePathOption,
} from '../localization/browser-routing';

export type LocaleMenuOption = {
  readonly code: SupportedLocale;
  readonly flag: string;
  readonly label: string;
  readonly nativeLabel: string;
  readonly pathPrefix: string;
  readonly htmlLang: string;
};

export const LOCALE_MENU_OPTIONS: readonly LocaleMenuOption[] = SUPPORTED_LOCALES.map((locale) => ({
  code: locale,
  flag: LOCALE_METADATA[locale].flag,
  label: LOCALE_METADATA[locale].label,
  nativeLabel: LOCALE_METADATA[locale].nativeLabel,
  pathPrefix: LOCALE_METADATA[locale].pathPrefix,
  htmlLang: LOCALE_METADATA[locale].htmlLang,
}));

export function getLocaleMenuOption(locale: SupportedLocale): LocaleMenuOption {
  return LOCALE_MENU_OPTIONS.find((option) => option.code === locale) ?? LOCALE_MENU_OPTIONS[0]!;
}

export function getLocaleNativeLabel(locale: SupportedLocale): string {
  return getLocaleMenuOption(locale).nativeLabel;
}

export const LOCALE_MENU_METRICS = {
  buttonSizePx: 40,
  buttonMinHeightPx: 32,
  borderRadiusPx: 12,
  menuWidthPx: 224,
  iconSizePx: 18,
} as const;

export const LOCALE_MENU_TRANSLATION_ICON_PATHS = [
  'm5 8 6 6',
  'm4 14 6-6 2-3',
  'M2 5h12',
  'M7 2h1',
  'm22 22-5-10-5 10',
  'M14 18h6',
] as const;

export const LOCALE_MENU_CLASSNAMES = {
  trigger:
    'h-9 min-w-0 rounded-xl border inline-flex items-center justify-center gap-2 px-3 transition-all',
  triggerDark: 'bg-white/5 border-white/10 hover:bg-white/10',
  triggerLight: 'bg-gray-100 border-gray-200 hover:bg-gray-200',
  triggerCompact: 'px-2.5 gap-1.5',
  triggerGlyph: 'shrink-0 text-[11px] font-black tracking-tight opacity-70',
  triggerLabel: 'truncate text-sm font-semibold leading-none',
  menu: 'absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl overflow-hidden z-50',
  menuDark: 'bg-zinc-950 border-white/10',
  menuLight: 'bg-white border-gray-200',
  item: 'w-full text-left px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap',
  itemActiveDark: 'bg-white/10',
  itemActiveLight: 'bg-gray-100',
  itemIdleDark: 'hover:bg-white/5',
  itemIdleLight: 'hover:bg-gray-50',
} as const;

export type DisclosureState = {
  readonly open: boolean;
};

export type DisclosureAction =
  | { readonly type: 'open' }
  | { readonly type: 'close' }
  | { readonly type: 'toggle' };

export function createDisclosureState(open = false): DisclosureState {
  return { open };
}

export function reduceDisclosureState(state: DisclosureState, action: DisclosureAction): DisclosureState {
  switch (action.type) {
    case 'open':
      return state.open ? state : { open: true };
    case 'close':
      return state.open ? { open: false } : state;
    case 'toggle':
      return { open: !state.open };
    default:
      return state;
  }
}

function attachDropdownMenu(
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

function mountPathLocaleDropdown(
  root: HTMLElement,
  config: {
    localeOptions: readonly LocalePathOption[];
    langCookieKey: string;
    cookieMaxAgeSeconds: number;
    triggerSelector: string;
    menuSelector: string;
    itemSelector: string;
  },
): () => void {
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
