"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { Button } from "@/components/ui/button"
import { useMediaStates } from "@/registry/default/hooks/use-media-state-states"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface PlaybackControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const PlaybackControl = React.forwardRef<
  HTMLButtonElement,
  PlaybackControlProps
>((props, forwardedRef) => {
  useMediaStates()

  const status = useMediaStore((state) => state.status)
  const togglePaused = useMediaStore((state) => state.togglePaused)
  const Comp = props.asChild ? Slot : Button

  return (
    <Comp
      {...props}
      ref={forwardedRef}
      aria-label={["paused", "ended"].includes(status) ? `Play` : `Pause`}
      aria-keyshortcuts="k"
      onClick={togglePaused}
    />
  )
})

PlaybackControl.displayName = "PlaybackControl"
