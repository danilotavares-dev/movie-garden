import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

type DialogVariant = 'info' | 'success' | 'error'

interface DialogState {
  title: string
  message: string
  variant: DialogVariant
}

interface DialogContextValue {
  showDialog: (
    message: string,
    options?: { title?: string; variant?: DialogVariant },
  ) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

const variantStyles: Record<
  DialogVariant,
  { icon: string; iconClass: string; buttonClass: string }
> = {
  info: {
    icon: 'i',
    iconClass: 'bg-[#113A2D]/10 text-[#113A2D]',
    buttonClass: 'bg-[#113A2D] hover:bg-[#1a5542]',
  },
  success: {
    icon: '✓',
    iconClass: 'bg-emerald-100 text-emerald-700',
    buttonClass: 'bg-emerald-700 hover:bg-emerald-800',
  },
  error: {
    icon: '!',
    iconClass: 'bg-red-100 text-red-700',
    buttonClass: 'bg-red-700 hover:bg-red-800',
  },
}

export function AppDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const showDialog = useCallback(
    (
      message: string,
      options: { title?: string; variant?: DialogVariant } = {},
    ) => {
      setDialog({
        message,
        title: options.title ?? 'Atenção',
        variant: options.variant ?? 'info',
      })
    },
    [],
  )

  const closeDialog = () => setDialog(null)
  const styles = dialog ? variantStyles[dialog.variant] : null

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      {dialog && styles && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 animate-fade-in">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onMouseDown={closeDialog}
          />
          <div
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/60 bg-[#F5F7F5] p-6 sm:p-8 text-center shadow-2xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="app-dialog-title"
            aria-describedby="app-dialog-message"
          >
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold ${styles.iconClass}`}
              aria-hidden="true"
            >
              {styles.icon}
            </div>
            <h2
              id="app-dialog-title"
              className="mb-2 text-2xl font-bold text-[#113A2D]"
            >
              {dialog.title}
            </h2>
            <p id="app-dialog-message" className="mb-6 text-zinc-600">
              {dialog.message}
            </p>
            <button
              type="button"
              onClick={closeDialog}
              className={`w-full rounded-xl px-5 py-3 font-bold text-white transition-colors ${styles.buttonClass}`}
              autoFocus
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  )
}

export function useAppDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useAppDialog deve ser usado dentro de AppDialogProvider')
  }
  return context
}
