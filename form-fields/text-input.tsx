import React from 'react';

import { cn } from './utils';

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, value, onChange, ...props }, ref) => (
    <input
      ref={ref}
      value={value ?? ''}
      onChange={onChange}
      className={cn(
        'w-full rounded-md border bg-background px-4 py-2.5 outline-none',
        'transition-[background-color,border-color,box-shadow,color] duration-200 ease-out',
        'focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
);

TextInput.displayName = 'TextInput';
