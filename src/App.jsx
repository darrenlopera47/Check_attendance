import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastProvider } from './components/ToastProvider'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AttendanceManagementPage from './pages/AttendanceManagementPage'
import EmployeeManagementPage from './pages/EmployeeManagementPage'
import EmployeeProfilePage from './pages/EmployeeProfilePage'
import OvertimeManagementPage from './pages/OvertimeManagementPage'
import LeaveManagementPage from './pages/LeaveManagementPage'
import MonitoringPage from './pages/MonitoringPage'
import ReportsPage from './pages/ReportsPage'
import UserManagementPage from './pages/UserManagementPage'
import RoleManagementPage from './pages/RoleManagementPage'
import DepartmentManagementPage from './pages/DepartmentManagementPage'
import PermissionManagementPage from './pages/PermissionManagementPage'

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/attendance"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <AttendanceManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/employees"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <EmployeeManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/employees/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <EmployeeProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/overtime"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <OvertimeManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/leaves"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <LeaveManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/monitoring"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <MonitoringPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/roles"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <RoleManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <DepartmentManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/permissions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <PermissionManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/employee"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
