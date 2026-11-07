import { useMemo, useState } from 'react'
import { Activity, BriefcaseBusiness, CalendarDays, Clock3, Coffee, FileText, TimerReset } from 'lucide-react'
import { useToast } from '../components/ToastProvider'
import Layout from '../components/Layout'

const employee = {
  name: 'Ariana Brooks',
  department: 'Engineering',
  role: 'Senior Frontend Engineer',
  location: 'Office',
  shift: '9:00 AM - 6:00 PM',
  leaveBalance: '12 Days',
  overtime: '14.5h',
  attendanceRate: '96.4%',
}

const attendanceHistory = [
  { date: 'Nov 01', status: 'Present', timeIn: '08:41 AM', timeOut: '06:12 PM', hours: '9h 31m' },
  { date: 'Nov 02', status: 'Late', timeIn: '09:14 AM', timeOut: '06:05 PM', hours: '8h 51m' },
  { date: 'Nov 04', status: 'Present', timeIn: '08:36 AM', timeOut: '06:14 PM', hours: '9h 38m' },
]

export default function EmployeeDashboard() {
  const { addToast } = useToast()
  const [timeIn, setTimeIn] = useState('08:41 AM')
  const [timeOut, setTimeOut] = useState('—')
  const [isClockedIn, setIsClockedIn] = useState(true)
  const [workingHours, setWorkingHours] = useState('9h 31m')

  const summaryCards = useMemo(
    () => [
      { label: 'Shift Status', value: isClockedIn ? 'Clocked In' : 'Clocked Out', tone: 'sky' },
      { label: 'Current Shift', value: workingHours, tone: 'violet' },
      { label: 'Leave Balance', value: employee.leaveBalance, tone: 'emerald' },
      { label: 'Overtime', value: employee.overtime, tone: 'amber' },
    ],
    [isClockedIn, workingHours],
  )

  const handleTimeIn = () => {
    const now = new Date()
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setTimeIn(formatted)
    setTimeOut('—')
    setIsClockedIn(true)
    setWorkingHours('0h 00m')
    addToast({ type: 'success', title: 'Clocked in', description: `You checked in at ${formatted}.`, duration: 3000 })
  }

  const handleTimeOut = () => {
    const now = new Date()
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setTimeOut(formatted)
    setIsClockedIn(false)
    setWorkingHours('9h 00m')
    addToast({ type: 'success', title: 'Clocked out', description: `You checked out at ${formatted}.`, duration: 3000 })
  }

  return (
    <Layout title="Employee Dashboard" userName={employee.name}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-6 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{employee.name}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {employee.role} · {employee.department}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTimeIn}
                className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-400"
              >
                Time In
              </button>
              <button
                type="button"
                onClick={handleTimeOut}
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-white hover:border-slate-500"
              >
                Time Out
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_16px_30px_rgba(2,6,23,0.45)]"
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-2 ${
                  card.tone === 'sky'
                    ? 'bg-sky-500/10 text-sky-300'
                    : card.tone === 'violet'
                    ? 'bg-violet-500/10 text-violet-300'
                    : card.tone === 'emerald'
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : 'bg-amber-500/10 text-amber-300'
                }`}
              >
                {card.tone === 'sky' ? (
                  <Clock3 className="h-4 w-4" />
                ) : card.tone === 'violet' ? (
                  <TimerReset className="h-4 w-4" />
                ) : card.tone === 'emerald' ? (
                  <Activity className="h-4 w-4" />
                ) : (
                  <Coffee className="h-4 w-4" />
                )}
              </div>
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Profile</p>
            <div className="mt-5 space-y-4">
              <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Today’s Shift" value={employee.shift} />
              <InfoRow icon={<BriefcaseBusiness className="h-4 w-4" />} label="Department" value={employee.department} />
              <InfoRow icon={<FileText className="h-4 w-4" />} label="Attendance Rate" value={employee.attendanceRate} />
              <InfoRow icon={<Clock3 className="h-4 w-4" />} label="Time In" value={timeIn} />
              <InfoRow icon={<Clock3 className="h-4 w-4" />} label="Time Out" value={timeOut} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Attendance</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Recent Records</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Time In</th>
                    <th className="pb-3 pr-4">Time Out</th>
                    <th className="pb-3 pr-4">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((entry) => (
                    <tr key={entry.date} className="border-b border-slate-800 last:border-0">
                      <td className="py-3 pr-4 text-slate-200">{entry.date}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                            entry.status === 'Late'
                              ? 'bg-amber-500/10 text-amber-300'
                              : 'bg-emerald-500/10 text-emerald-300'
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">{entry.timeIn}</td>
                      <td className="py-3 pr-4 text-slate-300">{entry.timeOut}</td>
                      <td className="py-3 pr-4 text-slate-200">{entry.hours}</td>
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

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-1 text-sm text-white">{value}</p>
      </div>
    </div>
  )
}
