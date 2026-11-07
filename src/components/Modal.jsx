import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, title, subtitle, onClose, children, size = 'md', dismissible = true }) {
  useEffect(() => {
    if (!open) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape' && dismissible) onClose?.()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, dismissible, onClose])

  if (!open) return null

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }[size]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={dismissible ? onClose : undefined}>
      <div
        className={`w-full ${sizeClass} rounded-[28px] border border-slate-800 bg-[#111B30] p-6 shadow-[0_25px_60px_rgba(2,6,23,0.6)]`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            {subtitle && <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{subtitle}</p>}
            {title && <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>}
          </div>
          {dismissible && (
            <button type="button" aria-label="Close modal" onClick={onClose} className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
