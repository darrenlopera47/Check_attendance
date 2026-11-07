import { createContext, useContext, useMemo, useState } from 'react'
import Toast from './Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = ({ type = 'info', title, description, duration = 3500 }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const nextToast = { id, type, title, description }
    setToasts((current) => [...current, nextToast])

    if (duration > 0) {
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, duration)
    }
  }

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const value = useMemo(() => ({ addToast, removeToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex max-h-[80vh] flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return context
}
