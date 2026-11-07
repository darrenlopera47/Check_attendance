import { useEffect, useMemo, useState } from 'react'
import { Check, Download, Eye, Filter, Search, X } from 'lucide-react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { useToast } from '../components/ToastProvider'

const initialRequests = [
  { id: 'OT-1001', employee: 'Ariana Brooks', department: 'Engineering', date: '2026-11-07', start: '18:30', end: '20:30', total: '2h 00m', reason: 'Launch support and QA review', requested: '2026-11-06', status: 'Pending' },
  { id: 'OT-1002', employee: 'Lucas Reed', department: 'Operations', date: '2026-11-06', start: '17:00', end: '19:00', total: '2h 00m', reason: 'Client migration rollout', requested: '2026-11-05', status: 'Approved' },
  { id: 'OT-1003', employee: 'Maya Chen', department: 'Operations', date: '2026-11-05', start: '18:00', end: '19:30', total: '1h 30m', reason: 'End-of-month reporting', requested: '2026-11-04', status: 'Rejected' },
  { id: 'OT-1004', employee: 'Daniel Kim', department: 'Support', date: '2026-11-04', start: '18:45', end: '20:15', total: '1h 30m', reason: 'Incident response support', requested: '2026-11-03', status: 'Pending' },
]

const summaryCards = [
  { label: 'Total Overtime Hours', value: '118.5h', delta: '+21%' },
  { label: 'Pending Requests', value: '14', delta: '+3%' },
  { label: 'Approved Requests', value: '92', delta: '+10%' },
  { label: 'Rejected Requests', value: '8', delta: '-2%' },
]

const statusStyles = {
  Pending: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
}

export default function OvertimeManagementPage() {
  const { addToast } = useToast()
  const [requests, setRequests] = useState(initialRequests)
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [status, setStatus] = useState('All Status')
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [decision, setDecision] = useState('Approved')

  const filtered = useMemo(() => {
    return requests.filter((request) => {
      const matchesQuery =
        request.employee.toLowerCase().includes(query.toLowerCase()) ||
        request.id.toLowerCase().includes(query.toLowerCase())

      const matchesDepartment =
        department === 'All Departments' || request.department === department

      const matchesStatus = status === 'All Status' || request.status === status

      return matchesQuery && matchesDepartment && matchesStatus
    })
  }, [requests, query, department, status])

  const pagination = usePagination({ totalItems: filtered.length, pageSize: 10 })

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [query, department, status, pagination.resetToFirstPage])

  const paginatedRequests = filtered.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  )

  const openDecision = (request, nextStatus) => {
    setSelected(request)
    setDecision(nextStatus)
    setShowConfirm(true)
  }

  const processDecision = () => {
    if (!selected) return

    setSubmitting(true)
    window.setTimeout(() => {
      setRequests((current) =>
        current.map((request) => (request.id === selected.id ? { ...request, status: decision } : request))
      )
      addToast({
        type: decision === 'Approved' ? 'success' : 'warning',
        title: `Request ${decision.toLowerCase()}`,
        description: `${selected.employee}'s overtime request was ${decision.toLowerCase()} successfully.`,
        duration: 3000,
      })
      setSubmitting(false)
      setSelected(null)
      setShowConfirm(false)
    }, 500)
  }

  const handleExport = () => {
    const rows = [
      ['Request ID', 'Employee', 'Department', 'Date', 'Start', 'End', 'Total Hours', 'Reason', 'Requested', 'Status'],
      ...requests.map((request) => [request.id, request.employee, request.department, request.date, request.start, request.end, request.total, request.reason, request.requested, request.status]),
    ]

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'overtime-requests.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    addToast({ type: 'success', title: 'Export complete', description: 'Overtime report was downloaded successfully.', duration: 2500 })
  }

  return (
    <Layout title="Overtime Management" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Overtime</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Overtime Management</h2>
              <p className="mt-2 text-sm text-slate-400">Review, monitor, and manage employee overtime requests.</p>
            </div>
            <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 hover:border-slate-500">
              <Download className="h-4 w-4" /> Export Report
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-800 bg-[#111B30] p-4 shadow-[0_16px_30px_rgba(2,6,23,0.45)] transition hover:-translate-y-0.5 hover:border-sky-500/40">
              <p className="text-xs text-slate-400">{card.label}</p>
              <p className="mt-5 text-3xl font-bold text-white">{card.value}</p>
              <p className="mt-2 text-xs text-emerald-300">{card.delta}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 md:max-w-md">
              <Search className="h-4 w-4 text-slate-500" />
              <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none" placeholder="Search employee" />
            </label>

            <div className="flex flex-wrap gap-3">
              <select value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Operations</option>
                <option>Support</option>
              </select>

              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>

              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 hover:border-slate-500">
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Request ID</th>
                  <th className="pb-3 pr-4">Employee</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Start</th>
                  <th className="pb-3 pr-4">End</th>
                  <th className="pb-3 pr-4">Total Hours</th>
                  <th className="pb-3 pr-4">Reason</th>
                  <th className="pb-3 pr-4">Request Date</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="border-b border-slate-800 last:border-0">
                    <td className="py-3 pr-4 text-slate-200">{request.id}</td>
                    <td className="py-3 pr-4 text-white">{request.employee}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.department}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.date}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.start}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.end}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.total}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.reason}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.requested}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[request.status]}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setSelected(request)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white" aria-label="View overtime request">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => openDecision(request, 'Approved')} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-emerald-300 hover:text-emerald-200" aria-label="Approve overtime request">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => openDecision(request, 'Rejected')} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-rose-300 hover:text-rose-200" aria-label="Reject overtime request">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalRecords={filtered.length}
            pageSize={pagination.pageSize}
            loading={submitting}
            onPageChange={pagination.updatePage}
            onPageSizeChange={pagination.setPageSize}
          />
        </section>
      </div>

      {selected && (
        <Modal open={Boolean(selected)} title="Overtime Request" subtitle="Approval" onClose={() => setSelected(null)} size="lg">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <span>Employee</span>
              <span className="font-medium text-white">{selected.employee}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <span>Department</span>
              <span className="font-medium text-white">{selected.department}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <span>Requested Hours</span>
              <span className="font-medium text-white">{selected.total}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <span>Date</span>
              <span className="font-medium text-white">{selected.date}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="mb-2 text-slate-400">Reason</p>
              <p className="text-white">{selected.reason}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500">
              Cancel
            </button>
            <button type="button" onClick={() => openDecision(selected, 'Rejected')} className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-400">
              Reject
            </button>
            <button type="button" onClick={() => openDecision(selected, 'Approved')} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400">
              Approve
            </button>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={showConfirm}
        title={decision === 'Approved' ? 'Approve overtime request?' : 'Reject overtime request?'}
        message={`Are you sure you want to ${decision.toLowerCase()} this overtime record for ${selected?.employee ?? 'this employee'}?`}
        confirmText={decision === 'Approved' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        onConfirm={processDecision}
        onCancel={() => {
          setShowConfirm(false)
          setSelected(null)
        }}
        loading={submitting}
        dangerous={decision === 'Rejected'}
      />
    </Layout>
  )
}
