import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getRoleDashboardPath } from '../lib/supabase'
import Logo from '../components/Logo'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, profile } = useAuth()
  const [form, setForm] = useState({ email: 'ariana@checkattend.io', password: 'password123' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn(form.email, form.password)
      if (result?.error) {
        setError(result.error.message || 'Invalid credentials. Please try again.')
        return
      }

      const path = profile ? getRoleDashboardPath(profile.role) : '/dashboard/admin'
      navigate(path, { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:block">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-sky-500/10">
            <div className="flex items-center gap-3">
              <Logo variant="full" size="md" theme="dark" />
            </div>

            <div className="mt-12 space-y-8">
              {[
                { label: 'Real-time attendance', value: '24/7' },
                { label: 'Security compliance', value: 'RLS' },
                { label: 'Workforce metrics', value: 'Live' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-200">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-3 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-[0.18em]">Secure and compliant</span>
              </div>
              <p className="mt-3 text-slate-300">Your attendance data is protected with role-based access, encrypted identity checks, and secure session handling.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/50">
            <div className="mb-8 flex items-center justify-center">
              <Logo variant="full" size="md" theme="dark" />
            </div>

            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Welcome back</p>
              <h1 className="mt-3 text-3xl font-bold text-white">Sign in to CheckAttend</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
                  placeholder="name@company.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><LockKeyhole className="h-4 w-4" /> Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
                  placeholder="••••••••"
                  required
                />
              </label>

              {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link to="/reset-password" className="text-sky-300 hover:text-sky-200">Forgot password?</Link>
                <Link to="/" className="text-slate-300 hover:text-white">Back to home</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
