import React from 'react'

import { cn } from './utils'

type EscapeLayer = {
  id: string
  enabled: boolean
  onEscape: () => void
}

type EscapeLayerStore = {
  layers: EscapeLayer[]
  listenerUsers: number
  keydownListenerInstalled: boolean
  idSeq: number
}

const ESC_LAYER_STORE_KEY = '__fileuni_escape_layer_store__'

const store: EscapeLayerStore = (() => {
  const g = globalThis as unknown as Record<string, unknown>
  const existing = g[ESC_LAYER_STORE_KEY]
  if (existing && typeof existing === 'object') {
    return existing as EscapeLayerStore
  }
  const next: EscapeLayerStore = {
    layers: [],
    listenerUsers: 0,
    keydownListenerInstalled: false,
    idSeq: 0,
  }
  g[ESC_LAYER_STORE_KEY] = next
  return next
})()

const nextId = (): string => {
  store.idSeq += 1
  return `esc-layer-${store.idSeq}`
}

const removeLayer = (id: string): void => {
  const idx = store.layers.findIndex((layer) => layer.id === id)
  if (idx >= 0) {
    store.layers.splice(idx, 1)
  }
}

const upsertLayer = (layer: EscapeLayer): void => {
  const idx = store.layers.findIndex((it) => it.id === layer.id)
  if (idx >= 0) {
    store.layers[idx] = layer
    return
  }
  store.layers.push(layer)
}

const handleKeyDownCapture = (event: KeyboardEvent): void => {
  if (event.key !== 'Escape') {
    return
  }
  if (store.layers.length === 0) {
    return
  }
  const top = store.layers[store.layers.length - 1]
  if (!top) {
    return
  }
  event.preventDefault()
  event.stopImmediatePropagation()
  if (top.enabled) {
    top.onEscape()
  }
}

const ensureKeydownListener = (): void => {
  if (store.keydownListenerInstalled || typeof window === 'undefined') {
    return
  }
  window.addEventListener('keydown', handleKeyDownCapture, { capture: true })
  store.keydownListenerInstalled = true
}

const maybeRemoveKeydownListener = (): void => {
  if (!store.keydownListenerInstalled || typeof window === 'undefined') {
    return
  }
  if (store.listenerUsers > 0) {
    return
  }
  window.removeEventListener('keydown', handleKeyDownCapture, { capture: true } as AddEventListenerOptions)
  store.keydownListenerInstalled = false
}

export type GlassModalShellProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  icon?: React.ReactNode
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  compact?: 'none' | 'header' | 'foot' | 'body' | 'all'
  nested?: boolean
  footerLayout?: 'stack' | 'inline'
  headerCompact?: boolean
  maxWidthClassName?: string
  panelClassName?: string
  bodyClassName?: string
  overlayClassName?: string
  zIndexClassName?: string
  containerClassName?: string
  closeLabel?: string
  closeButton?: React.ReactNode
}

export const GlassModalShell: React.FC<GlassModalShellProps> = ({
  title,
  subtitle,
  icon,
  onClose,
  children,
  footer,
  compact = 'none',
  nested = false,
  footerLayout = 'inline',
  headerCompact = false,
  maxWidthClassName = 'max-w-2xl',
  panelClassName,
  bodyClassName,
  overlayClassName,
  zIndexClassName,
  containerClassName,
  closeLabel = 'Close',
  closeButton,
}) => {
  const layerIdRef = React.useRef<string>(nextId())

  React.useEffect(() => {
    store.listenerUsers += 1
    ensureKeydownListener()
    return () => {
      store.listenerUsers -= 1
      maybeRemoveKeydownListener()
    }
  }, [])

  React.useEffect(() => {
    const layerId = layerIdRef.current
    upsertLayer({ id: layerId, enabled: true, onEscape: onClose })
    return () => {
      removeLayer(layerId)
    }
  }, [onClose])

  const compactHeader = compact === 'header' || compact === 'all' || headerCompact
  const compactFooter = compact === 'foot' || compact === 'all' || footerLayout === 'stack'
  const compactBody = compact === 'body' || compact === 'all'
  const effectiveZIndexClassName = zIndexClassName ?? (nested ? 'z-[290]' : 'z-[250]')
  const headerClassName = compactHeader
    ? 'px-4 py-3 sm:px-5 sm:py-4 border-b border-zinc-200/60 dark:border-white/5 flex items-center justify-between bg-white/55 dark:bg-white/[0.03] shrink-0 gap-3 backdrop-blur-xl'
    : 'px-4 py-4 sm:p-8 border-b border-zinc-200/60 dark:border-white/5 flex items-center justify-between bg-white/55 dark:bg-white/[0.03] shrink-0 gap-3 sm:gap-4 backdrop-blur-xl'
  const titleClassName = compactHeader ? 'text-lg sm:text-xl' : 'text-xl'
  const subtitleClassName = compactHeader ? 'text-xs text-foreground/45 dark:text-white/40 mt-0.5' : 'text-xs sm:text-sm text-foreground/45 dark:text-white/40 mt-1'
  const footerClassName = compactFooter
    ? 'px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 bg-white/50 dark:bg-white/[0.02] border-t border-zinc-200/60 dark:border-white/5 shrink-0 backdrop-blur-xl'
    : 'px-4 py-4 sm:p-6 lg:p-8 bg-white/50 dark:bg-white/[0.02] border-t border-zinc-200/60 dark:border-white/5 shrink-0 backdrop-blur-xl'
  const effectiveBodyClassName = cn(
    compactBody ? 'p-4 sm:p-5 lg:p-6 bg-white/45 dark:bg-white/[0.02] text-foreground' : 'p-4 sm:p-6 lg:p-8 bg-white/45 dark:bg-white/[0.02] text-foreground',
    bodyClassName,
  )

  return (
    <div className={cn('fixed inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-none', effectiveZIndexClassName, containerClassName)} role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={closeLabel}
        className={cn('fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto', overlayClassName)}
        onClick={onClose}
      />

        <div
          className={cn(
            'bg-white/78 dark:bg-[#0f172a]/86 text-foreground border border-zinc-200/70 dark:border-white/10 w-full rounded-[2.5rem] shadow-[0_24px_80px_rgba(15,23,42,0.18)] dark:shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 flex flex-col min-h-0 max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] pointer-events-auto backdrop-blur-2xl',
            maxWidthClassName,
            panelClassName,
          )}
      >
        <div className={headerClassName}>
          <div className="flex items-center gap-4 min-w-0">
            {icon ? (
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                {icon}
              </div>
            ) : null}
            <div className="min-w-0">
              <h3 className={cn(titleClassName, 'font-black text-foreground dark:text-white tracking-tight truncate')}>{title}</h3>
              {subtitle ? (
                <p className={cn(subtitleClassName, 'font-bold tracking-widest truncate')}>{subtitle}</p>
              ) : null}
            </div>
          </div>
          {closeButton ?? (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="rounded-2xl h-12 w-12 p-0 hover:bg-zinc-100/80 dark:hover:bg-white/10 shrink-0 text-2xl text-foreground/50 dark:text-white/40 leading-none transition-colors"
            >
              ×
            </button>
          )}
        </div>

        <div className={cn('flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar', effectiveBodyClassName)}>
          {children}
        </div>

        {footer ? (
          <div className={footerClassName}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
