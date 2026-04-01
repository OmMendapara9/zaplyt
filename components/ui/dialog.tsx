import * as React from "react"

interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(open)
  const isControlled = onOpenChange !== undefined
  const dialogOpen = isControlled ? open : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  return (
    <DialogContext.Provider value={{ open: dialogOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog")
  }
  return context
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ onClick, children, asChild, ...props }, ref) => {
    const { setOpen } = useDialog()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true)
      onClick?.(e)
    }

    if (asChild) {
      return <>{children}</>
    }

    return (
      <button ref={ref} onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)

DialogTrigger.displayName = "DialogTrigger"

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, ...props }, ref) => {
    const { open, setOpen } = useDialog()

    if (!open) return null

    return (
      <>
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setOpen(false)}
        />
        <div
          ref={ref}
          className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg ${className || ""}`}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)

DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ""}`} {...props} />
)

DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
      {...props}
    />
  )
)

DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={`text-sm text-muted-foreground ${className || ""}`} {...props} />
  )
)

DialogDescription.displayName = "DialogDescription"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`} {...props} />
)

DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
