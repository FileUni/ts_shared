import { THEME_TOGGLE_CLASSNAMES } from './index';

export type ReactBinaryThemeToggleProps = {
  readonly isDark: boolean;
  readonly buttonLabel: string;
  readonly onToggle: () => void;
  readonly className?: string | undefined;
  readonly darkClassName?: string | undefined;
  readonly lightClassName?: string | undefined;
};

type ReactThemeToggleRuntime = {
  readonly createElement: (...args: unknown[]) => unknown;
  readonly darkIconComponent: unknown;
  readonly lightIconComponent: unknown;
};

function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Create a shared React binary theme toggle without importing React in ts_shared.
 */
export function createReactBinaryThemeToggleComponent(runtime: ReactThemeToggleRuntime) {
  return function ReactBinaryThemeToggle({
    isDark,
    buttonLabel,
    onToggle,
    className,
    darkClassName,
    lightClassName,
  }: ReactBinaryThemeToggleProps) {
    return runtime.createElement(
      'button',
      {
        type: 'button',
        onClick: onToggle,
        className: cn(
          THEME_TOGGLE_CLASSNAMES.button,
          isDark ? THEME_TOGGLE_CLASSNAMES.dark : THEME_TOGGLE_CLASSNAMES.light,
          isDark ? darkClassName : lightClassName,
          className,
        ),
        'aria-label': buttonLabel,
        title: buttonLabel,
      },
      isDark
        ? runtime.createElement(runtime.darkIconComponent, {
            size: 18,
            className: 'opacity-80 text-slate-200',
          })
        : runtime.createElement(runtime.lightIconComponent, {
            size: 18,
            className: 'opacity-80 text-slate-900',
          }),
    );
  };
}
