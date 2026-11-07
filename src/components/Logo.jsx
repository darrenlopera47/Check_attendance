import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const sizeMap = {
  sm: { icon: 30, text: 18, padding: 8 },
  md: { icon: 42, text: 22, padding: 12 },
  lg: { icon: 54, text: 30, padding: 16 },
  xl: { icon: 68, text: 38, padding: 18 },
}

const themeStyles = {
  dark: {
    iconStroke: '#0f172a',
    iconFill: '#e0f2fe',
    text: '#0f172a',
    soft: '#0ea5e9',
  },
  light: {
    iconStroke: '#f8fafc',
    iconFill: '#dbeafe',
    text: '#f8fafc',
    soft: '#67e8f9',
  },
  navy: {
    iconStroke: '#0f172a',
    iconFill: '#e0f2fe',
    text: '#0f172a',
    soft: '#22d3ee',
  },
}

function IconMark({ size = 44, theme = 'dark' }) {
  const colors = themeStyles[theme] || themeStyles.dark

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id={`checkattend-gradient-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="48" fill="none" stroke={`url(#checkattend-gradient-${theme})`} strokeWidth="7" opacity="0.92" />
      <circle cx="60" cy="60" r="30" fill="none" stroke={colors.soft} strokeWidth="3" opacity="0.7" strokeDasharray="3 8" />
      <path d="M39 62.5L52 75L82 45" fill="none" stroke={`url(#checkattend-gradient-${theme})`} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M84 28L90 34L72 52" fill="none" stroke={colors.soft} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d="M60 18V30" stroke={colors.iconStroke} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M60 102V90" stroke={colors.iconStroke} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M102 60H90" stroke={colors.iconStroke} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M18 60H30" stroke={colors.iconStroke} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

export default function Logo({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  to,
  className = '',
  clickable = true,
}) {
  const { profile, user } = useAuth()
  const config = sizeMap[size] || sizeMap.md
  const resolvedTo = to || (user ? (profile?.role === 'employee' ? '/dashboard/employee' : '/dashboard/admin') : '/')
  const textColor = themeStyles[theme]?.text || '#0f172a'
  const isCompact = variant === 'icon'

  const content = (
    <div className={`inline-flex items-center ${className}`} style={{ gap: isCompact ? 0 : 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconMark size={config.icon} theme={theme} />
      </div>
      {!isCompact && (
        <div>
          <div
            style={{
              fontSize: config.text,
              lineHeight: 1,
              letterSpacing: '-0.06em',
              fontWeight: 700,
              color: textColor,
              whiteSpace: 'nowrap',
            }}
          >
            CheckAttend
          </div>
        </div>
      )}
    </div>
  )

  if (!clickable) return content

  return <Link to={resolvedTo} className="inline-flex items-center hover:opacity-95 transition-opacity">{content}</Link>
}
