"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { Button } from "@/components/ui/button"
import { useMediaState } from "@/registry/default/hooks/use-media-state"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface PlaybackControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const PlaybackControl = React.forwardRef<
  HTMLButtonElement,
  PlaybackControlProps
>((props, forwardedRef) => {
  const status = useMediaStore((state) => state.status)
  const Comp = props.asChild ? Slot : Button

  const { togglePaused } = useMediaState()

  return (
    <Comp
      ref={forwardedRef}
      aria-label={["paused", "ended"].includes(status) ? `Play` : `Pause`}
      aria-keyshortcuts="k"
      {...props}
      onClick={togglePaused}
    />
  )
})

PlaybackControl.displayName = "PlaybackControl"
