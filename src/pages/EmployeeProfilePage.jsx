import { Activity, BriefcaseBusiness, CalendarDays, Clock3, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import Layout from '../components/Layout'

const employee = {
  id: 'CHK-1011',
  name: 'Ariana Brooks',
  email: 'ariana@checkattend.io',
  phone: '+1 555 678 1245',
  department: 'Engineering',
  position: 'Senior Frontend Engineer',
  hired: '2024-04-18',
  schedule: 'Mon-Fri · 9:00 AM - 6:00 PM',
  status: 'Active',
  leaveBalance: '12 Days',
  overtime: '14.5h',
}

const attendanceHistory = [
  { date: 'Nov 01', status: 'Present', timeIn: '08:41 AM', timeOut: '06:12 PM', hours: '9h 31m' },
  { date: 'Nov 02', status: 'Late', timeIn: '09:14 AM', timeOut: '06:05 PM', hours: '8h 51m' },
  { date: 'Nov 04', status: 'Present', timeIn: '08:36 AM', timeOut: '06:14 PM', hours: '9h 38m' },
]

export default function EmployeeProfilePage() {
  return (
    <Layout title="Employee Profile" userName="Ariana Brooks">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-[#111B30] p-6 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/20 text-xl font-bold text-sky-200">AB</div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Employee Profile</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{employee.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{employee.position}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">{employee.status}</span>
              <button className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400">Edit Profile</button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Personal Information</p>
            <div className="mt-5 space-y-4">
              <InfoRow icon={<UserRound className="h-4 w-4" />} label="Employee ID" value={employee.id} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={employee.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={employee.phone} />
              <InfoRow icon={<BriefcaseBusiness className="h-4 w-4" />} label="Department" value={employee.department} />
              <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Date Hired" value={employee.hired} />
              <InfoRow icon={<Clock3 className="h-4 w-4" />} label="Schedule" value={employee.schedule} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard label="Leave Balance" value={employee.leaveBalance} tone="sky" />
              <SummaryCard label="Overtime" value={employee.overtime} tone="violet" />
              <SummaryCard label="Attendance Rate" value="96.4%" tone="emerald" />
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5 shadow-[0_18px_35px_rgba(2,6,23,0.45)]">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-sky-300" />
                <h3 className="text-xl font-semibold text-white">Attendance History</h3>
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
                          <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${entry.status === 'Late' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'}`}>
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

function SummaryCard({ label, value, tone }) {
  const toneClass = {
    sky: 'bg-sky-500/10 text-sky-300',
    emerald: 'bg-emerald-500/10 text-emerald-300',
    violet: 'bg-violet-500/10 text-violet-300',
  }[tone]

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111B30] p-5">
      <div className={`mb-4 inline-flex rounded-xl p-2 ${toneClass}`}><Activity className="h-4 w-4" /></div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
