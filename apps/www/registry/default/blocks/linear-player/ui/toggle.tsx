"use client"

import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  `
    inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow]
    hover:bg-muted
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50
    disabled:pointer-events-none disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20
    data-[state=on]:bg-accent data-[state=on]:text-accent-foreground
    dark:aria-invalid:ring-destructive/40
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
        default: "h-9 min-w-9 px-2",
        lg: "h-10 min-w-10 px-2.5",
        sm: "h-8 min-w-8 px-1.5",
      },
      variant: {
        default: "bg-transparent",
        glass: `
          bg-transparent text-primary
          hover:bg-primary/10
          active:scale-[0.97]
          data-[state=on]:bg-transparent data-[state=on]:hover:bg-primary/10
        `,
        outline: `
          border border-input bg-transparent shadow-xs
          hover:bg-accent hover:text-accent-foreground
        `,
      },
    },
  }
)

function Toggle({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
