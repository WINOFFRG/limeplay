import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `
    inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md text-xs font-medium whitespace-nowrap
    transition-[background-color,color,box-shadow,scale,backdrop-filter] duration-150 ease-out
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
    active:scale-[0.96]
    disabled:pointer-events-none disabled:opacity-50
    motion-reduce:transition-none
    motion-reduce:active:scale-100
    @md/root:gap-2 @md/root:text-sm
    [&_svg]:pointer-events-none [&_svg]:shrink-0
    [&_svg:not([class*='size-'])]:size-3.5
    @md/root:[&_svg:not([class*='size-'])]:size-4
    @3xl/root:[&_svg:not([class*='size-'])]:size-4.5
  `,
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: `
          h-8 px-3 py-1.5
          has-[>svg]:px-2.5
          @md/root:h-9 @md/root:px-4 @md/root:py-2
          @md/root:has-[>svg]:px-3
          @3xl/root:h-10 @3xl/root:px-5
          @3xl/root:has-[>svg]:px-4
        `,
        icon: `
          size-7 rounded-lg p-1.5
          @md/root:size-8 @md/root:p-2
          @3xl/root:size-9
        `,
        lg: `
          h-9 rounded-md px-4
          has-[>svg]:px-3
          @md/root:h-10 @md/root:px-6
          @md/root:has-[>svg]:px-4
          @3xl/root:h-11 @3xl/root:px-7
          @3xl/root:has-[>svg]:px-5
        `,
        sm: `
          h-7 gap-1.5 rounded-md px-2.5 text-xs
          has-[>svg]:px-2
          @md/root:h-8 @md/root:px-3 @md/root:text-sm
          @md/root:has-[>svg]:px-2.5
          @3xl/root:h-9 @3xl/root:px-3.5
          @3xl/root:has-[>svg]:px-3
        `,
      },
      variant: {
        default: `
          bg-primary text-primary-foreground
          hover:bg-primary/90
        `,
        ghost: `hover:bg-accent hover:text-accent-foreground`,
        glass: `
          bg-transparent text-foreground
          hover:bg-foreground/10
          focus-visible:bg-background/20
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
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  render?: React.ReactElement
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild = false, children, className, render, size, variant, ...props },
    ref
  ) => {
    const Comp = render ? Slot : asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        data-slot="button"
        ref={ref}
        {...props}
      >
        {render ? React.cloneElement(render, undefined, children) : children}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
