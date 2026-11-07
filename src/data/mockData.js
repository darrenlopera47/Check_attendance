export const profileCards = [
  { label: 'Total Employees', value: '248', delta: '+12%', accent: 'emerald' },
  { label: 'Present Today', value: '197', delta: '+9%', accent: 'sky' },
  { label: 'Absent Today', value: '31', delta: '-3%', accent: 'amber' },
  { label: 'Late Employees', value: '18', delta: '+2%', accent: 'rose' },
  { label: 'Currently Working', value: '126', delta: '+14%', accent: 'violet' },
  { label: 'Currently Out', value: '82', delta: '-5%', accent: 'slate' },
  { label: 'Employees on Leave', value: '14', delta: '+1%', accent: 'cyan' },
  { label: 'Total Overtime Hours', value: '118.5h', delta: '+21%', accent: 'orange' },
]

export const attendanceTrend = [
  { name: 'Mon', present: 86, late: 12, absent: 8 },
  { name: 'Tue', present: 89, late: 14, absent: 7 },
  { name: 'Wed', present: 82, late: 11, absent: 10 },
  { name: 'Thu', present: 91, late: 13, absent: 7 },
  { name: 'Fri', present: 94, late: 9, absent: 5 },
  { name: 'Sat', present: 61, late: 7, absent: 11 },
  { name: 'Sun', present: 0, late: 0, absent: 0 },
]

export const monthlyBreakdown = [
  { month: 'Jan', attendance: 92, leave: 4, overtime: 15 },
  { month: 'Feb', attendance: 90, leave: 5, overtime: 18 },
  { month: 'Mar', attendance: 94, leave: 3, overtime: 20 },
  { month: 'Apr', attendance: 88, leave: 6, overtime: 17 },
  { month: 'May', attendance: 96, leave: 2, overtime: 21 },
  { month: 'Jun', attendance: 93, leave: 4, overtime: 19 },
]

export const recentActivities = [
  { id: 1, user: 'Ariana Brooks', action: 'Clocked in', timestamp: '08:42 AM', status: 'Present' },
  { id: 2, user: 'Lucas Reed', action: 'Submitted overtime request', timestamp: '09:15 AM', status: 'Pending' },
  { id: 3, user: 'Maya Chen', action: 'Clocked out', timestamp: '06:10 PM', status: 'OK' },
  { id: 4, user: 'Nolan Price', action: 'Applied for leave', timestamp: 'Yesterday', status: 'Approved' },
]

export const liveAttendance = [
  { name: 'Ariana Brooks', department: 'Engineering', inTime: '08:42 AM', status: 'Working', duration: '2h 18m', avatar: 'AB' },
  { name: 'Maya Chen', department: 'Operations', inTime: '08:58 AM', status: 'Working', duration: '1h 57m', avatar: 'MC' },
  { name: 'Emma Lee', department: 'Marketing', inTime: '09:10 AM', status: 'Late', duration: '1h 32m', avatar: 'EL' },
  { name: 'Liam Scott', department: 'Finance', inTime: '09:18 AM', status: 'Break', duration: '0h 45m', avatar: 'LS' },
]

export const completedToday = [
  { name: 'Daniel Kim', department: 'Support', outTime: '06:02 PM', hours: '9.1h' },
  { name: 'Sara Kim', department: 'Sales', outTime: '05:48 PM', hours: '8.9h' },
  { name: 'Owen Rivera', department: 'Product', outTime: '06:15 PM', hours: '9.4h' },
]

export const employeeRecords = [
  { id: 'CHK-1011', name: 'Ariana Brooks', department: 'Engineering', position: 'Senior Frontend Engineer', status: 'Present', hours: '8.3h', overtime: '1.2h' },
  { id: 'CHK-1042', name: 'Maya Chen', department: 'Operations', position: 'Operations Manager', status: 'Late', hours: '7.6h', overtime: '0.8h' },
  { id: 'CHK-1090', name: 'Emma Lee', department: 'Marketing', position: 'Brand Strategist', status: 'Present', hours: '8.1h', overtime: '0.5h' },
  { id: 'CHK-1182', name: 'Liam Scott', department: 'Finance', position: 'Accountant', status: 'On Leave', hours: '0h', overtime: '0h' },
]

export const overtimeRequests = [
  { id: 1, employee: 'Ariana Brooks', date: '2026-11-06', start: '18:30', end: '20:30', reason: 'Launch support and QA review', status: 'Pending' },
  { id: 2, employee: 'Lucas Reed', date: '2026-11-05', start: '17:00', end: '19:00', reason: 'Client migration rollout', status: 'Approved' },
  { id: 3, employee: 'Maya Chen', date: '2026-11-04', start: '18:00', end: '20:00', reason: 'End-of-month reporting', status: 'Rejected' },
]

export const attendanceHistory = [
  { date: 'Nov 01', status: 'Present', timeIn: '08:41 AM', timeOut: '06:12 PM', hours: '9h 31m' },
  { date: 'Nov 02', status: 'Late', timeIn: '09:14 AM', timeOut: '06:05 PM', hours: '8h 51m' },
  { date: 'Nov 03', status: 'Present', timeIn: '08:38 AM', timeOut: '06:28 PM', hours: '9h 50m' },
  { date: 'Nov 04', status: 'Present', timeIn: '08:36 AM', timeOut: '06:14 PM', hours: '9h 38m' },
]

export const leaveCredits = 12

export const factoryUser = {
  id: 'emp-1042',
  name: 'Ariana Brooks',
  email: 'ariana@checkattend.io',
  employeeId: 'CHK-1042',
  department: 'Engineering',
  position: 'Senior Frontend Engineer',
  role: 'admin',
}

export const fakeEmployees = [
  { ...factoryUser, role: 'admin' },
  { id: 'emp-2001', name: 'Maya Chen', email: 'maya@checkattend.io', employeeId: 'CHK-2001', department: 'Operations', position: 'Operations Manager', role: 'hr' },
  { id: 'emp-3001', name: 'Emma Lee', email: 'emma@checkattend.io', employeeId: 'CHK-3001', department: 'Marketing', position: 'Brand Strategist', role: 'employee' },
  { id: 'emp-3002', name: 'Liam Scott', email: 'liam@checkattend.io', employeeId: 'CHK-3002', department: 'Finance', position: 'Accountant', role: 'employee' },
]
