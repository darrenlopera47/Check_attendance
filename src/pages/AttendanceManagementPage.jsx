import { useEffect, useMemo, useState } from 'react'
import {
  CalendarRange,
  Download,
  Eye,
  Filter,
  Pencil,
  Search,
  TrendingUp,
  X,
} from 'lucide-react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { useToast } from '../components/ToastProvider'

const initialRecords = [
  { id: 'CHK-1011', name: 'Ariana Brooks', department: 'Engineering', date: '2026-11-07', timeIn: '08:42 AM', timeOut: '06:15 PM', hours: '9h 33m', overtime: '1h 12m', status: 'Present' },
  { id: 'CHK-1022', name: 'Maya Chen', department: 'Operations', date: '2026-11-07', timeIn: '09:06 AM', timeOut: '06:18 PM', hours: '9h 12m', overtime: '0h 45m', status: 'Late' },
  { id: 'CHK-1040', name: 'Emma Lee', department: 'Marketing', date: '2026-11-07', timeIn: '—', timeOut: '—', hours: '0h', overtime: '0h', status: 'Absent' },
  { id: 'CHK-1181', name: 'Liam Scott', department: 'Finance', date: '2026-11-07', timeIn: '08:50 AM', timeOut: '06:12 PM', hours: '9h 22m', overtime: '0h 30m', status: 'Present' },
  { id: 'CHK-1104', name: 'Nolan Price', department: 'HR', date: '2026-11-07', timeIn: '09:28 AM', timeOut: '—', hours: 'In Progress', overtime: '0h', status: 'In Progress' },
  { id: 'CHK-1193', name: 'Sara Kim', department: 'Sales', date: '2026-11-07', timeIn: '—', timeOut: '—', hours: '0h', overtime: '0h', status: 'On Leave' },
  { id: 'CHK-1115', name: 'Daniel Kim', department: 'Support', date: '2026-11-07', timeIn: '08:37 AM', timeOut: '06:05 PM', hours: '9h 28m', overtime: '0h 50m', status: 'Present' },
  { id: 'CHK-1268', name: 'Owen Rivera', department: 'Product', date: '2026-11-07', timeIn: '09:18 AM', timeOut: '06:28 PM', hours: '9h 10m', overtime: '1h 04m', status: 'Late' },
]

const summaryCards = [
  { label: 'Total Attendance Today', value: '246', delta: '+6.4%' },
  { label: 'Present', value: '197', delta: '+12.1%' },
  { label: 'Late', value: '18', delta: '+2.3%' },
  { label: 'Absent', value: '31', delta: '-1.5%' },
  { label: 'On Leave', value: '14', delta: '+0.8%' },
]

const statusStyles = {
  Present: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  Late: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  Absent: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
  'On Leave': 'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  'In Progress': 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
}

const defaultForm = {
  id: '',
  name: '',
  department: 'Engineering',
  date: '',
  timeIn: '',
  timeOut: '',
  hours: '',
  overtime: '0h',
  status: 'Present',
}

export default function AttendanceManagementPage() {
  const { addToast } = useToast()
  const [records, setRecords] = useState(initialRecords)
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [status, setStatus] = useState('All Status')
  const [date, setDate] = useState('2026-11-07')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showView, setShowView] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const filteredRecords = useMemo(() => {
    return records.filter((entry) => {
      const matchesQuery =
        entry.name.toLowerCase().includes(query.toLowerCase()) ||
        entry.id.toLowerCase().includes(query.toLowerCase())

      const matchesDepartment = department === 'All Departments' || entry.department === department
      const matchesStatus = status === 'All Status' || entry.status === status
      const matchesDate = !date || entry.date === date

      return matchesQuery && matchesDepartment && matchesStatus && matchesDate
    })
  }, [records, query, department, status, date])

  const pagination = usePagination({ totalItems: filteredRecords.length, pageSize: 10 })

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [query, department, status, date, pagination.resetToFirstPage])

  const paginatedRecords = filteredRecords.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  )

  const openView = (record) => {
    setSelectedRecord(record)
    setShowView(true)
  }

  const openEdit = (record) => {
    setSelectedRecord(record)
    setForm({
      id: record.id,
      name: record.name,
      department: record.department,
      date: record.date,
      timeIn: record.timeIn === '—' ? '' : record.timeIn,
      timeOut: record.timeOut === '—' ? '' : record.timeOut,
      hours: record.hours,
      overtime: record.overtime,
      status: record.status,
    })
    setShowEdit(true)
  }

  const handleSave = () => {
    if (!form.id || !form.name || !form.department || !form.date) {
      addToast({ type: 'error', title: 'Missing fields', description: 'Please complete the attendance details before saving.', duration: 3500 })
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      setRecords((current) =>
        current.map((record) =>
          record.id === selectedRecord?.id
            ? {
                ...record,
                id: form.id,
                name: form.name,
                department: form.department,
                date: form.date,
                timeIn: form.timeIn || '—',
                timeOut: form.timeOut || '—',
                hours: form.hours || record.hours,
                overtime: form.overtime || '0h',
                status: form.status,
              }
            : record,
        ),
      )

      addToast({
        type: 'success',
        title: 'Attendance updated',
        description: `${form.name}'s attendance record was saved successfully.`,
        duration: 3000,
      })
      setSubmitting(false)
      setShowEdit(false)
      setSelectedRecord(null)
      setForm(defaultForm)
    }, 500)
  }

  const handleExport = () => {
    const rows = [
      ['Employee ID', 'Employee Name', 'Department', 'Date', 'Time In', 'Time Out', 'Hours', 'Overtime', 'Status'],
      ...records.map((record) => [record.id, record.name, record.department, record.date, record.timeIn, record.timeOut, record.hours, record.overtime, record.status]),
    ]

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'attendance-records.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    addToast({ type: 'success', title: 'Report exported', description: 'Attendance records were downloaded successfully.', duration: 2500 })
  }

  const handleQuickFilter = () => {
    addToast({ type: 'info', title: 'Filters applied', description: 'Attendance records have been filtered using your selected criteria.', duration: 2500 })
  }

  return (
    <Layout title="Attendance Management" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Attendance</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Attendance Management</h2>
              <p className="mt-2 text-sm text-slate-400">Monitor and manage employee attendance records.</p>
            </div>
            <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 font-medium text-slate-950 hover:bg-sky-400">
              <Download className="h-4 w-4" /> Export Records
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-800 bg-[#111B30] p-4 shadow-[0_16px_30px_rgba(2,6,23,0.45)] transition hover:-translate-y-0.5 hover:border-sky-500/40">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">{card.label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-5 text-3xl font-bold text-white">{card.value}</p>
              <p className="mt-2 text-xs text-emerald-300">{card.delta}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300">
                <Search className="h-4 w-4 text-slate-500" />
                <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none" placeholder="Search employees" />
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300">
                <CalendarRange className="h-4 w-4 text-slate-500" />
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="bg-transparent text-white focus:outline-none" />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <select value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Operations</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>HR</option>
                <option>Sales</option>
                <option>Support</option>
                <option>Product</option>
              </select>

              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Status</option>
                <option>Present</option>
                <option>Late</option>
                <option>Absent</option>
                <option>On Leave</option>
                <option>In Progress</option>
              </select>

              <button type="button" onClick={handleQuickFilter} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 hover:border-slate-500">
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Employee ID</th>
                  <th className="pb-3 pr-4">Employee Name</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Time In</th>
                  <th className="pb-3 pr-4">Time Out</th>
                  <th className="pb-3 pr-4">Working Hours</th>
                  <th className="pb-3 pr-4">Overtime</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record) => (
                  <tr key={`${record.id}-${record.date}`} className="border-b border-slate-800 last:border-0">
                    <td className="py-3 pr-4 text-slate-200">{record.id}</td>
                    <td className="py-3 pr-4 text-slate-200">{record.name}</td>
                    <td className="py-3 pr-4 text-slate-300">{record.department}</td>
                    <td className="py-3 pr-4 text-slate-300">{record.date}</td>
                    <td className="py-3 pr-4 text-slate-300">{record.timeIn}</td>
                    <td className="py-3 pr-4 text-slate-300">{record.timeOut}</td>
                    <td className="py-3 pr-4 text-slate-300">{record.hours}</td>
                    <td className="py-3 pr-4 text-slate-300">{record.overtime}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => openView(record)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white" aria-label="View attendance record">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => openEdit(record)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white" aria-label="Edit attendance record">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
            <p className="text-sm text-slate-400">Showing {filteredRecords.length} entries</p>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">Previous</button>
              <button type="button" className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950">1</button>
              <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">Next</button>
            </div>
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalRecords={filteredRecords.length}
            pageSize={pagination.pageSize}
            loading={submitting}
            onPageChange={pagination.updatePage}
            onPageSizeChange={pagination.setPageSize}
          />
        </section>
      </div>

      <Modal open={showView} title="Attendance Details" subtitle="View" onClose={() => setShowView(false)} size="lg">
        {selectedRecord && (
          <div className="space-y-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Employee</p>
              <h4 className="mt-2 text-2xl font-semibold text-white">{selectedRecord.name}</h4>
              <p className="mt-2 text-slate-300">{selectedRecord.department} · {selectedRecord.status}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Employee ID</span><span className="mt-1 block text-white">{selectedRecord.id}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Date</span><span className="mt-1 block text-white">{selectedRecord.date}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Time In</span><span className="mt-1 block text-white">{selectedRecord.timeIn}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Time Out</span><span className="mt-1 block text-white">{selectedRecord.timeOut}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Hours</span><span className="mt-1 block text-white">{selectedRecord.hours}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Overtime</span><span className="mt-1 block text-white">{selectedRecord.overtime}</span></div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowView(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showEdit} title="Edit Attendance" subtitle="Update" onClose={() => setShowEdit(false)} size="lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Employee ID</label>
            <input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Employee Name</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Department</label>
            <select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
              <option>Engineering</option>
              <option>Operations</option>
              <option>Marketing</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Sales</option>
              <option>Support</option>
              <option>Product</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Date</label>
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Time In</label>
            <input type="time" value={form.timeIn} onChange={(event) => setForm({ ...form, timeIn: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Time Out</label>
            <input type="time" value={form.timeOut} onChange={(event) => setForm({ ...form, timeOut: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Hours</label>
            <input value={form.hours} onChange={(event) => setForm({ ...form, hours: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Overtime</label>
            <input value={form.overtime} onChange={(event) => setForm({ ...form, overtime: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Status</label>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
              <option>Present</option>
              <option>Late</option>
              <option>Absent</option>
              <option>On Leave</option>
              <option>In Progress</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={() => setShowEdit(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Cancel</button>
          <button type="button" disabled={submitting} onClick={handleSave} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </Modal>
    </Layout>
  )
}
