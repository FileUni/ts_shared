import React, { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { IconInput } from './icon-input';
import { PasswordStrengthMeter } from './password-strength-meter';
import { cn } from './utils';

export type PasswordToggleLabels = {
  show: string;
  hide: string;
};

export type PasswordInputProps = Omit<React.ComponentProps<typeof IconInput>, 'type' | 'right'> & {
  defaultVisible?: boolean | undefined;
  rightExtra?: React.ReactNode;
  showStrength?: boolean | undefined;
  strengthClassName?: string | undefined;
  toggleButtonTabIndex?: number | undefined;
  toggleLabels?: PasswordToggleLabels | undefined;
  renderStrength?: ((password: string) => React.ReactNode) | undefined;
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  defaultVisible = false,
  rightExtra,
  showStrength = false,
  strengthClassName,
  toggleButtonTabIndex,
  toggleLabels,
  renderStrength,
  wrapperClassName,
  inputClassName,
  value,
  disabled,
  ...rest
}) => {
  const [visible, setVisible] = useState(defaultVisible);

  const password = useMemo(() => {
    if (typeof value === 'string') return value;
    return value == null ? '' : String(value);
  }, [value]);

  const actionLabel = visible ? (toggleLabels?.hide ?? 'Hide') : (toggleLabels?.show ?? 'Show');

  return (
    <>
      <IconInput
        {...rest}
        value={value}
        disabled={disabled}
        type={visible ? 'text' : 'password'}
        wrapperClassName={wrapperClassName}
        inputClassName={cn(inputClassName)}
        right={(
          <div className="flex items-center gap-2">
            {rightExtra}
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              disabled={disabled}
              tabIndex={toggleButtonTabIndex}
              className={cn(
                'opacity-30 transition-opacity hover:opacity-100',
                disabled && 'pointer-events-none',
              )}
              aria-label={actionLabel}
              title={actionLabel}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}
      />

      {renderStrength
        ? renderStrength(password)
        : showStrength
          ? <PasswordStrengthMeter password={password} className={strengthClassName} />
          : null}
    </>
  );
};
