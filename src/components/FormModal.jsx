import { useEffect, useState } from 'react'
import Modal from './Modal'

export default function FormModal({ open, title, subtitle, onClose, onSubmit, initialValues, fields = [], submitLabel = 'Save', loading = false }) {
  const [values, setValues] = useState(initialValues)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, open])

  const handleChange = (key, value) => setValues((current) => ({ ...current, [key]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(values)
  }

  return (
    <Modal open={open} title={title} subtitle={subtitle} onClose={onClose} size="md" dismissible={!loading}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const commonClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500'
            const value = values[field.name] ?? ''

            if (field.type === 'textarea') {
              return (
                <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                  <label className="mb-2 block text-sm text-slate-300">{field.label}</label>
                  <textarea value={value} onChange={(event) => handleChange(field.name, event.target.value)} className={commonClass} rows={field.rows || 4} />
                </div>
              )
            }

            if (field.type === 'select') {
              return (
                <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                  <label className="mb-2 block text-sm text-slate-300">{field.label}</label>
                  <select value={value} onChange={(event) => handleChange(field.name, event.target.value)} className={commonClass}>
                    {field.options.map((option) => (
                      <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>
                    ))}
                  </select>
                </div>
              )
            }

            return (
              <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="mb-2 block text-sm text-slate-300">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={value}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  className={commonClass}
                  required={field.required}
                />
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-60">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}
