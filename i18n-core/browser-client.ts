import { DEFAULT_LOCALE } from './locales';
import { getFileUniCookieDomain } from './preferences';
import type { SupportedLocale } from './locales';

export type LocalePathOption = {
  readonly code: SupportedLocale;
  readonly pathPrefix: string;
};

export function readCookieValue(cookieSource: string, name: string): string | null {
  const prefix = `${name}=`;
  for (const rawCookie of cookieSource.split(';')) {
    const cookie = rawCookie.trim();
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.slice(prefix.length));
    }
  }
  return null;
}

export function writeCookieValue(
  documentRef: Document,
  locationRef: Location,
  name: string,
  value: string,
  maxAgeSeconds: number,
): void {
  const domain = getFileUniCookieDomain(locationRef.hostname);
  const domainPart = domain ? `; domain=${domain}` : '';
  const securePart = locationRef.protocol === 'https:' ? '; Secure' : '';
  documentRef.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${securePart}${domainPart}`;
}

export function stripLocalePrefixFromPath(pathname: string, options: readonly LocalePathOption[]): string {
  for (const option of options) {
    if (!option.pathPrefix) {
      continue;
    }
    if (pathname === option.pathPrefix) {
      return '/';
    }
    if (pathname.startsWith(`${option.pathPrefix}/`)) {
      const stripped = pathname.slice(option.pathPrefix.length);
      return stripped || '/';
    }
  }
  return pathname;
}

export function getLocaleFromPath(
  pathname: string,
  options: readonly LocalePathOption[],
  defaultLocale: SupportedLocale = DEFAULT_LOCALE,
): SupportedLocale {
  const matched = options.find(
    (option) =>
      option.pathPrefix &&
      (pathname === option.pathPrefix || pathname.startsWith(`${option.pathPrefix}/`)),
  );
  return matched?.code ?? defaultLocale;
}

export function buildLocalePath(
  pathname: string,
  locale: SupportedLocale,
  options: readonly LocalePathOption[],
): string {
  const target = options.find((option) => option.code === locale);
  if (!target) {
    return pathname;
  }
  const basePath = stripLocalePrefixFromPath(pathname, options);
  if (!target.pathPrefix) {
    return basePath;
  }
  return basePath === '/' ? `${target.pathPrefix}/` : `${target.pathPrefix}${basePath}`;
}

export function isLocaleRootPath(pathname: string, options: readonly LocalePathOption[]): boolean {
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return options.some((option) => {
    const localePath = option.pathPrefix || '/';
    const normalizedLocalePath = localePath.endsWith('/') ? localePath : `${localePath}/`;
    return normalizedPath === normalizedLocalePath;
  });
}

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

  const closeMenu = () => {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  };

  const handleTriggerClick = () => {
    if (menu.hidden) {
      openMenu();
      return;
    }
    closeMenu();
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
