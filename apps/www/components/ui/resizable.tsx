"use client"

import { GripVerticalIcon } from "lucide-react"
import * as React from "react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  ResizablePrimitive.PanelGroupProps
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      `
        flex h-full w-full
        data-[panel-group-direction=vertical]:flex-col
      `,
      className
    )}
    data-slot="resizable-panel-group"
    ref={ref}
    {...props}
  />
))

ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  ResizablePrimitive.PanelProps
>((props, ref) => (
  <ResizablePrimitive.Panel data-slot="resizable-panel" ref={ref} {...props} />
))

ResizablePanel.displayName = "ResizablePanel"

function ResizableHandle({
  className,
  withHandle,
  ...props
}: ResizablePrimitive.PanelResizeHandleProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        `
          relative flex w-px items-center justify-center
          after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2
          data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0
          data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full
          data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2
          [&[data-panel-group-direction=vertical]>div]:rotate-90
        `,
        className
      )}
      data-slot="resizable-handle"
      {...props}
    >
      {withHandle ? (
        <div className="z-10 flex h-6 w-3 items-center justify-center rounded-xl border border-accent-foreground/60 bg-background">
          <GripVerticalIcon className="size-2.5" />
        </div>
      ) : null}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
