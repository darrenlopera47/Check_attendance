import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  const styles = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
    error: 'border-rose-500/40 bg-rose-500/10 text-rose-100',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
    info: 'border-sky-500/40 bg-sky-500/10 text-sky-100',
  }

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: TriangleAlert,
    info: Info,
  }

  const Icon = icons[toast.type] || Info

  return (
    <div className={`flex w-full max-w-sm items-start gap-3 rounded-2xl border p-3 shadow-2xl shadow-slate-950/60 backdrop-blur ${styles[toast.type] || styles.info}`}>
      <div className="mt-0.5 rounded-full bg-slate-950/20 p-1">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description && <p className="mt-1 text-xs text-slate-200/90">{toast.description}</p>}
      </div>
      <button
        type="button"
        aria-label="Close notification"
        onClick={() => onClose(toast.id)}
        className="rounded-lg p-1 text-slate-200 transition hover:bg-slate-950/10 hover:text-white"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  )
}
