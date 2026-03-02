"use client"

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"
import * as React from "react"

import { toggleVariants } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    orientation?: "horizontal" | "vertical"
    spacing?: number
  }
>({
  orientation: "horizontal",
  size: "default",
  spacing: 0,
  variant: "default",
})

function ToggleGroup({
  children,
  className,
  orientation = "horizontal",
  size,
  spacing = 0,
  variant,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    orientation?: "horizontal" | "vertical"
    spacing?: number
  }) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        `
          group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg
          data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch
          data-[size=sm]:rounded-[min(var(--radius-md),10px)]
        `,
        className
      )}
      data-orientation={orientation}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      style={{ "--gap": spacing } as React.CSSProperties}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ orientation, size, spacing, variant }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        `
          shrink-0
          group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2
          focus:z-10
          focus-visible:z-10
          group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg
          group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg
          group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg
          group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg
          group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0
          group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0
          group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l
          group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t
        `,
        toggleVariants({
          size: context.size || size,
          variant: context.variant || variant,
        }),
        className
      )}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      data-spacing={context.spacing}
      data-variant={context.variant || variant}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
