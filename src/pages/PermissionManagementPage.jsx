import { useMemo, useState, useEffect } from 'react'
import { Search, Download, ShieldCheck } from 'lucide-react'
import Layout from '../components/Layout'
import Pagination from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'

const roles = ['Super Admin', 'Admin', 'HR Manager', 'HR Staff', 'Supervisor', 'Team Leader', 'Employee', 'Attendance Officer']

const permissions = [
  { module: 'Dashboard', actions: { view: true, create: false, edit: false, delete: false, approve: false, export: true } },
  { module: 'Attendance', actions: { view: true, create: true, edit: true, delete: false, approve: true, export: true } },
  { module: 'Employees', actions: { view: true, create: true, edit: true, delete: false, approve: false, export: false } },
  { module: 'Overtime', actions: { view: true, create: false, edit: false, delete: false, approve: true, export: true } },
  { module: 'Leave Management', actions: { view: true, create: false, edit: false, delete: false, approve: true, export: true } },
  { module: "Who's In / Out", actions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
  { module: 'Reports', actions: { view: true, create: false, edit: false, delete: false, approve: false, export: true } },
  { module: 'User Management', actions: { view: false, create: false, edit: false, delete: false, approve: false, export: false } },
  { module: 'Role Management', actions: { view: false, create: false, edit: false, delete: false, approve: false, export: false } },
  { module: 'Department Management', actions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
  { module: 'Permission Management', actions: { view: false, create: false, edit: false, delete: false, approve: false, export: false } },
  { module: 'System Settings', actions: { view: false, create: false, edit: false, delete: false, approve: false, export: false } },
]

const actionLabels = { view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete', approve: 'Approve', export: 'Export' }

export default function PermissionManagementPage() {
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('HR Manager')
  const [matrix, setMatrix] = useState(permissions)

  const filteredRoles = useMemo(() => roles.filter((role) => role.toLowerCase().includes(search.toLowerCase())), [search])
  const pagination = usePagination({ totalItems: filteredRoles.length, pageSize: 4 })

  const paginatedRoles = filteredRoles.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  )

  useEffect(() => {
    pagination.resetToFirstPage()
  }, [search, pagination.resetToFirstPage])

  useEffect(() => {
    if (paginatedRoles.length > 0 && !paginatedRoles.includes(selectedRole)) {
      setSelectedRole(paginatedRoles[0])
    }
  }, [paginatedRoles, selectedRole])

  const togglePermission = (moduleName, actionKey) => {
    setMatrix((previous) => previous.map((item) => item.module === moduleName ? {
      ...item,
      actions: { ...item.actions, [actionKey]: !item.actions[actionKey] },
    } : item))
  }

  return (
    <Layout title="Permission Management" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Administration</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Permission Management</h2>
              <p className="mt-2 text-sm text-slate-400">Configure module access and user permissions based on assigned roles.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500">Enable All</button>
              <button className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500">Disable All</button>
              <button className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400">Save Permissions</button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5">
            <div className="mb-4 flex items-center gap-3">
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300">
                <Search className="h-4 w-4 text-slate-500" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none" placeholder="Search role" />
              </label>
            </div>

            <div className="space-y-2">
              {paginatedRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left ${selectedRole === role ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-slate-800 bg-slate-950/60 text-slate-300'}`}
                >
                  <div>
                    <p className="font-medium">{role}</p>
                    <p className="mt-1 text-xs text-slate-400">{role === 'HR Manager' ? '2 users assigned' : '1 user assigned'}</p>
                  </div>
                  {selectedRole === role && <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Pagination
                compact
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalRecords={filteredRoles.length}
                pageSize={pagination.pageSize}
                onPageChange={pagination.updatePage}
                onPageSizeChange={pagination.setPageSize}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Role Access</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{selectedRole}</h3>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-emerald-300">
                <ShieldCheck className="h-4 w-4" /> Unsaved Changes
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 border-b border-slate-800 bg-[#111B30] px-3 py-3 text-slate-400">Module</th>
                    {Object.keys(actionLabels).map((actionKey) => (
                      <th key={actionKey} className="border-b border-slate-800 bg-[#111B30] px-3 py-3 text-center text-slate-400">{actionLabels[actionKey]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((module) => (
                    <tr key={module.module} className="border-b border-slate-800">
                      <td className="sticky left-0 z-10 border-b border-slate-800 bg-[#111B30] px-3 py-3 text-slate-200">{module.module}</td>
                      {Object.keys(actionLabels).map((actionKey) => (
                        <td key={`${module.module}-${actionKey}`} className="border-b border-slate-800 px-3 py-3 text-center">
                          <button
                            onClick={() => togglePermission(module.module, actionKey)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${module.actions[actionKey] ? 'bg-sky-500' : 'bg-slate-700'}`}
                          >
                            <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${module.actions[actionKey] ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
