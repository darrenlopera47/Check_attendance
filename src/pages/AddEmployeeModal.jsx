import { X } from 'lucide-react'

export default function AddEmployeeModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-slate-800 bg-[#111B30] p-6 shadow-[0_25px_60px_rgba(2,6,23,0.6)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Employees</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Add Employee</h3>
          </div>
          <button onClick={onClose} className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Employee ID" placeholder="CHK-2010" />
          <Field label="First Name" placeholder="Jordan" />
          <Field label="Last Name" placeholder="Miles" />
          <Field label="Email" type="email" placeholder="jordan@checkattend.io" />
          <Field label="Contact Number" placeholder="+1 555 234 5678" />
          <Field label="Department" placeholder="Engineering" />
          <Field label="Position" placeholder="Frontend Engineer" />
          <Field label="Date Hired" type="date" />
          <Field label="Employment Status" placeholder="Active" />
          <Field label="Work Schedule" placeholder="Mon-Fri 9am-6pm" />
          <div className="md:col-span-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Profile Picture</span>
              <input type="file" className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300" />
            </label>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500">
            Cancel
          </button>
          <button className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400">
            Save Employee
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, type = 'text', placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
      />
    </label>
  )
}
