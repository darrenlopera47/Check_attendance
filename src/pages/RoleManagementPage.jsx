import { useMemo, useState, useEffect } from 'react'
import { Search, Plus, Eye, Pencil, Trash2, Shield } from 'lucide-react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { useToast } from '../components/ToastProvider'

const initialRoles = [
  { name: 'Super Admin', description: 'Full platform access across all modules', users: 1, permissions: 72, status: 'Active', created: '2026-01-08' },
  { name: 'Admin', description: 'Core operational management access', users: 3, permissions: 62, status: 'Active', created: '2026-01-15' },
  { name: 'HR Manager', description: 'Manages hiring, attendance, and leave compliance', users: 2, permissions: 44, status: 'Active', created: '2026-01-17' },
  { name: 'HR Staff', description: 'Supports HR operations and employee requests', users: 4, permissions: 28, status: 'Active', created: '2026-02-03' },
  { name: 'Supervisor', description: 'Monitors team attendance and workflow status', users: 6, permissions: 20, status: 'Inactive', created: '2026-02-14' },
  { name: 'Team Leader', description: 'Leads team coordination and reporting', users: 8, permissions: 18, status: 'Active', created: '2026-03-05' },
  { name: 'Employee', description: 'Standard employee access to personal data', users: 36, permissions: 12, status: 'Active', created: '2026-03-11' },
]

export default function RoleManagementPage() {
  const { addToast } = useToast()
  const [roles, setRoles] = useState(initialRoles)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showView, setShowView] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ roleName: '', roleDescription: '', status: 'Active' })

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => `${role.name} ${role.description}`.toLowerCase().includes(search.toLowerCase()))
  }, [search, roles])

  const pagination = usePagination({ totalItems: filteredRoles.length, pageSize: 10 })

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [search, pagination.resetToFirstPage])

  const paginatedRoles = filteredRoles.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  )

  const openCreate = () => {
    setSelectedRole(null)
    setForm({ roleName: '', roleDescription: '', status: 'Active' })
    setShowModal(true)
  }

  const openEdit = (role) => {
    setSelectedRole(role)
    setForm({ roleName: role.name, roleDescription: role.description, status: role.status })
    setShowModal(true)
  }

  const openView = (role) => {
    setSelectedRole(role)
    setShowView(true)
  }

  const openDelete = (role) => {
    setSelectedRole(role)
    setShowDelete(true)
  }

  const saveRole = () => {
    if (!form.roleName || !form.roleDescription) {
      addToast({ type: 'error', title: 'Missing fields', description: 'Role name and description are required.', duration: 3500 })
      return
    }

    if (roles.some((role) => role.name.toLowerCase() === form.roleName.trim().toLowerCase() && (!selectedRole || role.name !== selectedRole.name))) {
      addToast({ type: 'error', title: 'Duplicate role', description: 'This role already exists. Please use a different name.', duration: 3500 })
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      if (selectedRole) {
        setRoles((current) => current.map((role) => role.name === selectedRole.name ? { ...role, name: form.roleName.trim(), description: form.roleDescription.trim(), status: form.status } : role))
        addToast({ type: 'success', title: 'Role updated', description: `${form.roleName} was updated successfully.`, duration: 3000 })
      } else {
        setRoles((current) => [{ name: form.roleName.trim(), description: form.roleDescription.trim(), users: 0, permissions: 0, status: form.status, created: new Date().toISOString().slice(0, 10) }, ...current])
        addToast({ type: 'success', title: 'Role created', description: `${form.roleName} was created successfully.`, duration: 3000 })
      }

      setSubmitting(false)
      setShowModal(false)
      setSelectedRole(null)
      setForm({ roleName: '', roleDescription: '', status: 'Active' })
    }, 500)
  }

  const deleteRole = () => {
    if (!selectedRole) return
    setSubmitting(true)
    window.setTimeout(() => {
      setRoles((current) => current.filter((role) => role.name !== selectedRole.name))
      addToast({ type: 'success', title: 'Role removed', description: `${selectedRole.name} was deleted successfully.`, duration: 3000 })
      setSubmitting(false)
      setSelectedRole(null)
      setShowDelete(false)
    }, 500)
  }

  return (
    <Layout title="Role Management" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Administration</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Role Management</h2>
              <p className="mt-2 text-sm text-slate-400">Create and manage system roles and their access levels.</p>
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400">
              <Plus className="h-4 w-4" /> Create New Role
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Total Roles</p>
            <p className="mt-5 text-3xl font-bold text-white">{roles.length}</p>
            <p className="mt-2 text-xs text-slate-300">System roles</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Active Roles</p>
            <p className="mt-5 text-3xl font-bold text-white">{roles.filter((role) => role.status === 'Active').length}</p>
            <p className="mt-2 text-xs text-emerald-300">Enabled access</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Inactive Roles</p>
            <p className="mt-5 text-3xl font-bold text-white">{roles.filter((role) => role.status === 'Inactive').length}</p>
            <p className="mt-2 text-xs text-amber-300">Disabled access</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Assigned Users</p>
            <p className="mt-5 text-3xl font-bold text-white">{roles.reduce((total, role) => total + role.users, 0)}</p>
            <p className="mt-2 text-xs text-sky-300">Total assignments</p>
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
                placeholder="Search roles"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Role Name</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Assigned Users</th>
                  <th className="pb-3 pr-4">Permissions Count</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Date Created</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRoles.map((role) => (
                  <tr key={role.name} className="border-b border-slate-800 last:border-0">
                    <td className="py-3 pr-4 text-white">{role.name}</td>
                    <td className="py-3 pr-4 text-slate-300">{role.description}</td>
                    <td className="py-3 pr-4 text-slate-300">{role.users}</td>
                    <td className="py-3 pr-4 text-slate-300">{role.permissions}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${role.status === 'Active' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>
                        {role.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{role.created}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button type="button" title="View role" onClick={() => openView(role)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Eye className="h-3.5 w-3.5" /></button>
                        <button type="button" title="Edit role" onClick={() => openEdit(role)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" title="Delete role" onClick={() => openDelete(role)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-rose-300 hover:text-rose-200"><Trash2 className="h-3.5 w-3.5" /></button>
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
            totalRecords={filteredRoles.length}
            pageSize={pagination.pageSize}
            loading={submitting}
            onPageChange={pagination.updatePage}
            onPageSizeChange={pagination.setPageSize}
          />
        </section>
      </div>

      <Modal open={showModal} title={selectedRole ? 'Edit Role' : 'Create Role'} subtitle={selectedRole ? 'Update' : 'Create'} onClose={() => setShowModal(false)} size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Role Name</label>
            <input value={form.roleName} onChange={(e) => setForm({ ...form, roleName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Role Description</label>
            <textarea value={form.roleDescription} onChange={(e) => setForm({ ...form, roleDescription: e.target.value })} className="min-h-[120px] w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
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
          <button type="button" disabled={submitting} onClick={saveRole} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Saving...' : selectedRole ? 'Save Role' : 'Create Role'}
          </button>
        </div>
      </Modal>

      <Modal open={showView} title="Role Details" subtitle="View" onClose={() => setShowView(false)} size="lg">
        {selectedRole && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Role</p>
              <h4 className="mt-2 text-2xl font-semibold text-white">{selectedRole.name}</h4>
              <p className="mt-2 text-slate-300">{selectedRole.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Assigned users</span><span className="mt-1 block text-white">{selectedRole.users}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Permissions</span><span className="mt-1 block text-white">{selectedRole.permissions}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Status</span><span className="mt-1 block text-white">{selectedRole.status}</span></div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowView(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={showDelete}
        title="Delete role?"
        message={`Are you sure you want to delete this record? This will remove ${selectedRole?.name ?? 'this role'} from the system.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={deleteRole}
        onCancel={() => setShowDelete(false)}
        loading={submitting}
        dangerous
      />
    </Layout>
  )
}
