"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import React, { createContext, useCallback, useContext, useState } from "react"

type PopoverHandle = ReturnType<typeof PopoverPrimitive.createHandle>

interface StreamPanelContextValue {
  handle: PopoverHandle
  onOpenChange: (
    open: boolean,
    eventDetails: PopoverPrimitive.Root.ChangeEventDetails
  ) => void
  open: boolean
}

const StreamPanelContext = createContext<null | StreamPanelContextValue>(null)

export function StreamPanelProvider({ children }: React.PropsWithChildren) {
  const [handle] = useState(() => PopoverPrimitive.createHandle())
  const [open, setOpen] = useState(false)

  const onOpenChange = useCallback(
    (isOpen: boolean, _eventDetails: PopoverPrimitive.Root.ChangeEventDetails) => {
      setOpen(isOpen)
    },
    []
  )

  return (
    <StreamPanelContext.Provider value={{ handle, onOpenChange, open }}>
      {children}
    </StreamPanelContext.Provider>
  )
}

export function useStreamPanel() {
  const ctx = useContext(StreamPanelContext)
  if (!ctx)
    throw new Error("useStreamPanel must be used within StreamPanelProvider")
  return ctx
}
