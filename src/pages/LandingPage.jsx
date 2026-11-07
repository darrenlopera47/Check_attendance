import { ArrowRight, BarChart3, CheckCircle2, Clock3, ShieldCheck, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const features = [
	{ icon: Clock3, title: 'Real-time tracking', text: 'See who is in, late, or out with instant attendance updates.' },
	{ icon: BarChart3, title: 'Smart analytics', text: 'Review attendance trends, overtime, leave, and workforce health.' },
	{ icon: ShieldCheck, title: 'Secure access', text: 'Built with role-based access control and protected employee data.' },
	{ icon: Users, title: 'Workforce visibility', text: 'Manage departments, employees, schedules, and attendance at scale.' },
]

const steps = [
	'Create secure employee profiles and assign roles',
	'Track attendance in real time with time-in and time-out controls',
	'Review reports, overtime, and compliance insights from one dashboard',
]

const stats = [
	{ value: '99.8%', label: 'Accuracy' },
	{ value: '3x', label: 'Faster HR processing' },
	{ value: '24/7', label: 'Live monitoring' },
]

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<Link to="/" className="flex items-center gap-3">
						<Logo variant="full" size="sm" theme="dark" clickable={false} />
					</Link>

					<nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
						<a href="#features" className="hover:text-white">
							Features
						</a>
						<a href="#how-it-works" className="hover:text-white">
							How it works
						</a>
						<a href="#analytics" className="hover:text-white">
							Analytics
						</a>
						<a href="#contact" className="hover:text-white">
							Contact
						</a>
					</nav>

					<div className="flex items-center gap-3">
						<Link
							to="/login"
							className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
						>
							Login
						</Link>
						<Link
							to="/login"
							className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
						>
							Get Started
						</Link>
					</div>
				</div>
			</header>

			<main>
				<section className="relative overflow-hidden">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%)]" />
					<div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
						<div>
							<span className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.26em] text-sky-300">
								Smart attendance platform
							</span>
							<h1 className="mt-6 max-w-xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
								Smart Attendance.{' '}
								<span className="text-sky-400">Smarter Workforce.</span>
							</h1>
							<p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
								CheckAttend helps teams track time, manage overtime, monitor attendance in real time, and empower managers with
								actionable workforce insights.
							</p>

							<div className="mt-8 flex flex-wrap items-center gap-4">
								<Link
									to="/login"
									className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-sky-500/20 hover:bg-sky-400"
								>
									Get Started <ArrowRight className="h-4 w-4" />
								</Link>
								<Link
									to="/login"
									className="rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 font-semibold text-white hover:border-slate-500"
								>
									Login
								</Link>
							</div>

							<div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-300">
								{stats.map((item) => (
									<div key={item.label}>
										<p className="text-2xl font-bold text-white">{item.value}</p>
										<p>{item.label}</p>
									</div>
								))}
							</div>
						</div>

						<div className="relative">
							<div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-sky-500/10">
								<div className="rounded-[22px] border border-slate-800 bg-slate-950 p-5">
									<div className="mb-5 flex items-center justify-between">
										<div>
											<p className="text-xs uppercase tracking-[0.22em] text-slate-500">Live Overview</p>
											<h3 className="mt-1 text-xl font-semibold text-white">Attendance Pulse</h3>
										</div>
										<div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
											Online
										</div>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										{['Total Employees', 'Present Today', 'Late Employees', 'Overtime Hours'].map((label, i) => (
											<div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
												<p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
												<div className="mt-3 flex items-end justify-between">
													<span className="text-2xl font-bold text-white">{['248', '197', '18', '118.5h'][i]}</span>
													<span className="text-xs text-emerald-400">+{[12, 9, 2, 21][i]}%</span>
												</div>
											</div>
										))}
									</div>

									<div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
										<div className="mb-4 flex items-center justify-between">
											<p className="text-sm font-medium text-slate-200">Weekly attendance</p>
											<p className="text-xs text-sky-300">94% avg</p>
										</div>
										<div className="flex h-28 items-end gap-3">
											{[30, 50, 44, 62, 56, 72, 64].map((height, index) => (
												<div
													key={index}
													className="flex-1 rounded-t-xl bg-gradient-to-t from-sky-600 to-cyan-400"
													style={{ height: `${height}%` }}
												/>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="features" className="mx-auto max-w-7xl px-6 py-20">
					<div className="mb-12 text-center">
						<p className="text-sm uppercase tracking-[0.25em] text-sky-300">Features</p>
						<h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Everything your workforce needs.</h2>
					</div>

					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
						{features.map(({ icon: Icon, title, text }) => (
							<div key={title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30">
								<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
								<p className="text-slate-300">{text}</p>
							</div>
						))}
					</div>
				</section>

				<section id="how-it-works" className="border-y border-slate-800 bg-slate-900/50">
					<div className="mx-auto max-w-7xl px-6 py-20">
						<div className="mb-12 text-center">
							<p className="text-sm uppercase tracking-[0.25em] text-sky-300">How it works</p>
							<h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">From clock-ins to clear decisions.</h2>
						</div>

						<div className="grid gap-8 md:grid-cols-3">
							{steps.map((step, index) => (
								<div key={step} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
									<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-lg font-bold text-sky-300">
										{index + 1}
									</div>
									<p className="text-lg text-slate-200">{step}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section id="analytics" className="mx-auto max-w-7xl px-6 py-20">
					<div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
							<div className="mb-6 flex items-center justify-between">
								<div>
									<p className="text-sm uppercase tracking-[0.2em] text-slate-400">Analytics</p>
									<h3 className="mt-2 text-2xl font-semibold text-white">Attendance performance</h3>
								</div>
								<div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
									<CheckCircle2 className="h-4 w-4" />
									Up 24%
								</div>
							</div>
							<div className="grid gap-5 sm:grid-cols-3">
								{['92.1%', '4.8%', '7.2h'].map((value, idx) => (
									<div key={value} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center">
										<p className="text-2xl font-bold text-white">{value}</p>
										<p className="mt-2 text-sm text-slate-400">
											{['Compliance', 'Leave ratio', 'Avg. daily hours'][idx]}
										</p>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-sky-500/15 to-cyan-500/5 p-6">
							<p className="text-sm uppercase tracking-[0.2em] text-sky-300">Operations</p>
							<h3 className="mt-3 text-2xl font-semibold text-white">Built for fast decisions.</h3>
							<ul className="mt-6 space-y-4 text-slate-200">
								<li className="flex items-center gap-3">
									<Zap className="h-4 w-4 text-sky-300" /> Instant employee status updates
								</li>
								<li className="flex items-center gap-3">
									<Zap className="h-4 w-4 text-sky-300" /> HR-friendly reporting and filters
								</li>
								<li className="flex items-center gap-3">
									<Zap className="h-4 w-4 text-sky-300" /> Overtime approval workflows
								</li>
							</ul>
						</div>
					</div>
				</section>

				<section id="contact" className="border-t border-slate-800 bg-slate-950">
					<div className="mx-auto max-w-5xl px-6 py-20 text-center">
						<p className="text-sm uppercase tracking-[0.25em] text-sky-300">Contact</p>
						<h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Ready to modernize attendance?</h2>
						<p className="mt-4 text-slate-300">
							Talk with our team to design a smarter attendance workflow for your organization.
						</p>
						<a
							href="mailto:hello@checkattend.io"
							className="mt-8 inline-flex rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 hover:bg-sky-400"
						>
							hello@checkattend.io
						</a>
					</div>
				</section>
			</main>

			<footer className="border-t border-slate-800">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-3">
						<Logo variant="full" size="sm" theme="light" clickable={false} />
					</div>
					<div className="flex gap-6">
						<a href="#features" className="hover:text-slate-200">
							Features
						</a>
						<a href="#analytics" className="hover:text-slate-200">
							Analytics
						</a>
						<a href="#contact" className="hover:text-slate-200">
							Contact
						</a>
					</div>
				</div>
			</footer>
		</div>
	)
}
