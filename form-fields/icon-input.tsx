import React from 'react';

import { TextInput } from './text-input';
import { cn } from './utils';

export type IconInputProps = Omit<React.ComponentProps<typeof TextInput>, 'className'> & {
  icon?: React.ReactNode;
  right?: React.ReactNode;
  wrapperClassName?: string | undefined;
  inputClassName?: string | undefined;
};

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon, right, wrapperClassName, inputClassName, ...props }, ref) => {
    const hasIcon = Boolean(icon);
    const hasRight = Boolean(right);

    return (
      <div className={cn('group relative', wrapperClassName)}>
        {hasIcon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 transition-all group-focus-within:opacity-100 group-focus-within:text-primary">
            {icon}
          </div>
        ) : null}
        <TextInput
          ref={ref}
          {...props}
          className={cn(inputClassName, hasIcon && 'pl-12', hasRight && 'pr-12')}
        />
        {hasRight ? <div className="absolute right-4 top-1/2 -translate-y-1/2">{right}</div> : null}
      </div>
    );
  },
);

IconInput.displayName = 'IconInput';
