import { useEffect, useMemo, useState } from 'react'
import { Activity, Clock3, Search, Users, Wifi } from 'lucide-react'
import Layout from '../components/Layout'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'

const employees = [
  { name: 'Ariana Brooks', department: 'Engineering', status: 'Working', location: 'Office', checkIn: '08:45', hours: '7h 15m' },
  { name: 'Lucas Reed', department: 'Operations', status: 'On Break', location: 'Cafeteria', checkIn: '08:30', hours: '7h 30m' },
  { name: 'Maya Chen', department: 'Operations', status: 'Working', location: 'Warehouse', checkIn: '09:00', hours: '6h 45m' },
  { name: 'Daniel Kim', department: 'Support', status: 'Away', location: 'Remote', checkIn: '08:50', hours: '6h 30m' },
  { name: 'Sofia Patel', department: 'Marketing', status: 'Working', location: 'Office', checkIn: '08:55', hours: '7h 05m' },
  { name: 'Noah Walker', department: 'Sales', status: 'Offline', location: 'Field', checkIn: '08:20', hours: '5h 35m' },
]

const statusColors = {
  Working: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  'On Break': 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  Away: 'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  Offline: 'bg-slate-500/10 text-slate-300 border border-slate-500/20',
}

export default function MonitoringPage() {
  const [query, setQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  const filtered = useMemo(() => {
    return employees.filter((employee) => {
      const matchesQuery =
        employee.name.toLowerCase().includes(query.toLowerCase()) ||
        employee.department.toLowerCase().includes(query.toLowerCase())

      const matchesStatus =
        selectedStatus === 'All Status' || employee.status === selectedStatus

      return matchesQuery && matchesStatus
    })
  }, [query, selectedStatus])

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pagination = usePagination({ totalItems: filtered.length, pageSize: 10 })

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [query, selectedStatus, pagination.resetToFirstPage])

  const paginatedEmployees = filtered.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  )

  return (
    <Layout title="Who's In & Who's Out" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Monitoring</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Who's In & Who's Out</h2>
              <p className="mt-2 text-sm text-slate-400">Real-time attendance visibility across departments.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              <Wifi className="h-4 w-4" /> Live Feed
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Present Today</p>
            <p className="mt-5 text-3xl font-bold text-white">186</p>
            <p className="mt-2 text-xs text-emerald-300">+12 from yesterday</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Away</p>
            <p className="mt-5 text-3xl font-bold text-white">28</p>
            <p className="mt-2 text-xs text-sky-300">7 on break</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Remote</p>
            <p className="mt-5 text-3xl font-bold text-white">42</p>
            <p className="mt-2 text-xs text-violet-300">Across 3 teams</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Current Time</p>
            <p className="mt-5 text-3xl font-bold text-white">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            <p className="mt-2 text-xs text-slate-300">Synced in real time</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 md:max-w-md">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="Search employee or department"
              />
            </label>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
            >
              <option>All Status</option>
              <option>Working</option>
              <option>On Break</option>
              <option>Away</option>
              <option>Offline</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedEmployees.map((employee) => (
              <div key={employee.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-semibold text-slate-950">
                      {employee.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-white">{employee.name}</p>
                      <p className="text-xs text-slate-400">{employee.department}</p>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusColors[employee.status]}`}>
                    {employee.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111B30] p-2.5">
                    <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-sky-300" /> Checked in</span>
                    <span className="font-medium text-white">{employee.checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111B30] p-2.5">
                    <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-300" /> Hours</span>
                    <span className="font-medium text-white">{employee.hours}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111B30] p-2.5">
                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-300" /> Location</span>
                    <span className="font-medium text-white">{employee.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalRecords={filtered.length}
            pageSize={pagination.pageSize}
            onPageChange={pagination.updatePage}
            onPageSizeChange={pagination.setPageSize}
          />
        </section>
      </div>
    </Layout>
  )
}
