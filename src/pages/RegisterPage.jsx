import { ArrowRight, Briefcase, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', department: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/60">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Logo variant="full" size="md" theme="dark" />
          <Link to="/login" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500">
            Back to login
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Registration</p>
            <h1 className="mt-3 text-3xl font-bold text-white">Create a workforce profile</h1>
            <p className="mt-4 text-slate-300">Authorized admins can register new employees, assign department roles, and enable secure access to CheckAttend.</p>

            <div className="mt-8 space-y-4">
              {[
                'Secure employee onboarding',
                'Role-based access control',
                'Time tracking and reports',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-slate-200">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-slate-800 bg-slate-950 p-6">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><UserRound className="h-4 w-4" /> Full name</span>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500" placeholder="Ariana Brooks" required />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Work email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500" placeholder="name@company.com" required />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Briefcase className="h-4 w-4" /> Department</span>
              <input type="text" name="department" value={form.department} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500" placeholder="Engineering" required />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><LockKeyhole className="h-4 w-4" /> Password</span>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500" placeholder="Create password" required />
            </label>

            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-400">
              Register employee <ArrowRight className="h-4 w-4" />
            </button>

            {submitted && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Registration request submitted. The admin can approve access and assign a role.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
