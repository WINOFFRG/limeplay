"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
import * as React from "react"

import { toggleVariants } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
  }
>({
  size: "default",
  spacing: 0,
  variant: "default",
})

function ToggleGroup({
  children,
  className,
  size,
  spacing = 0,
  variant,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
  }) {
  return (
    <ToggleGroupPrimitive
      className={cn(
        `
          group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md
          data-[spacing=default]:data-[variant=outline]:shadow-xs
        `,
        className
      )}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      style={{ "--gap": spacing } as React.CSSProperties}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ size, spacing, variant }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  children,
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof TogglePrimitive> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <TogglePrimitive
      className={cn(
        toggleVariants({
          size: context.size || size,
          variant: context.variant || variant,
        }),
        `
          w-auto min-w-0 shrink-0 px-3
          focus:z-10
          focus-visible:z-10
        `,
        `
          data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none
          data-[spacing=0]:first:rounded-l-md
          data-[spacing=0]:last:rounded-r-md
          data-[spacing=0]:data-[variant=outline]:border-l-0
          data-[spacing=0]:data-[variant=outline]:first:border-l
        `,
        className
      )}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      data-spacing={context.spacing}
      data-variant={context.variant || variant}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
