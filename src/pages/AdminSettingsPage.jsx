import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ChevronRight, FolderCog, KeyRound, Lock, Plus, Search, ShieldCheck, Trash2, Users, X } from 'lucide-react'
import Layout from '../components/Layout'
import { createRole, createDepartment, createUser, createBlankPermissionMatrix, createDefaultRolePermissions, fetchDepartments, fetchRoles, fetchUsers, fetchRolePermissions, saveRolePermissions, permissionActions, getModuleMeta } from '../lib/adminSettings'

const moduleOrder = [
  'dashboard',
  'attendance',
  'employees',
  'overtime',
  'leave_management',
  'monitoring',
  'reports',
  'user_management',
  'role_management',
  'department_management',
  'permission_management',
  'system_settings',
]

const actionLabels = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  approve: 'Approve',
  export: 'Export',
}

const defaultMatrix = createBlankPermissionMatrix()

export default function AdminSettingsPage() {
  const [roles, setRoles] = useState([])
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [permissionMatrix, setPermissionMatrix] = useState(defaultMatrix)
  const [dirty, setDirty] = useState(false)
  const [searchRole, setSearchRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showCreateDepartment, setShowCreateDepartment] = useState(false)
  const [roleForm, setRoleForm] = useState({ role_name: '', description: '', status: 'active' })
  const [departmentForm, setDepartmentForm] = useState({ department_name: '', department_code: '', department_head: '', description: '', status: 'active' })
  const [userForm, setUserForm] = useState({ full_name: '', email: '', employee_id: '', department_id: '', position: '', role_id: '', account_status: 'active' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [expanded, setExpanded] = useState(true)

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      role.role_name.toLowerCase().includes(searchRole.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchRole.toLowerCase()),
    )
  }, [roles, searchRole])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [rolesResponse, departmentsResponse, usersResponse] = await Promise.all([
          fetchRoles(),
          fetchDepartments(),
          fetchUsers(),
        ])

        const nextRoles = rolesResponse.data || []
        setRoles(nextRoles)

        if (nextRoles.length) {
          setSelectedRoleId(nextRoles[0].id)
          setSelectedRole(nextRoles[0])
          const permissionResponse = await fetchRolePermissions(nextRoles[0].id)
          setPermissionMatrix(permissionResponse.data || createDefaultRolePermissions(nextRoles[0].role_name || 'Admin'))
        }

        setDepartments(departmentsResponse.data || [])
        setUsers(usersResponse.data || [])
      } catch (error) {
        setToast({ type: 'error', message: error.message || 'Unable to load admin settings data.' })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!selectedRoleId) return
    const currentRole = roles.find((role) => role.id === selectedRoleId)
    setSelectedRole(currentRole || null)
  }, [selectedRoleId, roles])

  const roleUserCount = (roleId) => users.filter((user) => user.role_id === roleId).length

  const updatePermission = (moduleKey, actionKey, value) => {
    setPermissionMatrix((previous) => ({
      ...previous,
      [moduleKey]: {
        ...previous[moduleKey],
        [actionKey]: value,
      },
    }))
    setDirty(true)
  }

  const enableAll = () => {
    const next = structuredClone(permissionMatrix)
    Object.keys(next).forEach((moduleKey) => {
      Object.keys(next[moduleKey]).forEach((actionKey) => {
        next[moduleKey][actionKey] = true
      })
    })
    setPermissionMatrix(next)
    setDirty(true)
  }

  const disableAll = () => {
    const next = structuredClone(permissionMatrix)
    Object.keys(next).forEach((moduleKey) => {
      Object.keys(next[moduleKey]).forEach((actionKey) => {
        next[moduleKey][actionKey] = false
      })
    })
    setPermissionMatrix(next)
    setDirty(true)
  }

  const resetPermissions = async () => {
    if (!selectedRole) {
      return
    }

    const response = await fetchRolePermissions(selectedRole.id)
    setPermissionMatrix(response.data || createDefaultRolePermissions(selectedRole.role_name || 'Admin'))
    setDirty(false)
    setToast({ type: 'success', message: `Permissions reset for ${selectedRole.role_name}.` })
  }

  const savePermissions = async () => {
    if (!selectedRole) return
    setSaving(true)
    try {
      await saveRolePermissions(selectedRole.id, permissionMatrix)
      setDirty(false)
      setToast({ type: 'success', message: `Permissions saved for ${selectedRole.role_name}.` })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Unable to save permissions.' })
    } finally {
      setSaving(false)
    }
  }

  const submitRole = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        role_name: roleForm.role_name,
        description: roleForm.description,
        status: roleForm.status,
        is_system_role: false,
      }
      const { data } = await createRole(payload)
      const nextRoles = [data, ...roles]
      setRoles(nextRoles)
      setSelectedRoleId(data.id)
      setSelectedRole(data)
      setPermissionMatrix(createDefaultRolePermissions(data.role_name))
      setShowCreateRole(false)
      setRoleForm({ role_name: '', description: '', status: 'active' })
      setToast({ type: 'success', message: `Role ${data.role_name} created successfully.` })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Unable to create role.' })
    }
  }

  const submitDepartment = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        department_name: departmentForm.department_name,
        department_code: departmentForm.department_code,
        department_head: departmentForm.department_head,
        description: departmentForm.description,
        status: departmentForm.status,
      }
      const { data } = await createDepartment(payload)
      setDepartments((previous) => [data, ...previous])
      setShowCreateDepartment(false)
      setDepartmentForm({ department_name: '', department_code: '', department_head: '', description: '', status: 'active' })
      setToast({ type: 'success', message: `Department ${data.department_name} created successfully.` })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Unable to create department.' })
    }
  }

  const submitUser = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        full_name: userForm.full_name,
        email: userForm.email,
        employee_id: userForm.employee_id,
        department_id: userForm.department_id,
        role_id: userForm.role_id,
        position: userForm.position,
        account_status: userForm.account_status,
      }
      const { data } = await createUser(payload)
      setUsers((previous) => [data, ...previous])
      setShowCreateUser(false)
      setUserForm({ full_name: '', email: '', employee_id: '', department_id: '', position: '', role_id: '', account_status: 'active' })
      setToast({ type: 'success', message: `User ${data.full_name} created successfully.` })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Unable to create user.' })
    }
  }

  const handleRoleSelection = async (roleId) => {
    if (dirty) {
      const shouldContinue = window.confirm('You have unsaved permission changes. Continue and discard them?')
      if (!shouldContinue) return
    }

    setSelectedRoleId(roleId)
    const role = roles.find((item) => item.id === roleId)
    setSelectedRole(role)
    const rolePermissions = await fetchRolePermissions(roleId)
    setPermissionMatrix(rolePermissions.data || createDefaultRolePermissions(role?.role_name || 'Admin'))
    setDirty(false)
  }

  const sidebarModules = [
    { label: 'User Management', icon: Users, path: '/dashboard/admin/settings/users' },
    { label: 'Role Management', icon: ShieldCheck, path: '/dashboard/admin/settings/roles' },
    { label: 'Department Management', icon: FolderCog, path: '/dashboard/admin/settings/departments' },
    { label: 'Permission Management', icon: Lock, path: '/dashboard/admin/settings/permissions' },
  ]

  if (loading) {
    return (
      <Layout title="Admin Settings" userName="Ariana Brooks">
        <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-8 text-slate-300">Loading admin settings…</div>
      </Layout>
    )
  }

  return (
    <Layout title="Admin Settings" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Administration</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Admin Settings</h2>
              <p className="mt-2 text-sm text-slate-400">Manage users, roles, departments, and role permissions across the organization.</p>
            </div>
            <button
              onClick={() => setExpanded((previous) => !previous)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 hover:border-slate-500"
            >
              {expanded ? 'Collapse Menu' : 'Expand Menu'}
            </button>
          </div>
        </section>

        {expanded && (
          <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-4 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
            <div className="space-y-2">
              {sidebarModules.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-sky-300" />
                    <span>{label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Total Users</p>
            <p className="mt-5 text-3xl font-bold text-white">{users.length}</p>
            <p className="mt-2 text-xs text-slate-300">Across all departments</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Active Users</p>
            <p className="mt-5 text-3xl font-bold text-white">{users.filter((user) => user.account_status === 'active').length}</p>
            <p className="mt-2 text-xs text-emerald-300">Active accounts</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Inactive Users</p>
            <p className="mt-5 text-3xl font-bold text-white">{users.filter((user) => user.account_status !== 'active').length}</p>
            <p className="mt-2 text-xs text-amber-300">Requires review</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-4">
            <p className="text-xs text-slate-400">Administrators</p>
            <p className="mt-5 text-3xl font-bold text-white">{roles.filter((role) => role.role_name.toLowerCase().includes('admin')).length}</p>
            <p className="mt-2 text-xs text-sky-300">Admin roles</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">User Access</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">User Management</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowCreateUser(true)} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400">Add New User</button>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 md:max-w-md">
              <Search className="h-4 w-4 text-slate-500" />
              <input className="w-full bg-transparent placeholder:text-slate-500 focus:outline-none" placeholder="Search users" />
            </label>
            <div className="flex flex-wrap gap-2">
              <select className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200">
                <option>All Roles</option>
                {roles.map((role) => <option key={role.id}>{role.role_name}</option>)}
              </select>
              <select className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200">
                <option>All Departments</option>
                {departments.map((dept) => <option key={dept.id}>{dept.department_name}</option>)}
              </select>
              <select className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200">
                <option>All Status</option>
                <option>active</option>
                <option>inactive</option>
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
                  <th className="pb-3 pr-4">Email Address</th>
                  <th className="pb-3 pr-4">Assigned Role</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Account Status</th>
                  <th className="pb-3 pr-4">Date Created</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 last:border-0">
                    <td className="py-3 pr-4 text-slate-200">{user.employee_id || '—'}</td>
                    <td className="py-3 pr-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-300 text-xs font-bold text-slate-950">
                        {(user.full_name || 'U').split(' ').slice(0,2).map((part) => part[0]).join('').toUpperCase()}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-white">{user.full_name}</td>
                    <td className="py-3 pr-4 text-slate-300">{user.email}</td>
                    <td className="py-3 pr-4 text-slate-300">{user.role_name || 'Unassigned'}</td>
                    <td className="py-3 pr-4 text-slate-300">{user.department_name || 'Unassigned'}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${user.account_status === 'active' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>
                        {user.account_status || 'inactive'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200">View</button>
                        <button className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200">Edit</button>
                        <button className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-rose-300">Deactivate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Role Access</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Role Management</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowCreateRole(true)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500">Create Role</button>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300">
              <Search className="h-4 w-4 text-slate-500" />
              <input value={searchRole} onChange={(event) => setSearchRole(event.target.value)} className="w-full bg-transparent placeholder:text-slate-500 focus:outline-none" placeholder="Search role" />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Role Name</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Assigned Users</th>
                  <th className="pb-3 pr-4">Assigned Permissions</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Date Created</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr key={role.id} className={`border-b border-slate-800 last:border-0 ${selectedRoleId === role.id ? 'bg-sky-500/5' : ''}`} onClick={() => handleRoleSelection(role.id)}>
                    <td className="py-3 pr-4 text-white">{role.role_name}</td>
                    <td className="py-3 pr-4 text-slate-300">{role.description || '—'}</td>
                    <td className="py-3 pr-4 text-slate-300">{roleUserCount(role.id)}</td>
                    <td className="py-3 pr-4 text-slate-300">{permissionActions.length} actions</td>
                    <td className="py-3 pr-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${role.status === 'active' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>{role.status || 'active'}</span></td>
                    <td className="py-3 pr-4 text-slate-300">{role.created_at ? new Date(role.created_at).toLocaleDateString() : '—'}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200">View</button>
                        <button className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200">Edit</button>
                        <button className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-5">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Permissions</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Permission Management</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={enableAll} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500">Enable All</button>
              <button onClick={disableAll} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500">Disable All</button>
              <button onClick={resetPermissions} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500">Reset Changes</button>
              <button onClick={savePermissions} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400" disabled={saving}>
                {saving ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>

          {selectedRole && (
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div>
                <p className="text-xs text-slate-400">Selected Role</p>
                <p className="mt-1 text-lg font-semibold text-white">{selectedRole.role_name}</p>
              </div>
              {dirty && <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-300">Unsaved changes</span>}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 border-b border-slate-800 bg-[#111B30] px-3 py-3 text-slate-400">Module</th>
                  {permissionActions.map((action) => (
                    <th key={action} className="border-b border-slate-800 bg-[#111B30] px-3 py-3 text-center text-slate-400">{actionLabels[action]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {moduleOrder.map((moduleKey) => {
                  const moduleName = getModuleMeta().find((module) => module.key === moduleKey)?.name || moduleKey
                  const permissionMap = permissionMatrix[moduleKey] || {}

                  return (
                    <tr key={moduleKey} className="border-b border-slate-800">
                      <td className="sticky left-0 z-10 border-b border-slate-800 bg-[#111B30] px-3 py-3 text-slate-200">{moduleName}</td>
                      {permissionActions.map((action) => (
                        <td key={`${moduleKey}-${action}`} className="border-b border-slate-800 px-3 py-3 text-center">
                          <button
                            onClick={() => updatePermission(moduleKey, action, !Boolean(permissionMap[action]))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${permissionMap[action] ? 'bg-sky-500' : 'bg-slate-700'}`}
                            aria-label={`${moduleName} ${actionLabels[action]}`}
                          >
                            <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${permissionMap[action] ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showCreateRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#111B30] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Create</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Create Role</h3>
              </div>
              <button onClick={() => setShowCreateRole(false)} className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={submitRole} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Role Name</label>
                <input required value={roleForm.role_name} onChange={(event) => setRoleForm({ ...roleForm, role_name: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Role Description</label>
                <textarea value={roleForm.description} onChange={(event) => setRoleForm({ ...roleForm, description: event.target.value })} className="min-h-[100px] w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Status</label>
                <select value={roleForm.status} onChange={(event) => setRoleForm({ ...roleForm, status: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateRole(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Cancel</button>
                <button type="submit" className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#111B30] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Create</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Create Department</h3>
              </div>
              <button onClick={() => setShowCreateDepartment(false)} className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={submitDepartment} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Department Name</label>
                <input required value={departmentForm.department_name} onChange={(event) => setDepartmentForm({ ...departmentForm, department_name: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Department Code</label>
                  <input value={departmentForm.department_code} onChange={(event) => setDepartmentForm({ ...departmentForm, department_code: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Department Head</label>
                  <input value={departmentForm.department_head} onChange={(event) => setDepartmentForm({ ...departmentForm, department_head: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Description</label>
                <textarea value={departmentForm.description} onChange={(event) => setDepartmentForm({ ...departmentForm, description: event.target.value })} className="min-h-[100px] w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Status</label>
                <select value={departmentForm.status} onChange={(event) => setDepartmentForm({ ...departmentForm, status: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateDepartment(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Cancel</button>
                <button type="submit" className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-xl rounded-[28px] border border-slate-800 bg-[#111B30] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Create</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Add User</h3>
              </div>
              <button onClick={() => setShowCreateUser(false)} className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={submitUser} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Full Name</label>
                  <input required value={userForm.full_name} onChange={(event) => setUserForm({ ...userForm, full_name: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Email Address</label>
                  <input required type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Employee ID</label>
                  <input required value={userForm.employee_id} onChange={(event) => setUserForm({ ...userForm, employee_id: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Position</label>
                  <input value={userForm.position} onChange={(event) => setUserForm({ ...userForm, position: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Assign Department</label>
                  <select value={userForm.department_id} onChange={(event) => setUserForm({ ...userForm, department_id: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
                    <option value="">Select Department</option>
                    {departments.map((department) => <option key={department.id} value={department.id}>{department.department_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Assign Role</label>
                  <select value={userForm.role_id} onChange={(event) => setUserForm({ ...userForm, role_id: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
                    <option value="">Select Role</option>
                    {roles.map((role) => <option key={role.id} value={role.id}>{role.role_name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Account Status</label>
                <select value={userForm.account_status} onChange={(event) => setUserForm({ ...userForm, account_status: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateUser(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">Cancel</button>
                <button type="submit" className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-2xl border border-slate-700 bg-[#111B30] p-4 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
              {toast.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{toast.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
