import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/60">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Reset password</h1>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <p className="mb-6 text-sm text-slate-300">Enter your registered email to receive a password reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500"
              placeholder="name@company.com"
              required
            />
          </label>

          <button type="submit" className="w-full rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-400">
            Send reset link
          </button>
        </form>

        {submitted && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            If this email is registered, a password reset link has been sent.
          </div>
        )}
      </div>
    </div>
  )
}
