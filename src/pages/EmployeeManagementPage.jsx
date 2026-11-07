import { useEffect, useMemo, useState } from 'react'
import { Download, Eye, Filter, MoreHorizontal, Pencil, Plus, Search, UserPlus, X } from 'lucide-react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { useToast } from '../components/ToastProvider'

const initialEmployees = [
  { id: 'CHK-1011', name: 'Ariana Brooks', email: 'ariana@checkattend.io', department: 'Engineering', position: 'Senior Frontend Engineer', hired: '2024-04-18', status: 'Active', avatar: 'AB' },
  { id: 'CHK-1022', name: 'Maya Chen', email: 'maya@checkattend.io', department: 'Operations', position: 'Operations Manager', hired: '2023-02-12', status: 'Active', avatar: 'MC' },
  { id: 'CHK-1040', name: 'Emma Lee', email: 'emma@checkattend.io', department: 'Marketing', position: 'Brand Strategist', hired: '2025-01-02', status: 'Inactive', avatar: 'EL' },
  { id: 'CHK-1093', name: 'Nolan Price', email: 'nolan@checkattend.io', department: 'HR', position: 'HR Specialist', hired: '2022-11-05', status: 'Active', avatar: 'NP' },
  { id: 'CHK-1104', name: 'Daniel Kim', email: 'daniel@checkattend.io', department: 'Support', position: 'Support Lead', hired: '2024-07-14', status: 'Active', avatar: 'DK' },
  { id: 'CHK-1194', name: 'Owen Rivera', email: 'owen@checkattend.io', department: 'Product', position: 'Product Analyst', hired: '2023-09-08', status: 'Active', avatar: 'OR' },
]

const defaultForm = {
  id: '',
  name: '',
  email: '',
  department: 'Engineering',
  position: '',
  hired: '',
  status: 'Active',
}

const summaryCards = [
  { label: 'Total Employees', value: '248', delta: '+12%' },
  { label: 'Active Employees', value: '217', delta: '+8%' },
  { label: 'Inactive Employees', value: '31', delta: '-3%' },
  { label: 'Departments', value: '12', delta: '+2' },
]

const statusStyles = {
  Active: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  Inactive: 'bg-slate-500/10 text-slate-300 border border-slate-500/20',
}

export default function EmployeeManagementPage() {
  const { addToast } = useToast()
  const [employees, setEmployees] = useState(initialEmployees)
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [status, setStatus] = useState('All Status')
  const [showCreate, setShowCreate] = useState(false)
  const [showView, setShowView] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesQuery =
        employee.name.toLowerCase().includes(query.toLowerCase()) ||
        employee.email.toLowerCase().includes(query.toLowerCase()) ||
        employee.id.toLowerCase().includes(query.toLowerCase())

      const matchesDepartment = department === 'All Departments' || employee.department === department
      const matchesStatus = status === 'All Status' || employee.status === status

      return matchesQuery && matchesDepartment && matchesStatus
    })
  }, [employees, query, department, status])

  const pagination = usePagination({ totalItems: filteredEmployees.length, pageSize: 10 })

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [query, department, status, pagination.resetToFirstPage])

  const paginatedEmployees = filteredEmployees.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  )

  const openCreate = () => {
    setSelectedEmployee(null)
    setForm(defaultForm)
    setShowCreate(true)
  }

  const openView = (employee) => {
    setSelectedEmployee(employee)
    setShowView(true)
  }

  const openEdit = (employee) => {
    setSelectedEmployee(employee)
    setForm({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      hired: employee.hired,
      status: employee.status,
    })
    setShowCreate(true)
  }

  const handleSave = () => {
    if (!form.id || !form.name || !form.email || !form.department || !form.position) {
      addToast({ type: 'error', title: 'Missing fields', description: 'Please complete all required employee details.', duration: 3500 })
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(form.email)) {
      addToast({ type: 'error', title: 'Invalid email', description: 'Please enter a valid employee email address.', duration: 3500 })
      return
    }

    if (employees.some((employee) => employee.id === form.id && employee.id !== selectedEmployee?.id)) {
      addToast({ type: 'error', title: 'Duplicate employee ID', description: 'This employee ID already exists in the system.', duration: 3500 })
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      if (selectedEmployee) {
        setEmployees((current) => current.map((employee) => employee.id === selectedEmployee.id ? { ...employee, ...form, avatar: form.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() } : employee))
        addToast({ type: 'success', title: 'Employee updated', description: `${form.name} was updated successfully.`, duration: 3000 })
      } else {
        const nextEmployee = {
          ...form,
          avatar: form.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(),
          hired: form.hired || new Date().toISOString().slice(0, 10),
        }
        setEmployees((current) => [nextEmployee, ...current])
        addToast({ type: 'success', title: 'Employee created', description: `${form.name} has been added to the workforce.`, duration: 3000 })
      }

      setSubmitting(false)
      setShowCreate(false)
      setSelectedEmployee(null)
      setForm(defaultForm)
    }, 500)
  }

  const handleExport = () => {
    const rows = [
      ['Employee ID', 'Full Name', 'Email', 'Department', 'Position', 'Date Hired', 'Status'],
      ...employees.map((employee) => [employee.id, employee.name, employee.email, employee.department, employee.position, employee.hired, employee.status]),
    ]

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'employee-list.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    addToast({ type: 'success', title: 'Employee list exported', description: 'CSV file downloaded successfully.', duration: 2500 })
  }

  return (
    <Layout title="Employee Management" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Employees</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Employee Management</h2>
              <p className="mt-2 text-sm text-slate-400">Manage employee profiles, departments, positions, and schedules.</p>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 hover:border-slate-500">
                <Download className="h-4 w-4" /> Export List
              </button>
              <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400">
                <Plus className="h-4 w-4" /> Add Employee
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.45)] transition hover:-translate-y-0.5 hover:border-sky-500/40">
              <p className="text-xs text-slate-400">{card.label}</p>
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
            </div>

            <div className="flex flex-wrap gap-3">
              <select value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Operations</option>
                <option>Marketing</option>
                <option>HR</option>
                <option>Support</option>
                <option>Product</option>
              </select>

              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
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
                  <th className="pb-3 pr-4">Profile</th>
                  <th className="pb-3 pr-4">Employee ID</th>
                  <th className="pb-3 pr-4">Full Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Position</th>
                  <th className="pb-3 pr-4">Date Hired</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-slate-800 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-200">
                        {employee.avatar}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-200">{employee.id}</td>
                    <td className="py-3 pr-4 text-white">{employee.name}</td>
                    <td className="py-3 pr-4 text-slate-300">{employee.email}</td>
                    <td className="py-3 pr-4 text-slate-300">{employee.department}</td>
                    <td className="py-3 pr-4 text-slate-300">{employee.position}</td>
                    <td className="py-3 pr-4 text-slate-300">{employee.hired}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[employee.status]}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label="View employee" onClick={() => openView(employee)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Eye className="h-3.5 w-3.5" /></button>
                        <button type="button" aria-label="Edit employee" onClick={() => openEdit(employee)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" aria-label="Assign employee" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><UserPlus className="h-3.5 w-3.5" /></button>
                        <button type="button" aria-label="More employee actions" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
            <p className="text-sm text-slate-400">Showing {filteredEmployees.length} employees</p>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">Previous</button>
              <button type="button" className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950">1</button>
              <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">Next</button>
            </div>
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalRecords={filteredEmployees.length}
            pageSize={pagination.pageSize}
            loading={submitting}
            onPageChange={pagination.updatePage}
            onPageSizeChange={pagination.setPageSize}
          />
        </section>
      </div>

      <Modal open={showCreate} title={selectedEmployee ? 'Edit Employee' : 'Add Employee'} subtitle={selectedEmployee ? 'Update' : 'Create'} onClose={() => setShowCreate(false)} size="lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Employee ID</label>
            <input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full Name</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Department</label>
            <select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
              <option>Engineering</option>
              <option>Operations</option>
              <option>Marketing</option>
              <option>HR</option>
              <option>Support</option>
              <option>Product</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Position</label>
            <input value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Date Hired</label>
            <input type="date" value={form.hired} onChange={(event) => setForm({ ...form, hired: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Status</label>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Cancel</button>
          <button type="button" disabled={submitting} onClick={handleSave} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Saving...' : selectedEmployee ? 'Save Changes' : 'Create Employee'}
          </button>
        </div>
      </Modal>

      <Modal open={showView} title="Employee Details" subtitle="View" onClose={() => setShowView(false)} size="lg">
        {selectedEmployee && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-300 text-sm font-bold text-slate-950">{selectedEmployee.avatar}</div>
              <div>
                <p className="text-xl font-semibold text-white">{selectedEmployee.name}</p>
                <p className="text-slate-400">{selectedEmployee.position}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Employee ID</span><span className="mt-1 block text-white">{selectedEmployee.id}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Email</span><span className="mt-1 block text-white">{selectedEmployee.email}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Department</span><span className="mt-1 block text-white">{selectedEmployee.department}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Status</span><span className="mt-1 block text-white">{selectedEmployee.status}</span></div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowView(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
