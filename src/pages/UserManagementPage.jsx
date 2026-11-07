import { useMemo, useState, useEffect } from 'react'
import { Search, Plus, Eye, Pencil, Trash2, Users } from 'lucide-react'
import { useToast } from '../components/ToastProvider'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'

const initialUsers = [
  { employeeId: 'CHK-1001', name: 'Ariana Brooks', email: 'ariana@checkattend.io', role: 'Admin', department: 'Engineering', status: 'Active', created: '2026-01-10', avatar: 'AB' },
  { employeeId: 'CHK-1002', name: 'Lucas Reed', email: 'lucas@checkattend.io', role: 'HR Manager', department: 'Operations', status: 'Active', created: '2026-01-11', avatar: 'LR' },
  { employeeId: 'CHK-1003', name: 'Maya Chen', email: 'maya@checkattend.io', role: 'Employee', department: 'Operations', status: 'Inactive', created: '2026-02-09', avatar: 'MC' },
  { employeeId: 'CHK-1004', name: 'Daniel Kim', email: 'daniel@checkattend.io', role: 'Support Lead', department: 'Support', status: 'Active', created: '2026-02-18', avatar: 'DK' },
  { employeeId: 'CHK-1005', name: 'Sofia Patel', email: 'sofia@checkattend.io', role: 'Marketing Lead', department: 'Marketing', status: 'Active', created: '2026-03-21', avatar: 'SP' },
]

const roles = ['Admin', 'HR Manager', 'Employee', 'Support Lead', 'Marketing Lead']
const departments = ['Engineering', 'Operations', 'Support', 'Marketing']
const statuses = ['Active', 'Inactive']

const defaultForm = {
  employeeId: '',
  fullName: '',
  email: '',
  contactNumber: '',
  department: '',
  position: '',
  role: '',
  accountStatus: 'Active',
}

export default function UserManagementPage() {
  const { addToast } = useToast()
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [departmentFilter, setDepartmentFilter] = useState('All Departments')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showModal, setShowModal] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = `${user.name} ${user.email} ${user.employeeId}`.toLowerCase().includes(search.toLowerCase())
      const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
      const matchesDepartment = departmentFilter === 'All Departments' || user.department === departmentFilter
      const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus
    })
  }, [search, roleFilter, departmentFilter, statusFilter, users])

  const pagination = usePagination({ totalItems: filteredUsers.length, pageSize: 10 })

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [search, roleFilter, departmentFilter, statusFilter, pagination.resetToFirstPage])

  const paginatedUsers = filteredUsers.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  )

  const openCreateModal = () => {
    setSelectedUser(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setForm({
      employeeId: user.employeeId,
      fullName: user.name,
      email: user.email,
      contactNumber: '0917-123-4567',
      department: user.department,
      position: user.role === 'Employee' ? 'Team Member' : user.role,
      role: user.role,
      accountStatus: user.status,
    })
    setShowModal(true)
  }

  const openViewModal = (user) => {
    setSelectedUser(user)
    setShowView(true)
  }

  const openDeleteConfirm = (user) => {
    setSelectedUser(user)
    setShowDelete(true)
  }

  const saveUser = () => {
    if (!form.employeeId || !form.fullName || !form.email || !form.department || !form.role) {
      addToast({ type: 'error', title: 'Missing fields', description: 'Please complete the required user information before saving.', duration: 3500 })
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(form.email)) {
      addToast({ type: 'error', title: 'Invalid email', description: 'Please enter a valid email address.', duration: 3500 })
      return
    }

    if (users.some((user) => user.employeeId === form.employeeId && user.employeeId !== selectedUser?.employeeId)) {
      addToast({ type: 'error', title: 'Duplicate record', description: 'This employee ID already exists in the system.', duration: 3500 })
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      if (selectedUser) {
        setUsers((current) => current.map((user) => user.employeeId === selectedUser.employeeId ? { ...user, employeeId: form.employeeId, name: form.fullName, email: form.email, role: form.role, department: form.department, status: form.accountStatus, avatar: form.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || user.avatar } : user))
        addToast({ type: 'success', title: 'User updated', description: `${form.fullName} was updated successfully.`, duration: 3000 })
      } else {
        const nextUser = {
          employeeId: form.employeeId,
          name: form.fullName,
          email: form.email,
          role: form.role,
          department: form.department,
          status: form.accountStatus,
          created: new Date().toISOString().slice(0, 10),
          avatar: form.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(),
        }
        setUsers((current) => [nextUser, ...current])
        addToast({ type: 'success', title: 'User created', description: `${form.fullName} has been added to CheckAttend.`, duration: 3000 })
      }

      setSubmitting(false)
      setShowModal(false)
      setForm(defaultForm)
      setSelectedUser(null)
    }, 500)
  }

  const deleteUser = () => {
    if (!selectedUser) return
    setSubmitting(true)
    window.setTimeout(() => {
      setUsers((current) => current.filter((user) => user.employeeId !== selectedUser.employeeId))
      addToast({ type: 'success', title: 'User deleted', description: `${selectedUser.name} was removed successfully.`, duration: 3000 })
      setSubmitting(false)
      setSelectedUser(null)
      setShowDelete(false)
    }, 500)
  }

  return (
    <Layout title="User Management" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Administration</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">User Management</h2>
              <p className="mt-2 text-sm text-slate-400">Manage user accounts, assigned roles, and department access.</p>
            </div>
            <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400">
              <Plus className="h-4 w-4" /> Add New User
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Total Users</p>
            <p className="mt-5 text-3xl font-bold text-white">{users.length}</p>
            <p className="mt-2 text-xs text-slate-300">Across all departments</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Active Users</p>
            <p className="mt-5 text-3xl font-bold text-white">{users.filter((user) => user.status === 'Active').length}</p>
            <p className="mt-2 text-xs text-emerald-300">Enabled accounts</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Inactive Users</p>
            <p className="mt-5 text-3xl font-bold text-white">{users.filter((user) => user.status === 'Inactive').length}</p>
            <p className="mt-2 text-xs text-amber-300">Requires review</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Administrators</p>
            <p className="mt-5 text-3xl font-bold text-white">{users.filter((user) => user.role.toLowerCase().includes('admin')).length}</p>
            <p className="mt-2 text-xs text-sky-300">Admin access</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 md:max-w-md">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="Search users"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Roles</option>
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>

              <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Departments</option>
                {departments.map((department) => <option key={department}>{department}</option>)}
              </select>

              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:outline-none">
                <option>All Status</option>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Employee ID</th>
                  <th className="pb-3 pr-4">Profile Picture</th>
                  <th className="pb-3 pr-4">Full Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Assigned Role</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Account Status</th>
                  <th className="pb-3 pr-4">Created Date</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.employeeId} className="border-b border-slate-800 last:border-0">
                    <td className="py-3 pr-4 text-slate-200">{user.employeeId}</td>
                    <td className="py-3 pr-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-300 text-xs font-bold text-slate-950">
                        {user.avatar}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-white">{user.name}</td>
                    <td className="py-3 pr-4 text-slate-300">{user.email}</td>
                    <td className="py-3 pr-4 text-slate-300">{user.role}</td>
                    <td className="py-3 pr-4 text-slate-300">{user.department}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${user.status === 'Active' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{user.created}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button type="button" title="View user" aria-label="View user" onClick={() => openViewModal(user)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Eye className="h-3.5 w-3.5" /></button>
                        <button type="button" title="Edit user" aria-label="Edit user" onClick={() => openEditModal(user)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" title="Delete user" aria-label="Delete user" onClick={() => openDeleteConfirm(user)} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-rose-300 hover:text-rose-200"><Trash2 className="h-3.5 w-3.5" /></button>
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
            totalRecords={filteredUsers.length}
            pageSize={pagination.pageSize}
            loading={submitting}
            onPageChange={pagination.updatePage}
            onPageSizeChange={pagination.setPageSize}
          />
        </section>
      </div>

      <Modal open={showModal} title={selectedUser ? 'Edit User' : 'Add New User'} subtitle={selectedUser ? 'Update' : 'Create'} onClose={() => setShowModal(false)} size="lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Employee ID</label>
            <input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full Name</label>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Contact Number</label>
            <input value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
              <option value="">Select Department</option>
              {departments.map((department) => <option key={department}>{department}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Position</label>
            <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
              <option value="">Select Role</option>
              {roles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Account Status</label>
            <select value={form.accountStatus} onChange={(e) => setForm({ ...form, accountStatus: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Cancel</button>
          <button type="button" onClick={saveUser} disabled={submitting} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Saving...' : selectedUser ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </Modal>

      <Modal open={showView} title="User Details" subtitle="View" onClose={() => setShowView(false)} size="lg">
        {selectedUser && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-300 text-sm font-bold text-slate-950">{selectedUser.avatar}</div>
              <div>
                <p className="text-xl font-semibold text-white">{selectedUser.name}</p>
                <p className="text-slate-400">{selectedUser.role} · {selectedUser.department}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Employee ID</span><span className="mt-1 block text-white">{selectedUser.employeeId}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Email</span><span className="mt-1 block text-white">{selectedUser.email}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Department</span><span className="mt-1 block text-white">{selectedUser.department}</span></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><span className="block text-slate-400">Status</span><span className="mt-1 block text-white">{selectedUser.status}</span></div>
            </div>
            <div className="flex items-center justify-end">
              <button type="button" onClick={() => setShowView(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={showDelete}
        title="Delete user?"
        message={`Are you sure you want to delete this record? This will permanently remove ${selectedUser?.name ?? 'this user'} from the system.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={deleteUser}
        onCancel={() => setShowDelete(false)}
        loading={submitting}
        dangerous
      />
    </Layout>
  )
}
