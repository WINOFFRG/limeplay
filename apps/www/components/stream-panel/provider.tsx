"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import React, { createContext, use, useCallback, useMemo, useState } from "react"

import type { StreamPanelPlaylistPreset } from "@/components/stream-panel/content-catalog"
import type { StreamPanelPlayerType } from "@/lib/docs-dial-store"
import type { StreamPreset } from "@/lib/stream-presets"

export interface StreamPanelController {
  onLoadStream?: (src: string, config?: string) => void
  onPlaylistChange?: (playlist: StreamPanelPlaylistPreset) => void
  onPresetChange?: (
    preset: StreamPreset,
    kind?: "live" | "stream"
  ) => void
  playerType: StreamPanelPlayerType
}

type PopoverHandle = ReturnType<typeof PopoverPrimitive.createHandle>

interface StreamPanelContextValue {
  controller: null | StreamPanelController
  handle: PopoverHandle
  onOpenChange: (
    open: boolean,
    eventDetails: PopoverPrimitive.Root.ChangeEventDetails
  ) => void
  open: boolean
  registerController: (controller: StreamPanelController) => () => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const StreamPanelContext = createContext<null | StreamPanelContextValue>(null)

export function StreamPanelProvider({ children }: React.PropsWithChildren) {
  const [handle] = useState(() => PopoverPrimitive.createHandle())
  const [open, setOpen] = useState(false)
  const [controller, setController] = useState<null | StreamPanelController>(
    null
  )

  const onOpenChange = useCallback(
    (
      isOpen: boolean,
      _eventDetails: PopoverPrimitive.Root.ChangeEventDetails
    ) => {
      setOpen(isOpen)
    },
    []
  )

  const registerController = useCallback((next: StreamPanelController) => {
    setController(next)
    return () => {
      setController((current) => (current === next ? null : current))
    }
  }, [])

  const value = useMemo(
    () => ({
      controller,
      handle,
      onOpenChange,
      open,
      registerController,
      setOpen,
    }),
    [controller, handle, onOpenChange, open, registerController]
  )

  return (
    <StreamPanelContext.Provider value={value}>
      {children}
    </StreamPanelContext.Provider>
  )
}

export function useStreamPanel() {
  const ctx = use(StreamPanelContext)
  if (!ctx)
    throw new Error("useStreamPanel must be used within StreamPanelProvider")
  return ctx
}
