import { supabase, isSupabaseConfigured } from './supabase'

export const fallbackRoles = [
  { id: 'role-super-admin', role_name: 'Super Admin', description: 'Full platform access', is_system_role: true, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-admin', role_name: 'Admin', description: 'Operational administration access', is_system_role: true, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-hr-manager', role_name: 'HR Manager', description: 'People operations and approval workflows', is_system_role: true, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-hr-staff', role_name: 'HR Staff', description: 'Support HR administration', is_system_role: true, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-supervisor', role_name: 'Supervisor', description: 'Team oversight and attendance review', is_system_role: true, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-team-leader', role_name: 'Team Leader', description: 'Department team coordination', is_system_role: true, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-employee', role_name: 'Employee', description: 'Standard staff access', is_system_role: true, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export const fallbackDepartments = [
  { id: 'dept-engineering', department_name: 'Engineering', department_code: 'ENG', department_head: 'Ariana Brooks', description: 'Product and platform engineering', status: 'active', created_at: new Date().toISOString() },
  { id: 'dept-operations', department_name: 'Operations', department_code: 'OPS', department_head: 'Lucas Reed', description: 'Operational excellence and staff coordination', status: 'active', created_at: new Date().toISOString() },
  { id: 'dept-support', department_name: 'Support', department_code: 'SUP', department_head: 'Daniel Kim', description: 'Customer support and issue resolution', status: 'active', created_at: new Date().toISOString() },
  { id: 'dept-marketing', department_name: 'Marketing', department_code: 'MKT', department_head: 'Sofia Patel', description: 'Brand, demand, and communications', status: 'active', created_at: new Date().toISOString() },
  { id: 'dept-sales', department_name: 'Sales', department_code: 'SAL', department_head: 'Noah Walker', description: 'Revenue and customer engagement', status: 'active', created_at: new Date().toISOString() },
  { id: 'dept-hr', department_name: 'Human Resources', department_code: 'HR', department_head: 'Olivia Carter', description: 'People operations and compliance', status: 'active', created_at: new Date().toISOString() },
]

export const fallbackUsers = [
  { id: 'user-1', employee_id: 'CHK-1001', full_name: 'Ariana Brooks', email: 'ariana@checkattend.io', department_id: 'dept-engineering', department_name: 'Engineering', role_id: 'role-admin', role_name: 'Admin', position: 'Operations Lead', account_status: 'active', created_at: new Date().toISOString(), avatar_url: '' },
  { id: 'user-2', employee_id: 'CHK-1002', full_name: 'Lucas Reed', email: 'lucas@checkattend.io', department_id: 'dept-operations', department_name: 'Operations', role_id: 'role-hr-manager', role_name: 'HR Manager', position: 'Operations Manager', account_status: 'active', created_at: new Date().toISOString(), avatar_url: '' },
  { id: 'user-3', employee_id: 'CHK-1003', full_name: 'Maya Chen', email: 'maya@checkattend.io', department_id: 'dept-operations', department_name: 'Operations', role_id: 'role-employee', role_name: 'Employee', position: 'Operations Analyst', account_status: 'active', created_at: new Date().toISOString(), avatar_url: '' },
  { id: 'user-4', employee_id: 'CHK-1004', full_name: 'Daniel Kim', email: 'daniel@checkattend.io', department_id: 'dept-support', department_name: 'Support', role_id: 'role-employee', role_name: 'Employee', position: 'Support Specialist', account_status: 'inactive', created_at: new Date().toISOString(), avatar_url: '' },
]

const permissionModules = [
  { module_key: 'dashboard', module_name: 'Dashboard' },
  { module_key: 'attendance', module_name: 'Attendance' },
  { module_key: 'employees', module_name: 'Employees' },
  { module_key: 'overtime', module_name: 'Overtime' },
  { module_key: 'leave_management', module_name: 'Leave Management' },
  { module_key: 'monitoring', module_name: "Who's In / Out" },
  { module_key: 'reports', module_name: 'Reports' },
  { module_key: 'user_management', module_name: 'User Management' },
  { module_key: 'role_management', module_name: 'Role Management' },
  { module_key: 'department_management', module_name: 'Department Management' },
  { module_key: 'permission_management', module_name: 'Permission Management' },
  { module_key: 'system_settings', module_name: 'System Settings' },
]

export const permissionActions = ['view', 'create', 'edit', 'delete', 'approve', 'export']

export function createBlankPermissionMatrix() {
  return permissionModules.reduce((acc, module) => {
    acc[module.module_key] = permissionActions.reduce((actions, action) => {
      actions[action] = false
      return actions
    }, {})
    return acc
  }, {})
}

export function createDefaultRolePermissions(roleName = 'Admin') {
  const matrix = createBlankPermissionMatrix()

  if (roleName === 'Employee') {
    matrix.dashboard.view = true
    matrix.attendance.view = true
    matrix.monitoring.view = true
    return matrix
  }

  if (roleName === 'Super Admin' || roleName === 'Admin' || roleName === 'HR Manager') {
    Object.values(matrix).forEach((actions) => {
      permissionActions.forEach((action) => {
        actions[action] = true
      })
    })
    matrix.user_management.view = true
    matrix.user_management.create = true
    matrix.user_management.edit = true
    matrix.user_management.delete = true
    matrix.permission_management.view = true
    matrix.permission_management.edit = true
    return matrix
  }

  if (roleName === 'HR Staff') {
    matrix.dashboard.view = true
    matrix.attendance.view = true
    matrix.attendance.create = true
    matrix.attendance.edit = true
    matrix.employees.view = true
    matrix.overtime.view = true
    matrix.leave_management.view = true
    matrix.leave_management.approve = true
    matrix.reports.view = true
    matrix.reports.export = true
    return matrix
  }

  if (roleName === 'Attendance Officer') {
    matrix.dashboard.view = true
    matrix.attendance.view = true
    matrix.attendance.create = true
    matrix.monitoring.view = true
    return matrix
  }

  if (roleName === 'Department Manager') {
    matrix.dashboard.view = true
    matrix.attendance.view = true
    matrix.employees.view = true
    matrix.employees.create = true
    matrix.employees.edit = true
    matrix.department_management.view = true
    return matrix
  }

  if (roleName === 'Team Leader') {
    matrix.dashboard.view = true
    matrix.attendance.view = true
    matrix.employees.view = true
    matrix.monitoring.view = true
    return matrix
  }

  matrix.dashboard.view = true
  return matrix
}

export const seedPermissions = () => {
  const permissions = []

  permissionModules.forEach((module) => {
    permissionActions.forEach((action) => {
      permissions.push({
        id: `perm-${module.module_key}-${action}`,
        module_key: module.module_key,
        module_name: module.module_name,
        action_key: action,
        action_name: action,
        description: `${module.module_name} ${action} permission`,
      })
    })
  })

  return permissions
}

const buildPermissionRecord = (roleId, permissionId, isAllowed = true) => ({
  id: `${roleId}-${permissionId}`,
  role_id: roleId,
  permission_id: permissionId,
  is_allowed: isAllowed,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

export async function fetchRoles() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: fallbackRoles }
  }

  const { data, error } = await supabase.from('roles').select('*').order('role_name', { ascending: true })
  if (error) throw error
  return { data: data?.length ? data : fallbackRoles }
}

export async function fetchDepartments() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: fallbackDepartments }
  }

  const { data, error } = await supabase.from('departments').select('*').order('department_name', { ascending: true })
  if (error) throw error
  return { data: data?.length ? data : fallbackDepartments }
}

export async function fetchUsers() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: fallbackUsers }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*, departments(department_name), roles(role_name)')
    .order('full_name', { ascending: true })

  if (error) throw error
  return { data: data?.length ? data : fallbackUsers }
}

export async function createRole(rolePayload) {
  if (!isSupabaseConfigured || !supabase) {
    const created = {
      ...rolePayload,
      id: `role-${Date.now()}`,
      is_system_role: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    fallbackRoles.unshift(created)
    return { data: created, error: null }
  }

  const { data, error } = await supabase.from('roles').insert([rolePayload]).select().single()
  if (error) throw error
  return { data, error: null }
}

export async function updateRole(roleId, payload) {
  if (!isSupabaseConfigured || !supabase) {
    const index = fallbackRoles.findIndex((role) => role.id === roleId)
    if (index >= 0) {
      fallbackRoles[index] = { ...fallbackRoles[index], ...payload, updated_at: new Date().toISOString() }
    }
    return { data: fallbackRoles[index], error: null }
  }

  const { data, error } = await supabase.from('roles').update(payload).eq('id', roleId).select().single()
  if (error) throw error
  return { data, error: null }
}

export async function deleteRole(roleId) {
  if (!isSupabaseConfigured || !supabase) {
    const index = fallbackRoles.findIndex((role) => role.id === roleId)
    if (index >= 0) fallbackRoles.splice(index, 1)
    return { data: { success: true }, error: null }
  }

  const { error } = await supabase.from('roles').delete().eq('id', roleId)
  if (error) throw error
  return { data: { success: true }, error: null }
}

export async function createDepartment(payload) {
  if (!isSupabaseConfigured || !supabase) {
    const created = {
      ...payload,
      id: `dept-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    fallbackDepartments.unshift(created)
    return { data: created, error: null }
  }

  const { data, error } = await supabase.from('departments').insert([payload]).select().single()
  if (error) throw error
  return { data, error: null }
}

export async function updateDepartment(departmentId, payload) {
  if (!isSupabaseConfigured || !supabase) {
    const index = fallbackDepartments.findIndex((dept) => dept.id === departmentId)
    if (index >= 0) {
      fallbackDepartments[index] = { ...fallbackDepartments[index], ...payload }
    }
    return { data: fallbackDepartments[index], error: null }
  }

  const { data, error } = await supabase.from('departments').update(payload).eq('id', departmentId).select().single()
  if (error) throw error
  return { data, error: null }
}

export async function deleteDepartment(departmentId) {
  if (!isSupabaseConfigured || !supabase) {
    const index = fallbackDepartments.findIndex((dept) => dept.id === departmentId)
    if (index >= 0) fallbackDepartments.splice(index, 1)
    return { data: { success: true }, error: null }
  }

  const { error } = await supabase.from('departments').delete().eq('id', departmentId)
  if (error) throw error
  return { data: { success: true }, error: null }
}

export async function fetchRolePermissions(roleId) {
  if (!isSupabaseConfigured || !supabase) {
    const role = fallbackRoles.find((item) => item.id === roleId) || fallbackRoles[0]
    const defaultMatrix = createDefaultRolePermissions(role?.role_name || 'Admin')
    return { data: defaultMatrix }
  }

  const { data, error } = await supabase
    .from('role_permissions')
    .select('is_allowed, permissions:permission_id (id, module_key, module_name, action_key, action_name)')
    .eq('role_id', roleId)

  if (error) throw error

  if (!data?.length) {
    const role = (await fetchRoles()).data.find((item) => item.id === roleId) || { role_name: 'Admin' }
    return { data: createDefaultRolePermissions(role.role_name || 'Admin') }
  }

  const matrix = createBlankPermissionMatrix()

  data.forEach((entry) => {
    const permission = entry.permissions
    if (permission && permission.module_key && permission.action_key) {
      matrix[permission.module_key] = matrix[permission.module_key] || {}
      matrix[permission.module_key][permission.action_key] = Boolean(entry.is_allowed)
    }
  })

  return { data: matrix }
}

export async function saveRolePermissions(roleId, permissionMatrix) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { success: true, roleId }, error: null }
  }

  const permissionEntries = seedPermissions()
  const toInsert = []

  permissionEntries.forEach((permission) => {
    const isAllowed = Boolean(permissionMatrix[permission.module_key]?.[permission.action_key])
    toInsert.push({
      role_id: roleId,
      permission_id: permission.id,
      is_allowed: isAllowed,
    })
  })

  const { error: deleteError } = await supabase.from('role_permissions').delete().eq('role_id', roleId)
  if (deleteError) throw deleteError

  const { data, error } = await supabase.from('role_permissions').insert(toInsert).select()
  if (error) throw error

  return { data, error: null }
}

export async function createUser(userPayload) {
  if (!isSupabaseConfigured || !supabase) {
    const created = {
      ...userPayload,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    fallbackUsers.unshift(created)
    return { data: created, error: null }
  }

  const { data, error } = await supabase.from('profiles').insert([userPayload]).select().single()
  if (error) throw error
  return { data, error: null }
}

export async function updateUser(userId, payload) {
  if (!isSupabaseConfigured || !supabase) {
    const index = fallbackUsers.findIndex((user) => user.id === userId)
    if (index >= 0) {
      fallbackUsers[index] = { ...fallbackUsers[index], ...payload }
    }
    return { data: fallbackUsers[index], error: null }
  }

  const { data, error } = await supabase.from('profiles').update(payload).eq('id', userId).select().single()
  if (error) throw error
  return { data, error: null }
}

export function getModuleMeta() {
  return permissionModules.map((module) => ({
    key: module.module_key,
    name: module.module_name,
  }))
}
