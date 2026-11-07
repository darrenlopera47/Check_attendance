import { useMemo, useState, useEffect } from 'react'
import { Search, Plus, Eye, Pencil, Trash2, Building2 } from 'lucide-react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { useToast } from '../components/ToastProvider'

const initialDepartments = [
  { code: 'ENG', name: 'Engineering', head: 'Ariana Brooks', employees: 18, description: 'Product and platform engineering', status: 'Active' },
  { code: 'OPS', name: 'Operations', head: 'Lucas Reed', employees: 24, description: 'Daily execution and coordination', status: 'Active' },
  { code: 'SUP', name: 'Support', head: 'Daniel Kim', employees: 12, description: 'Customer support and issue response', status: 'Active' },
  { code: 'MKT', name: 'Marketing', head: 'Sofia Patel', employees: 10, description: 'Brand awareness and campaigns', status: 'Inactive' },
  { code: 'HR', name: 'Human Resources', head: 'Olivia Carter', employees: 8, description: 'People and culture operations', status: 'Active' },
]

export default function DepartmentManagementPage() {
  const { addToast } = useToast()
  const [departments, setDepartments] = useState(initialDepartments)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ departmentName: '', departmentCode: '', departmentHead: '', description: '', status: 'Active' })

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => `${department.name} ${department.code} ${department.head}`.toLowerCase().includes(search.toLowerCase()))
  }, [search, departments])

  const pagination = usePagination({ totalItems: filteredDepartments.length, pageSize: 10 })

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [search, pagination.resetToFirstPage])

  const paginatedDepartments = filteredDepartments.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  )

  const openCreate = () => {
    setSelectedDepartment(null)
    setForm({ departmentName: '', departmentCode: '', departmentHead: '', description: '', status: 'Active' })
    setShowModal(true)
  }

  const openEdit = (department) => {
    setSelectedDepartment(department)
    setForm({
      departmentName: department.name,
      departmentCode: department.code,
      departmentHead: department.head,
      description: department.description,
      status: department.status,
    })
    setShowModal(true)
  }

  const openView = (department) => {
    setSelectedDepartment(department)
    setShowView(true)
  }

  const openDelete = (department) => {
    setSelectedDepartment(department)
    setShowDelete(true)
  }

  const saveDepartment = () => {
    if (!form.departmentName || !form.departmentCode || !form.departmentHead || !form.description) {
      addToast({ type: 'error', title: 'Missing fields', description: 'Please complete all required department fields.', duration: 3500 })
      return
    }

    if (departments.some((department) => department.code.toLowerCase() === form.departmentCode.trim().toLowerCase() && (!selectedDepartment || department.code !== selectedDepartment.code))) {
      addToast({ type: 'error', title: 'Duplicate department', description: 'A department with this code already exists.', duration: 3500 })
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      if (selectedDepartment) {
        setDepartments((current) => current.map((department) => department.code === selectedDepartment.code ? { ...department, code: form.departmentCode.trim().toUpperCase(), name: form.departmentName.trim(), head: form.departmentHead.trim(), description: form.description.trim(), status: form.status } : department))
        addToast({ type: 'success', title: 'Department updated', description: `${form.departmentName} was updated successfully.`, duration: 3000 })
      } else {
        setDepartments((current) => [{ code: form.departmentCode.trim().toUpperCase(), name: form.departmentName.trim(), head: form.departmentHead.trim(), employees: 0, description: form.description.trim(), status: form.status }, ...current])
        addToast({ type: 'success', title: 'Department created', description: `${form.departmentName} was created successfully.`, duration: 3000 })
      }

      setSubmitting(false)
      setShowModal(false)
      setSelectedDepartment(null)
      setForm({ departmentName: '', departmentCode: '', departmentHead: '', description: '', status: 'Active' })
    }, 500)
  }

  const deleteDepartment = () => {
    if (!selectedDepartment) return
    setSubmitting(true)
    window.setTimeout(() => {
      setDepartments((current) => current.filter((department) => department.code !== selectedDepartment.code))
      addToast({ type: 'success', title: 'Department deleted', description: `${selectedDepartment.name} was removed successfully.`, duration: 3000 })
      setSubmitting(false)
      setSelectedDepartment(null)
      setShowDelete(false)
    }, 500)
  }

  return (
    <Layout title="Department Management" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Administration</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Department Management</h2>
              <p className="mt-2 text-sm text-slate-400">Organize employees by company departments.</p>
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400">
              <Plus className="h-4 w-4" /> Add Department
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Total Departments</p>
            <p className="mt-5 text-3xl font-bold text-white">{departments.length}</p>
            <p className="mt-2 text-xs text-slate-300">Across organization</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Active Departments</p>
            <p className="mt-5 text-3xl font-bold text-white">{departments.filter((department) => department.status === 'Active').length}</p>
            <p className="mt-2 text-xs text-emerald-300">Operational teams</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Total Employees</p>
            <p className="mt-5 text-3xl font-bold text-white">{departments.reduce((total, department) => total + department.employees, 0)}</p>
            <p className="mt-2 text-xs text-sky-300">Assigned team members</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Departments Without Employees</p>
            <p className="mt-5 text-3xl font-bold text-white">{departments.filter((department) => department.employees === 0).length}</p>
            <p className="mt-2 text-xs text-amber-300">Needs attention</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="mb-5 flex items-center gap-3">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="Search department"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Department Code</th>
                  <th className="pb-3 pr-4">Department Name</th>
                  <th className="pb-3 pr-4">Department Head</th>
                  <th className="pb-3 pr-4">Total Employees</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDepartments.map((department) => (
                  <tr key={department.code} className="border-b border-slate-800 last:border-0">
                    <td className="py-3 pr-4 text-slate-200">{department.code}</td>
                    <td className="py-3 pr-4 text-white">{department.name}</td>
                    <td className="py-3 pr-4 text-slate-300">{department.head}</td>
                    <td className="py-3 pr-4 text-slate-300">{department.employees}</td>
                    <td className="py-3 pr-4 text-slate-300">{department.description}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${department.status === 'Active' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>
                        {department.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button type="button" title="View department" onClick={() => openView(department)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Eye className="h-3.5 w-3.5" /></button>
                        <button type="button" title="Edit department" onClick={() => openEdit(department)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" title="Delete department" onClick={() => openDelete(department)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-rose-300 hover:text-rose-200"><Trash2 className="h-3.5 w-3.5" /></button>
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
            totalRecords={filteredDepartments.length}
            pageSize={pagination.pageSize}
            loading={submitting}
            onPageChange={pagination.updatePage}
            onPageSizeChange={pagination.setPageSize}
          />
        </section>
      </div>

      <Modal open={showModal} title={selectedDepartment ? 'Edit Department' : 'Add Department'} subtitle={selectedDepartment ? 'Update' : 'Create'} onClose={() => setShowModal(false)} size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Department Name</label>
            <input value={form.departmentName} onChange={(e) => setForm({ ...form, departmentName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Department Code</label>
              <input value={form.departmentCode} onChange={(e) => setForm({ ...form, departmentCode: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Department Head</label>
              <input value={form.departmentHead} onChange={(e) => setForm({ ...form, departmentHead: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[120px] w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Cancel</button>
          <button type="button" disabled={submitting} onClick={saveDepartment} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Saving...' : selectedDepartment ? 'Save Department' : 'Create Department'}
          </button>
        </div>
      </Modal>

      <Modal open={showView} title="Department Details" subtitle="View" onClose={() => setShowView(false)} size="lg">
        {selectedDepartment && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Department</p>
              <h4 className="mt-2 text-2xl font-semibold text-white">{selectedDepartment.name}</h4>
              <p className="mt-2 text-slate-300">{selectedDepartment.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Code</span><span className="mt-1 block text-white">{selectedDepartment.code}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Head</span><span className="mt-1 block text-white">{selectedDepartment.head}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Employees</span><span className="mt-1 block text-white">{selectedDepartment.employees}</span></div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowView(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={showDelete}
        title="Delete department?"
        message={`Are you sure you want to delete this record? This will remove ${selectedDepartment?.name ?? 'this department'} from the system.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={deleteDepartment}
        onCancel={() => setShowDelete(false)}
        loading={submitting}
        dangerous
      />
    </Layout>
  )
}
