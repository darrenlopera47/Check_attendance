import { BarChart3, Download, Filter, PieChart, TrendingUp } from 'lucide-react'
import Layout from '../components/Layout'

const summaryCards = [
  { label: 'Attendance Rate', value: '94.6%', delta: '+2.3%' },
  { label: 'Avg. Daily Hours', value: '7.9h', delta: '+0.6h' },
  { label: 'Late Arrivals', value: '31', delta: '-8%' },
  { label: 'Absence Rate', value: '3.7%', delta: '-0.4%' },
]

const departmentData = [
  { name: 'Engineering', inOffice: 39, remote: 14 },
  { name: 'Operations', inOffice: 26, remote: 9 },
  { name: 'Support', inOffice: 18, remote: 11 },
  { name: 'Marketing', inOffice: 15, remote: 8 },
  { name: 'Sales', inOffice: 12, remote: 6 },
]

export default function ReportsPage() {
  return (
    <Layout title="Reports & Analytics" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Analytics</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Reports & Analytics</h2>
              <p className="mt-2 text-sm text-slate-400">Track attendance efficiency, department trends, and team performance.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 hover:border-slate-500">
              <Download className="h-4 w-4" /> Export Monthly Report
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
              <p className="text-xs text-slate-400">{card.label}</p>
              <p className="mt-5 text-3xl font-bold text-white">{card.value}</p>
              <p className="mt-2 text-xs text-emerald-300">{card.delta}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Overview</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Department Productivity</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>

            <div className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-slate-300">{dept.name}</span>
                    <span className="text-sm text-slate-400">{dept.inOffice + dept.remote} total</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${((dept.inOffice + dept.remote) / 60) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Performance</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Trend Snapshot</h3>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <TrendingUp className="h-4 w-4" /> +8.2%
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-sky-300">
                  <BarChart3 className="h-4 w-4" /> Attendance
                </div>
                <p className="mt-5 text-3xl font-bold text-white">94.6%</p>
                <p className="mt-2 text-xs text-slate-400">This month</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-violet-300">
                  <PieChart className="h-4 w-4" /> Timeliness
                </div>
                <p className="mt-5 text-3xl font-bold text-white">88.1%</p>
                <p className="mt-2 text-xs text-slate-400">On-time arrivals</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
