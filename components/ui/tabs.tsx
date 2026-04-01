import * as React from "react"

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children: React.ReactNode
  className?: string
}

function Tabs({ value, onValueChange, defaultValue, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = (newValue: string) => {
    if (isControlled) {
      onValueChange?.(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within Tabs")
  }
  return context
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ""}`}
      {...props}
    />
  )
)

TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, onClick, ...props }, ref) => {
    const { value: currentValue, onValueChange } = useTabs()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onValueChange(value)
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          currentValue === value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        } ${className || ""}`}
        {...props}
      >
        {props.children}
      </button>
    )
  }
)

TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, ...props }, ref) => {
    const { value: currentValue } = useTabs()

    if (currentValue !== value) return null

    return (
      <div
        ref={ref}
        className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ""}`}
        {...props}
      />
    )
  }
)

TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
