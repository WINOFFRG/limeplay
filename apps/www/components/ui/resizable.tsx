"use client"

import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizableHandle({
  className,
  withHandle,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
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
      {withHandle && (
        <div className="z-10 flex h-8 w-2 shrink-0 translate-x-px rounded-lg border bg-border" />
      )}
    </ResizablePrimitive.Separator>
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      className={cn(
        `
          flex h-full w-full
          aria-[orientation=vertical]:flex-col
        `,
        className
      )}
      data-slot="resizable-panel-group"
      {...props}
    />
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
