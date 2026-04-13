import React from 'react';

import { cn } from './utils';

export type FormFieldProps = {
  label?: React.ReactNode;
  htmlFor?: string | undefined;
  required?: boolean | undefined;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  className?: string | undefined;
  labelClassName?: string | undefined;
  hintClassName?: string | undefined;
  errorClassName?: string | undefined;
  children: React.ReactNode;
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  labelClassName,
  hintClassName,
  errorClassName,
  children,
}) => (
  <div className={cn('space-y-2', className)}>
    {label ? (
      <label
        htmlFor={htmlFor}
        className={cn('ml-1 text-sm font-black tracking-widest opacity-40', labelClassName)}
      >
        {label}
        {required ? <span className="opacity-50"> *</span> : null}
      </label>
    ) : null}
    {children}
    {hint ? <div className={cn('text-sm font-medium opacity-60', hintClassName)}>{hint}</div> : null}
    {error ? <div className={cn('text-sm font-bold text-red-500', errorClassName)}>{error}</div> : null}
  </div>
);
