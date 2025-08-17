import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-md border shadow-sm transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-600 border-transparent",
        ghost: "bg-transparent text-ink border-border hover:bg-black/5 dark:hover:bg-white/5",
        danger: "bg-error text-white border-transparent hover:brightness-95",
        outline: "bg-transparent text-ink border-border hover:bg-black/5 dark:hover:bg-white/5",
        secondary: "bg-surface text-ink border-border hover:bg-black/5 dark:hover:bg-white/5",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
