import { useState } from 'react'
import {
  Activity,
  Bell,
  Building2,
  CalendarCheck2,
  ChevronDown,
  ChevronRight,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Shield,
  ShieldCheck,
  TimerReset,
  Users,
  X,
} from 'lucide-react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NotificationBell from './NotificationBell'
import Logo from './Logo'

const navItems = [
  { label: 'Overview', to: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Attendance', to: '/dashboard/admin/attendance', icon: CalendarCheck2 },
  { label: 'Employees', to: '/dashboard/admin/employees', icon: Users },
  { label: 'Overtime', to: '/dashboard/admin/overtime', icon: TimerReset },
  { label: 'Leave Management', to: '/dashboard/admin/leaves', icon: FileText },
  { label: "Who's In & Who's Out", to: '/dashboard/admin/monitoring', icon: Activity },
  { label: 'Reports', to: '/dashboard/admin/reports', icon: Gauge },
]

const adminManagementItems = [
  { label: 'User Management', to: '/dashboard/admin/users', icon: Users },
  { label: 'Role Management', to: '/dashboard/admin/roles', icon: Shield },
  { label: 'Department Management', to: '/dashboard/admin/departments', icon: Building2 },
  { label: 'Permission Management', to: '/dashboard/admin/permissions', icon: ShieldCheck },
]

export default function Layout({ title, children, userName = 'Ariana Brooks' }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
        <Logo variant="icon" size="sm" theme="dark" clickable={false} />
        <div className="leading-none">
          <p className="text-lg font-semibold tracking-tight text-white">CheckAttend</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-sky-300' : 'text-slate-400'}`} />
                  {label}
                </span>
                {isActive && <span className="h-2 w-2 rounded-full bg-sky-400" />}
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-2">
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Admin Management</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div className="space-y-1">
            {adminManagementItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition ${
                    isActive ? 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-300 text-sm font-bold text-slate-950">
              AB
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs text-slate-400">HR Admin</p>
            </div>
          </div>
          <button type="button" onClick={handleLogout} aria-label="Sign out" className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-800 bg-[#0F172A] xl:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 xl:hidden" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-72 border-r border-slate-800 bg-[#0F172A]" onClick={(event) => event.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="xl:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#020617]/80 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Toggle navigation" onClick={() => setMobileOpen((current) => !current)} className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 xl:hidden">
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <Link to="/" className="xl:hidden">
                <Logo variant="icon" size="sm" theme="dark" clickable={false} />
              </Link>
              <div className="space-y-0.5">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">Dashboard</p>
                <h1 className="text-xl font-semibold text-white sm:text-2xl">{title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 md:flex">
                <Search className="h-4 w-4 text-slate-500" />
                <span>Search</span>
              </div>
              <NotificationBell />
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-200">
                  AB
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
