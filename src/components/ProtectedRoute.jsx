import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, profile } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900 px-8 py-6 text-center shadow-2xl shadow-slate-950/60">
          <Logo variant="icon" size="lg" theme="dark" clickable={false} />
          <div className="animate-pulse rounded-xl border border-slate-800 bg-slate-900 px-8 py-4 text-sm uppercase tracking-[0.2em] text-sky-400">
            Loading secure workspace...
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles.length > 0 && (!profile || !allowedRoles.includes(profile.role))) {
    return <Navigate to={profile?.role === 'admin' || profile?.role === 'hr' ? '/dashboard/admin' : '/dashboard/employee'} replace />
  }

  return children
}
