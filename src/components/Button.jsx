export default function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, loading = false, className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60'
  const styles = {
    primary: 'bg-sky-500 text-slate-950 hover:bg-sky-400',
    secondary: 'border border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500',
    danger: 'bg-rose-500 text-white hover:bg-rose-400',
    success: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
    muted: 'border border-slate-700 bg-slate-900 text-slate-200 hover:text-white',
  }
  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${styles[variant]} ${sizes[size]} ${className}`}>
      {loading ? 'Processing...' : children}
    </button>
  )
}
