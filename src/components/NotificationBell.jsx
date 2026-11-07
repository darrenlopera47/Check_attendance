import { useMemo, useState } from 'react'
import { Bell, CheckCheck, ChevronRight, ExternalLink, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const initialNotifications = [
  { id: 1, type: 'attendance', title: 'Employee clocked in', description: 'Ariana Brooks has checked in for the morning shift.', time: '2 minutes ago', read: false, link: '/dashboard/admin/attendance' },
  { id: 2, type: 'leave', title: 'Leave request submitted', description: 'Sofia Patel requested annual leave for Nov 12-15.', time: '18 minutes ago', read: false, link: '/dashboard/admin/leaves' },
  { id: 3, type: 'overtime', title: 'Overtime approved', description: 'Lucas Reed overtime request was approved.', time: '1 hour ago', read: true, link: '/dashboard/admin/overtime' },
  { id: 4, type: 'admin', title: 'Permission updated', description: 'HR Manager permission matrix was updated and saved.', time: 'Today', read: true, link: '/dashboard/admin/permissions' },
]

const icons = {
  attendance: Sparkles,
  leave: ShieldCheck,
  overtime: CheckCheck,
  admin: ExternalLink,
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])

  const markAsRead = (id) => {
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification))
  }

  const markAllAsRead = () => setNotifications((current) => current.map((item) => ({ ...item, read: true })))

  const handleSelect = (notification) => {
    markAsRead(notification.id)
    setIsOpen(false)
    if (notification.link) navigate(notification.link)
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open notifications"
        onClick={() => setIsOpen((current) => !current)}
        className="relative rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition hover:text-white"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 z-50 w-[360px] rounded-2xl border border-slate-800 bg-[#111B30] p-3 shadow-2xl shadow-slate-950/50">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Notifications</p>
              <p className="mt-1 text-lg font-semibold text-white">Recent activity</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">No notifications.</div>
            ) : (
              notifications.map((notification) => {
                const Icon = icons[notification.type] || ExternalLink
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleSelect(notification)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${notification.read ? 'border-slate-800 bg-slate-900/60 text-slate-300' : 'border-sky-500/30 bg-sky-500/5 text-white'}`}
                  >
                    <div className="mt-0.5 rounded-xl bg-slate-800 p-2 text-sky-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.read && <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />}
                      </div>
                      <p className="mt-1 text-sm text-slate-300">{notification.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{notification.time}</span>
                        <span className="inline-flex items-center gap-1 text-sky-300">
                          View <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
            <button type="button" onClick={markAllAsRead} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 hover:border-slate-500">Mark all as read</button>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400">View all</button>
          </div>
        </div>
      )}
    </div>
  )
}
