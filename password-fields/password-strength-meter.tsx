import React, { useMemo } from 'react';

import { cn } from '../form-fields';

export function getPasswordStrengthScore(password: string): number {
  let strength = 0;
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  return strength;
}

export type PasswordStrengthMeterProps = {
  password: string;
  className?: string | undefined;
  segments?: readonly number[] | undefined;
  inactiveBarClassName?: string | undefined;
  getActiveBarClassName?: ((segment: number, score: number) => string) | undefined;
};

const defaultActiveBarClassName = (segment: number): string => {
  if (segment <= 1) return 'bg-red-500';
  if (segment <= 3) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className,
  segments = [1, 3, 5],
  inactiveBarClassName = 'bg-white/10',
  getActiveBarClassName = defaultActiveBarClassName,
}) => {
  const score = useMemo(() => getPasswordStrengthScore(password), [password]);

  if (!password) {
    return null;
  }

  return (
    <div className={cn('mt-2 flex h-1 gap-1 px-1', className)}>
      {segments.map((segment) => (
        <div
          key={segment}
          className={cn(
            'flex-1 rounded-full transition-all duration-500',
            score >= segment ? getActiveBarClassName(segment, score) : inactiveBarClassName,
          )}
        />
      ))}
    </div>
  );
};
