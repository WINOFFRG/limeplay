import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `
    inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none [&_svg]:shrink-0
    [&_svg:not([class*='size-'])]:size-4
  `,
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: `
          h-9 px-4 py-2
          has-[>svg]:px-3
        `,
        icon: "size-8 rounded-md p-2",
        lg: `
          h-10 rounded-md px-6
          has-[>svg]:px-4
        `,
        sm: `
          h-8 gap-1.5 rounded-md px-3
          has-[>svg]:px-2.5
        `,
      },
      variant: {
        default: `
          bg-primary text-primary-foreground
          hover:bg-primary/90
        `,
        ghost: `hover:bg-accent hover:text-accent-foreground`,
        glass: `
          bg-transparent text-primary
          hover:bg-primary/10
          active:scale-[0.97]
        `,
        link: `
          text-primary underline-offset-4
          hover:underline
        `,
        outline: `
          border border-input bg-background
          hover:bg-accent hover:text-accent-foreground
        `,
        secondary: `
          bg-secondary text-secondary-foreground
          hover:bg-secondary/80
        `,
      },
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        data-slot="button"
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
