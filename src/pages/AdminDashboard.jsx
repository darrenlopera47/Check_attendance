import { useMemo, useState, useEffect } from 'react'
import {
  Activity,
  BellRing,
  BriefcaseBusiness,
  Download,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Layout from '../components/Layout'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import {
  attendanceTrend,
  completedToday,
  employeeRecords,
  liveAttendance,
  monthlyBreakdown,
  overtimeRequests,
  profileCards,
  recentActivities,
} from '../data/mockData'

const chartColors = ['#38BDF8', '#22C55E', '#F59E0B', '#A78BFA']

export default function AdminDashboard() {
  const pagination = usePagination({ totalItems: recentActivities.length, pageSize: 4 })

  const paginatedActivities = useMemo(
    () => recentActivities.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize,
    ),
    [pagination.currentPage, pagination.pageSize],
  )

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [pagination.resetToFirstPage])

  return (
    <Layout title="Overview" userName="Ariana Brooks">
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {profileCards.map((card, index) => (
            <div
              key={card.label}
              className="group rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.55)] transition hover:-translate-y-0.5 hover:border-sky-500/40"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{card.label}</p>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    index % 2 === 0 ? 'bg-sky-500/10 text-sky-300' : 'bg-violet-500/10 text-violet-300'
                  }`}
                >
                  {index < 4 ? '•' : '◦'}
                </div>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <p className="text-3xl font-bold tracking-tight text-white">{card.value}</p>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300">
                  {card.delta}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.5)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Performance</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Daily Attendance</h2>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:border-slate-500">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94A3B8" />
                  <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                  <Tooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="present" fill="#38BDF8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="late" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="absent" fill="#EF4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.5)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Overview</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Monthly Reports</h2>
              </div>
              <TrendingUp className="h-5 w-5 text-sky-300" />
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={monthlyBreakdown.slice(0, 4)} dataKey="attendance" nameKey="month" innerRadius={52} outerRadius={88} paddingAngle={4}>
                    {monthlyBreakdown.slice(0, 4).map((entry, index) => (
                      <Cell key={entry.month} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              {['Present', 'Absent', 'Late', 'On Leave'].map((label, index) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/60 px-2 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: chartColors[index % chartColors.length] }} />
                    <span className="text-slate-300">{label}</span>
                  </div>
                  <span className="text-white">{['92%', '8%', '10%', '4%'][index]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.5)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Monitoring</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Who’s In</h2>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
                <Search className="h-4 w-4" /> Search
              </div>
            </div>

            <div className="space-y-4">
              {liveAttendance.map((person) => (
                <div key={person.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-200">{person.avatar}</div>
                    <div>
                      <p className="font-medium text-white">{person.name}</p>
                      <p className="text-sm text-slate-400">{person.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{person.inTime}</p>
                    <p className="text-xs text-emerald-300">{person.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.5)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Activities</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Recent Activities</h2>
              </div>
              <BellRing className="h-5 w-5 text-sky-300" />
            </div>

            <div className="space-y-4">
              {paginatedActivities.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-white">{item.user}</p>
                      <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-300">{item.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{item.action}</p>
                    <p className="mt-2 text-xs text-slate-500">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalRecords={recentActivities.length}
              pageSize={pagination.pageSize}
              onPageChange={pagination.updatePage}
              onPageSizeChange={pagination.setPageSize}
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.5)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Directory</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Employee Attendance Overview</h2>
              </div>
              <Users className="h-5 w-5 text-sky-300" />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 pr-4">Employee</th>
                    <th className="pb-3 pr-4">Department</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeRecords.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-800 last:border-0">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-white">{employee.name}</p>
                          <p className="text-xs text-slate-500">{employee.id}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">{employee.department}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            employee.status === 'Present'
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : employee.status === 'Late'
                                ? 'bg-amber-500/10 text-amber-300'
                                : 'bg-slate-500/10 text-slate-300'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">{employee.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.5)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Requests</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Overtime Approvals</h2>
              </div>
              <BriefcaseBusiness className="h-5 w-5 text-sky-300" />
            </div>

            <div className="space-y-4">
              {overtimeRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{request.employee}</p>
                      <p className="text-xs text-slate-500">{request.date}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                        request.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : request.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-300'
                            : 'bg-rose-500/10 text-rose-300'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{request.start} - {request.end}</p>
                  <p className="mt-1 text-xs text-slate-400">{request.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
