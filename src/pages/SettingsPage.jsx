import { Bell, Lock, ShieldCheck, SlidersHorizontal, UserCog } from 'lucide-react'
import Layout from '../components/Layout'

const sections = [
  {
    title: 'General Settings',
    icon: SlidersHorizontal,
    description: 'Define attendance policies, working hours, and team defaults.',
    value: 'Configured',
  },
  {
    title: 'Security',
    icon: ShieldCheck,
    description: 'Control authentication, password policies, and session security.',
    value: 'Protected',
  },
  {
    title: 'Notifications',
    icon: Bell,
    description: 'Manage reminders, approvals, and alert delivery preferences.',
    value: 'Enabled',
  },
  {
    title: 'Roles & Permissions',
    icon: UserCog,
    description: 'Manage admin, HR, and employee access across the platform.',
    value: 'Synced',
  },
  {
    title: 'Privacy & Compliance',
    icon: Lock,
    description: 'Review data retention rules and compliance requirements.',
    value: 'Active',
  },
]

export default function SettingsPage() {
  return (
    <Layout title="Settings" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Workspace</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Settings</h2>
            <p className="mt-2 text-sm text-slate-400">Configure system behavior, policies, and operational preferences.</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map(({ title, icon: Icon, description, value }) => (
            <div key={title} className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.45)]">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                  {value}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm text-slate-400">{description}</p>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  )
}
