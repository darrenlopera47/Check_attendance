export default function IconButton({ icon: Icon, label, onClick, className = '', disabled = false, title }) {
  return (
    <button
      type="button"
      aria-label={label || title}
      title={title || label}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}
