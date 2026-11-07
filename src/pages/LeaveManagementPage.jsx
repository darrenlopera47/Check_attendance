import { useMemo, useState, useEffect } from 'react'
import { Check, Download, Eye, Search, X } from 'lucide-react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { useToast } from '../components/ToastProvider'

const initialRequests = [
  { id: 'LV-2001', employee: 'Sofia Patel', department: 'Marketing', type: 'Annual Leave', start: '2026-11-12', end: '2026-11-15', days: '4 days', reason: 'Family trip', requested: '2026-11-02', status: 'Pending' },
  { id: 'LV-2002', employee: 'Ethan Morris', department: 'Finance', type: 'Sick Leave', start: '2026-11-04', end: '2026-11-05', days: '2 days', reason: 'Medical appointment', requested: '2026-11-02', status: 'Approved' },
  { id: 'LV-2003', employee: 'Olivia Carter', department: 'HR', type: 'Maternity Leave', start: '2026-11-20', end: '2027-01-10', days: '52 days', reason: 'Parental leave plan', requested: '2026-10-28', status: 'Approved' },
  { id: 'LV-2004', employee: 'Noah Walker', department: 'Sales', type: 'Emergency Leave', start: '2026-10-29', end: '2026-10-30', days: '2 days', reason: 'Personal emergency', requested: '2026-10-27', status: 'Rejected' },
]

const summaryCards = [
  { label: 'Leave Requests', value: '96', delta: '+8%' },
  { label: 'Approved', value: '68', delta: '+12%' },
  { label: 'Pending', value: '19', delta: '+4%' },
  { label: 'Available Days', value: '1,480', delta: '+5%' },
]

const statusStyles = {
  Pending: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
}

export default function LeaveManagementPage() {
  const { addToast } = useToast()
  const [requests, setRequests] = useState(initialRequests)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All Types')
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

      const matchesType = type === 'All Types' || request.type === type
      const matchesStatus = status === 'All Status' || request.status === status

      return matchesQuery && matchesType && matchesStatus
    })
  }, [requests, query, type, status])

  const pagination = usePagination({ totalItems: filtered.length, pageSize: 10 })

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [query, type, status, pagination.resetToFirstPage])

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
        title: `Leave ${decision.toLowerCase()}`,
        description: `${selected.employee}'s leave request was ${decision.toLowerCase()} successfully.`,
        duration: 3000,
      })
      setSubmitting(false)
      setSelected(null)
      setShowConfirm(false)
    }, 500)
  }

  const handleExport = () => {
    const rows = [
      ['Request ID', 'Employee', 'Department', 'Leave Type', 'Start', 'End', 'Days', 'Reason', 'Requested', 'Status'],
      ...requests.map((request) => [
        request.id,
        request.employee,
        request.department,
        request.type,
        request.start,
        request.end,
        request.days,
        request.reason,
        request.requested,
        request.status,
      ]),
    ]

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'leave-requests.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    addToast({ type: 'success', title: 'Export complete', description: 'Leave request report downloaded successfully.', duration: 2500 })
  }

  return (
    <Layout title="Leave Management" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Leave</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Leave Management</h2>
              <p className="mt-2 text-sm text-slate-400">Track leave balances, approvals, and upcoming time off schedules.</p>
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
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="Search employee"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
              >
                <option>All Types</option>
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Emergency Leave</option>
                <option>Maternity Leave</option>
              </select>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Request ID</th>
                  <th className="pb-3 pr-4">Employee</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Leave Type</th>
                  <th className="pb-3 pr-4">Start</th>
                  <th className="pb-3 pr-4">End</th>
                  <th className="pb-3 pr-4">Days</th>
                  <th className="pb-3 pr-4">Reason</th>
                  <th className="pb-3 pr-4">Requested</th>
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
                    <td className="py-3 pr-4 text-slate-300">{request.type}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.start}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.end}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.days}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.reason}</td>
                    <td className="py-3 pr-4 text-slate-300">{request.requested}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[request.status]}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setSelected(request)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white" aria-label="View leave request">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => openDecision(request, 'Approved')} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-emerald-300 hover:text-emerald-200" aria-label="Approve leave request">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => openDecision(request, 'Rejected')} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-rose-300 hover:text-rose-200" aria-label="Reject leave request">
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
        <Modal open={Boolean(selected)} title="Leave Request" subtitle="Approval" onClose={() => setSelected(null)} size="lg">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <span>Employee</span>
              <span className="font-medium text-white">{selected.employee}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <span>Type</span>
              <span className="font-medium text-white">{selected.type}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <span>Requested Days</span>
              <span className="font-medium text-white">{selected.days}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <span>Date Range</span>
              <span className="font-medium text-white">
                {selected.start} to {selected.end}
              </span>
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
        title={decision === 'Approved' ? 'Approve leave request?' : 'Reject leave request?'}
        message={`Are you sure you want to ${decision.toLowerCase()} this leave request for ${selected?.employee ?? 'this employee'}?`}
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
