import { PAGE_SIZES } from '../hooks/usePagination'

export default function PageSizeSelector({ value, onChange, className = '' }) {
  return (
    <label className={`flex items-center gap-2 text-sm text-slate-300 ${className}`}>
      <span className="whitespace-nowrap">Rows per page</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-2 text-sm text-slate-100 outline-none transition hover:border-slate-500"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  )
}
