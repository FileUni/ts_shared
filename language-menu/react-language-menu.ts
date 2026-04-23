import {
  LOCALE_MENU_CLASSNAMES,
  LOCALE_MENU_OPTIONS,
  getLocaleNativeLabel,
  type LocaleMenuOption,
} from './base';
import type { SupportedLocale } from '../localization/metadata';

type ReactLocaleMenuOption = {
  readonly id: SupportedLocale;
  readonly label: string;
};

export type ReactLanguageMenuProps = {
  readonly currentLocale: SupportedLocale;
  readonly onSelectLocale: (locale: SupportedLocale) => void;
  readonly isDark: boolean;
  readonly buttonLabel: string;
  readonly compact?: boolean | undefined;
  readonly className?: string | undefined;
  readonly triggerClassName?: string | undefined;
  readonly menuClassName?: string | undefined;
  readonly options?: readonly ReactLocaleMenuOption[] | undefined;
};

type ReducerState = {
  readonly open: boolean;
};

type ReducerAction =
  | { readonly type: 'close' }
  | { readonly type: 'toggle' };

type ReactLanguageMenuRuntime = {
  readonly createElement: (...args: unknown[]) => unknown;
  readonly useEffect: (effect: () => void | (() => void), deps: readonly unknown[]) => void;
  readonly useReducer: <TState, TAction>(
    reducer: (state: TState, action: TAction) => TState,
    initialArg: undefined,
    initializer: () => TState,
  ) => [TState, (action: TAction) => void];
  readonly useRef: <TValue>(initialValue: TValue) => { current: TValue };
  readonly iconComponent: unknown;
};

function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}

const defaultOptions: readonly ReactLocaleMenuOption[] = LOCALE_MENU_OPTIONS.map((option: LocaleMenuOption) => ({
  id: option.code,
  label: option.nativeLabel,
}));

function createReducerState(): ReducerState {
  return { open: false };
}

function reduceReducerState(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case 'close':
      return state.open ? { open: false } : state;
    case 'toggle':
      return { open: !state.open };
    default:
      return state;
  }
}

/**
 * Create a shared React language menu component without importing React from ts_shared itself.
 */
export function createReactLanguageMenuComponent(runtime: ReactLanguageMenuRuntime) {
  return function ReactLanguageMenu({
    currentLocale,
    onSelectLocale,
    isDark,
    buttonLabel,
    compact = false,
    className,
    triggerClassName,
    menuClassName,
    options = defaultOptions,
  }: ReactLanguageMenuProps) {
    const [menuState, dispatchMenu] = runtime.useReducer(
      reduceReducerState,
      undefined,
      createReducerState,
    );
    const menuRef = runtime.useRef<HTMLDivElement | null>(null);

    runtime.useEffect(() => {
      const onDocMouseDown = (event: MouseEvent) => {
        if (!menuState.open) {
          return;
        }
        const target = event.target as Node | null;
        if (menuRef.current && target && !menuRef.current.contains(target)) {
          dispatchMenu({ type: 'close' });
        }
      };
      document.addEventListener('mousedown', onDocMouseDown);
      return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, [menuState.open]);

    return runtime.createElement(
      'div',
      { className: cn('relative', className), ref: menuRef },
      runtime.createElement(
        'button',
        {
          type: 'button',
          onClick: () => dispatchMenu({ type: 'toggle' }),
          className: cn(
            LOCALE_MENU_CLASSNAMES.trigger,
            compact && LOCALE_MENU_CLASSNAMES.triggerCompact,
            isDark ? LOCALE_MENU_CLASSNAMES.triggerDark : LOCALE_MENU_CLASSNAMES.triggerLight,
            triggerClassName,
          ),
          'aria-label': buttonLabel,
          title: buttonLabel,
        },
        runtime.createElement(runtime.iconComponent, {
          size: 16,
          className: LOCALE_MENU_CLASSNAMES.triggerGlyph,
          'aria-hidden': true,
        }),
        runtime.createElement(
          'span',
          { className: LOCALE_MENU_CLASSNAMES.triggerLabel },
          getLocaleNativeLabel(currentLocale),
        ),
      ),
      menuState.open
        ? runtime.createElement(
            'div',
            {
              className: cn(
                LOCALE_MENU_CLASSNAMES.menu,
                isDark ? LOCALE_MENU_CLASSNAMES.menuDark : LOCALE_MENU_CLASSNAMES.menuLight,
                menuClassName,
              ),
            },
            ...options.map((option) =>
              runtime.createElement(
                'button',
                {
                  key: option.id,
                  type: 'button',
                  onClick: () => {
                    onSelectLocale(option.id);
                    dispatchMenu({ type: 'close' });
                  },
                  className: cn(
                    LOCALE_MENU_CLASSNAMES.item,
                    currentLocale === option.id
                      ? (isDark
                        ? LOCALE_MENU_CLASSNAMES.itemActiveDark
                        : LOCALE_MENU_CLASSNAMES.itemActiveLight)
                      : (isDark
                        ? LOCALE_MENU_CLASSNAMES.itemIdleDark
                        : LOCALE_MENU_CLASSNAMES.itemIdleLight),
                  ),
                },
                runtime.createElement('span', { className: 'block truncate' }, option.label),
              ),
            ),
          )
        : null,
    );
  };
}
