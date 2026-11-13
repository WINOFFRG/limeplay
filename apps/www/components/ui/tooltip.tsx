"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import * as React from "react"

import { cn } from "@/lib/utils"

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipContent({
  align = "center",
  alignOffset = 0,
  children,
  className,
  side = "top",
  sideOffset = 4,
  ...props
}: Pick<
  TooltipPrimitive.Positioner.Props,
  "align" | "alignOffset" | "side" | "sideOffset"
> &
  TooltipPrimitive.Popup.Props) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          className={cn(
            `
              z-50 w-fit origin-(--transform-origin) rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background
              transition-[opacity,scale,translate] duration-150
              data-ending-style:scale-95 data-ending-style:opacity-0
              data-starting-style:scale-95 data-starting-style:opacity-0
              data-[side=bottom]:data-starting-style:-translate-y-2
              data-[side=left]:data-starting-style:translate-x-2
              data-[side=right]:data-starting-style:-translate-x-2
              data-[side=top]:data-starting-style:translate-y-2
            `,
            className
          )}
          data-slot="tooltip-content"
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            className={`
              z-50 size-2.5 rotate-45 rounded-[2px] bg-foreground
              data-[side=bottom]:-top-1
              data-[side=left]:-right-1
              data-[side=right]:-left-1
              data-[side=top]:-bottom-1
            `}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

function TooltipProvider({
  delay = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
