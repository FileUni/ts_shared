import React, { createContext, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Info,
  X,
} from 'lucide-react';

import { cn } from '../form-fields';

export type SharedToastType = 'info' | 'success' | 'warning' | 'error';
export type SharedToastDuration = 'short' | 'normal' | 'long' | 'persistent';
export type SharedToastPlacement = 'top-right' | 'bottom-right';

export type ToastI18n = {
  doNotShowAgain: string;
  viewDetails: string;
  hideDetails: string;
  copy: string;
};

export type SharedToastViewModel = {
  id: string;
  message: string;
  type: SharedToastType;
  duration: SharedToastDuration;
  details?: string | undefined;
  showDetails: boolean;
  showDoNotShowAgain: boolean;
  createdAt: number;
};

export type SharedToastContainerProps = {
  toasts: SharedToastViewModel[];
  durations: Record<Exclude<SharedToastDuration, 'persistent'>, number>;
  isDark: boolean;
  i18n: ToastI18n;
  portalTarget: Element | DocumentFragment;
  placement?: SharedToastPlacement | undefined;
  topOffset?: string | undefined;
  bottomOffset?: string | undefined;
  rightOffset?: string | undefined;
  topAnchorSelector?: string | undefined;
  viewportGapPx?: number | undefined;
  onDismiss: (id: string) => void;
  onToggleDetails: (id: string) => void;
  onDoNotShowAgain: (id: string) => void;
  renderPortal: (children: React.ReactNode, target: Element | DocumentFragment) => React.ReactNode;
};

const defaultI18n: ToastI18n = {
  doNotShowAgain: 'Do not show again',
  viewDetails: 'View Details',
  hideDetails: 'Hide Details',
  copy: 'Copy',
};

const DEFAULT_TOAST_TOP_ANCHOR_SELECTOR = '[data-toast-top-anchor]';
const DEFAULT_TOAST_VIEWPORT_GAP_PX = 16;
const DEFAULT_TOP_OFFSET = 'max(1rem, calc(env(safe-area-inset-top, 0px) + 1rem))';

function parsePixelValue(value: string | null | undefined): number {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPixelOffset(value: number): string {
  return `${Math.max(0, Math.ceil(value))}px`;
}

function resolveAutoTopOffsetPx(
  ownerDocument: Document,
  topAnchorSelector: string,
  viewportGapPx: number,
): number {
  const safeAreaTop = parsePixelValue(
    getComputedStyle(ownerDocument.documentElement).getPropertyValue('--safe-area-top'),
  );
  const baseOffset = safeAreaTop + viewportGapPx;

  let anchorBottom = 0;
  for (const anchor of ownerDocument.querySelectorAll<HTMLElement>(topAnchorSelector)) {
    const rect = anchor.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;
    anchorBottom = Math.max(anchorBottom, rect.bottom);
  }

  return Math.max(baseOffset, anchorBottom + viewportGapPx);
}

export const ToastI18nContext = createContext<ToastI18n>(defaultI18n);

function getToastIcon(type: SharedToastType) {
  switch (type) {
    case 'success':
      return <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
    case 'error':
      return <AlertCircle size={16} className="text-rose-500 shrink-0" />;
    case 'warning':
      return <AlertCircle size={16} className="text-amber-500 shrink-0" />;
    default:
      return <Info size={16} className="text-blue-500 shrink-0" />;
  }
}

type ToastTone = {
  message: string;
  border: string;
  accent: string;
  surface: string;
  chip: string;
  subtle: string;
  code: string;
  codeText: string;
};

function getToastTone(type: SharedToastType, isDark: boolean): ToastTone {
  switch (type) {
    case 'success':
      return {
        message: isDark ? 'text-emerald-300' : 'text-emerald-700',
        border: isDark ? 'border-emerald-500/20' : 'border-emerald-200/80',
        accent: isDark ? 'shadow-[0_10px_30px_rgba(16,185,129,0.12)]' : 'shadow-[0_8px_24px_rgba(16,185,129,0.10)]',
        surface: isDark ? 'bg-zinc-950/96' : 'bg-white/96',
        chip: isDark ? 'bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        subtle: isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800',
        code: isDark ? 'bg-black/40' : 'bg-zinc-100',
        codeText: isDark ? 'text-zinc-200' : 'text-zinc-700',
      };
    case 'error':
      return {
        message: isDark ? 'text-rose-300' : 'text-rose-700',
        border: isDark ? 'border-rose-500/20' : 'border-rose-200/80',
        accent: isDark ? 'shadow-[0_10px_30px_rgba(244,63,94,0.12)]' : 'shadow-[0_8px_24px_rgba(244,63,94,0.10)]',
        surface: isDark ? 'bg-zinc-950/96' : 'bg-white/96',
        chip: isDark ? 'bg-rose-500/10 text-rose-200 hover:bg-rose-500/15' : 'bg-rose-50 text-rose-700 hover:bg-rose-100',
        subtle: isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800',
        code: isDark ? 'bg-black/40' : 'bg-zinc-100',
        codeText: isDark ? 'text-zinc-200' : 'text-zinc-700',
      };
    case 'warning':
      return {
        message: isDark ? 'text-amber-200' : 'text-amber-800',
        border: isDark ? 'border-amber-500/20' : 'border-amber-200/80',
        accent: isDark ? 'shadow-[0_10px_30px_rgba(245,158,11,0.12)]' : 'shadow-[0_8px_24px_rgba(245,158,11,0.10)]',
        surface: isDark ? 'bg-zinc-950/96' : 'bg-white/96',
        chip: isDark ? 'bg-amber-500/10 text-amber-100 hover:bg-amber-500/15' : 'bg-amber-50 text-amber-800 hover:bg-amber-100',
        subtle: isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800',
        code: isDark ? 'bg-black/40' : 'bg-zinc-100',
        codeText: isDark ? 'text-zinc-200' : 'text-zinc-700',
      };
    default:
      return {
        message: isDark ? 'text-blue-300' : 'text-blue-700',
        border: isDark ? 'border-blue-500/20' : 'border-blue-200/80',
        accent: isDark ? 'shadow-[0_10px_30px_rgba(59,130,246,0.12)]' : 'shadow-[0_8px_24px_rgba(59,130,246,0.10)]',
        surface: isDark ? 'bg-zinc-950/96' : 'bg-white/96',
        chip: isDark ? 'bg-blue-500/10 text-blue-200 hover:bg-blue-500/15' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
        subtle: isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800',
        code: isDark ? 'bg-black/40' : 'bg-zinc-100',
        codeText: isDark ? 'text-zinc-200' : 'text-zinc-700',
      };
  }
}

function getRemainingSeconds(
  createdAt: number,
  duration: SharedToastDuration,
  durations: SharedToastContainerProps['durations'],
  now: number,
): string {
  if (duration === 'persistent') return '∞';
  const total = durations[duration];
  const elapsed = now - createdAt;
  const remaining = Math.max(0, total - elapsed);
  return `${Math.max(1, Math.ceil(remaining / 1000))}s`;
}

const SharedToastItem: React.FC<{
  toast: SharedToastViewModel;
  durations: SharedToastContainerProps['durations'];
  isDark: boolean;
  i18n: ToastI18n;
  onDismiss: (id: string) => void;
  onToggleDetails: (id: string) => void;
  onDoNotShowAgain: (id: string) => void;
}> = ({ toast, durations, isDark, i18n, onDismiss, onToggleDetails, onDoNotShowAgain }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (toast.duration === 'persistent') return undefined;
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => window.clearInterval(timer);
  }, [toast.duration]);

  const tone = getToastTone(toast.type, isDark);
  const dismissSeconds = getRemainingSeconds(toast.createdAt, toast.duration, durations, now);

  const copyDetails = async () => {
    if (!toast.details) return;
    await navigator.clipboard.writeText(toast.details);
  };

  return (
    <div
      className={cn(
        'w-[min(24rem,calc(100vw-1.5rem))] rounded-xl border backdrop-blur-md',
        'animate-in slide-in-from-right-3 duration-200',
        'px-3 py-2.5',
        tone.surface,
        tone.border,
        tone.accent,
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="pt-0.5">{getToastIcon(toast.type)}</div>
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-medium leading-5 whitespace-pre-wrap break-words', tone.message)}>
            {toast.message}
          </p>

          {toast.details && (
            <div className="mt-2 space-y-2">
              <button
                type="button"
                onClick={() => onToggleDetails(toast.id)}
                className={cn('inline-flex items-center gap-1 text-xs transition-colors', tone.subtle)}
              >
                {toast.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>{toast.showDetails ? i18n.hideDetails : i18n.viewDetails}</span>
              </button>

              {toast.showDetails && (
                <div className="space-y-2">
                  <div className={cn('max-h-32 overflow-y-auto rounded-lg p-2 text-xs font-mono whitespace-pre-wrap break-all', tone.code, tone.codeText)}>
                    {toast.details}
                  </div>
                  <button
                    type="button"
                    onClick={copyDetails}
                    className={cn('inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors', tone.chip)}
                  >
                    <Copy size={12} />
                    <span>{i18n.copy}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {toast.showDoNotShowAgain && (
            <button
              type="button"
              onClick={() => onDoNotShowAgain(toast.id)}
              className={cn('mt-2 text-xs underline underline-offset-2 transition-colors', tone.subtle)}
            >
              {i18n.doNotShowAgain}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className={cn(
            'shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium transition-colors',
            tone.border,
            tone.chip,
          )}
          title={toast.duration === 'persistent' ? 'Dismiss' : `Dismiss in ${dismissSeconds}`}
          aria-label={toast.duration === 'persistent' ? 'Dismiss' : `Dismiss in ${dismissSeconds}`}
        >
          <span>{toast.duration === 'persistent' ? '∞' : dismissSeconds}</span>
          <X size={11} />
        </button>
      </div>
    </div>
  );
};

export const SharedToastContainer: React.FC<SharedToastContainerProps> = ({
  toasts,
  durations,
  isDark,
  i18n,
  portalTarget,
  placement = 'top-right',
  topOffset,
  bottomOffset,
  rightOffset,
  topAnchorSelector,
  viewportGapPx,
  onDismiss,
  onToggleDetails,
  onDoNotShowAgain,
  renderPortal,
}) => {
  const ownerDocument = portalTarget.ownerDocument;
  const resolvedTopAnchorSelector = topAnchorSelector?.trim() || DEFAULT_TOAST_TOP_ANCHOR_SELECTOR;
  const resolvedViewportGapPx = viewportGapPx ?? DEFAULT_TOAST_VIEWPORT_GAP_PX;
  const [autoTopOffset, setAutoTopOffset] = useState<string | undefined>(() => {
    if (placement !== 'top-right' || topOffset || !ownerDocument) return undefined;
    return formatPixelOffset(
      resolveAutoTopOffsetPx(ownerDocument, resolvedTopAnchorSelector, resolvedViewportGapPx),
    );
  });

  useEffect(() => {
    if (placement !== 'top-right' || topOffset || !ownerDocument) {
      setAutoTopOffset(undefined);
      return undefined;
    }

    const syncAutoTopOffset = () => {
      setAutoTopOffset(
        formatPixelOffset(
          resolveAutoTopOffsetPx(ownerDocument, resolvedTopAnchorSelector, resolvedViewportGapPx),
        ),
      );
    };

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => {
          syncAutoTopOffset();
        });

    const observeAnchors = () => {
      resizeObserver?.disconnect();
      if (!resizeObserver) return;
      for (const anchor of ownerDocument.querySelectorAll<HTMLElement>(resolvedTopAnchorSelector)) {
        resizeObserver.observe(anchor);
      }
    };

    syncAutoTopOffset();
    observeAnchors();

    const mutationTarget = ownerDocument.body ?? ownerDocument.documentElement;
    const mutationObserver = typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(() => {
          observeAnchors();
          syncAutoTopOffset();
        });

    mutationObserver?.observe(mutationTarget, {
      childList: true,
      subtree: true,
    });
    ownerDocument.defaultView?.addEventListener('resize', syncAutoTopOffset);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      ownerDocument.defaultView?.removeEventListener('resize', syncAutoTopOffset);
    };
  }, [
    ownerDocument,
    placement,
    resolvedTopAnchorSelector,
    resolvedViewportGapPx,
    topOffset,
  ]);

  if (toasts.length === 0) return null;

  const sharedStyle: React.CSSProperties = {
    right: rightOffset ?? 'max(1rem, calc(env(safe-area-inset-right) + 1rem))',
    zIndex: 2147483647,
  };

  const positionStyle: React.CSSProperties = placement === 'bottom-right'
    ? {
        ...sharedStyle,
        bottom: bottomOffset ?? 'max(0.75rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
      }
    : {
        ...sharedStyle,
        top: topOffset ?? autoTopOffset ?? DEFAULT_TOP_OFFSET,
      };

  return renderPortal(
    <div
      className="fixed flex flex-col items-end gap-2 pointer-events-none"
      style={positionStyle}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <SharedToastItem
            toast={toast}
            durations={durations}
            isDark={isDark}
            i18n={i18n}
            onDismiss={onDismiss}
            onToggleDetails={onToggleDetails}
            onDoNotShowAgain={onDoNotShowAgain}
          />
        </div>
      ))}
    </div>,
    portalTarget,
  );
};
