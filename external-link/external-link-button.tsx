import React from 'react';
import { ExternalLink } from 'lucide-react';

import { cn } from './utils';

export type ExternalLinkButtonProps = {
  href: string;
  children: React.ReactNode;
  onOpen?: (href: string) => void | Promise<void>;
  className?: string;
  title?: string;
  disabled?: boolean;
};

const openInBrowser = (href: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.open(href, '_blank', 'noopener,noreferrer');
};

export const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  children,
  onOpen,
  className,
  title,
  disabled = false,
}) => {
  const handleClick = (): void => {
    if (disabled) {
      return;
    }

    if (onOpen) {
      void onOpen(href);
      return;
    }

    openInBrowser(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={title}
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition-colors',
        'border-slate-200 bg-white text-slate-800 hover:bg-slate-100',
        'dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-100 dark:hover:bg-white/10',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <span>{children}</span>
      <ExternalLink size={16} aria-hidden="true" />
    </button>
  );
};
