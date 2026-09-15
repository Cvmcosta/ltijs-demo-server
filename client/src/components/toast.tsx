import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  variant: 'success' | 'error'
}

interface ToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)
const TOAST_DURATION_MS = 5000

let nextToastId = 0

// Minimal replacement for notistack: a Context provider exposing success()/error(), rendering a
// dismissible, self-expiring stack of toasts.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts(current => current.filter(toast => toast.id !== id))
  }, [])

  const push = useCallback(
    (message: string, variant: Toast['variant']) => {
      const id = nextToastId++
      setToasts(current => [...current, { id, message, variant }])
      setTimeout(() => dismiss(id), TOAST_DURATION_MS)
    },
    [dismiss],
  )

  const value: ToastContextValue = {
    success: message => push(message, 'success'),
    error: message => push(message, 'error'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map(toast => (
          <button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            className={`pointer-events-auto max-w-md rounded-lg px-4 py-3 text-left text-sm font-medium text-white shadow-lg transition-opacity ${
              toast.variant === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {toast.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (context === undefined) throw new Error('useToast must be used within a ToastProvider')
  return context
}
