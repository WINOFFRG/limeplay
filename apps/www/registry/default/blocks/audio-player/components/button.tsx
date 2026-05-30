import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  render?: React.ReactElement
  size?: "default" | "large" | "sm" | "xl"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, render, size = "large", ...props }, ref) => {
    const Comp = render ? Slot : asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          `
            inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent text-foreground
            transition-[color,background-color,scale] duration-150 ease-out
            hover:bg-muted-foreground
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
            active:scale-[0.96]
            disabled:cursor-not-allowed disabled:opacity-50
          `,
          size === "default" &&
            `
              size-8
              [&_svg]:size-5
            `,
          size === "large" &&
            `
              size-10
              [&_svg]:size-6
            `,
          size === "xl" &&
            `
              size-12
              [&_svg]:size-10
            `,
          size === "sm" &&
            `
              size-6
              [&_svg]:size-4
            `,
          className
        )}
        ref={ref}
        {...props}
      >
        {render
          ? React.cloneElement(render, undefined, props.children)
          : props.children}
      </Comp>
    )
  }
)

Button.displayName = "AudioPlayerButton"

export { Button }
