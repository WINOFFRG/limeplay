"use client"

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetContent({
  children,
  className,
  showCloseButton = true,
  side = "right",
  ...props
}: SheetPrimitive.Popup.Props & {
  showCloseButton?: boolean
  side?: "bottom" | "left" | "right" | "top"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        className={cn(
          `
            fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition-transform duration-500 ease-in-out
            data-ending-style:duration-300
          `,
          side === "right" &&
            `
              inset-y-0 right-0 h-full w-3/4 border-l
              data-ending-style:translate-x-full
              data-starting-style:translate-x-full
              sm:max-w-sm
            `,
          side === "left" &&
            `
              inset-y-0 left-0 h-full w-3/4 border-r
              data-ending-style:-translate-x-full
              data-starting-style:-translate-x-full
              sm:max-w-sm
            `,
          side === "top" &&
            `
              inset-x-0 top-0 h-auto border-b
              data-ending-style:-translate-y-full
              data-starting-style:-translate-y-full
            `,
          side === "bottom" &&
            `
              inset-x-0 bottom-0 h-auto border-t
              data-ending-style:translate-y-full
              data-starting-style:translate-y-full
            `,
          className
        )}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className={`
              absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity
              hover:opacity-100
              focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden
              disabled:pointer-events-none
            `}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="sheet-description"
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      data-slot="sheet-footer"
      {...props}
    />
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-4", className)}
      data-slot="sheet-header"
      {...props}
    />
  )
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      className={cn(
        `
          fixed inset-0 z-50 bg-black/50 transition-opacity duration-300
          data-ending-style:opacity-0
          data-starting-style:opacity-0
        `,
        className
      )}
      data-slot="sheet-overlay"
      {...props}
    />
  )
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      className={cn("font-semibold text-foreground", className)}
      data-slot="sheet-title"
      {...props}
    />
  )
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
