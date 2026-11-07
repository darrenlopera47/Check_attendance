import Modal from './Modal'

export default function ConfirmDialog({ open, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, loading = false, dangerous = false }) {
  return (
    <Modal open={open} title={title} subtitle="Confirmation" onClose={onCancel} size="sm" dismissible={!loading}>
      <div className="space-y-5">
        <p className="text-sm text-slate-300">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={loading} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-60">
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 ${dangerous ? 'bg-rose-500 hover:bg-rose-400' : 'bg-sky-500 hover:bg-sky-400'}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
