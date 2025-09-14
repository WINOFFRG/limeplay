import React from "react"
import { Slot } from "@radix-ui/react-slot"

import { Button } from "@/components/ui/button"
import { MediaReadyState } from "@/registry/default/hooks/use-player"
import { useVolume } from "@/registry/default/hooks/use-volume"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface MuteControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const MuteControl = React.forwardRef<
  HTMLButtonElement,
  MuteControlProps
>((props, forwardedRef) => {
  const Comp = props.asChild ? Slot : Button
  const readyState = useMediaStore((state) => state.readyState)
  const { toggleMute } = useVolume()

  return (
    <Comp
      disabled={readyState < MediaReadyState.HAVE_METADATA}
      data-slot="mute-control"
      {...props}
      ref={forwardedRef}
      onClick={toggleMute}
      aria-label="Mute (keyboard shortcut m)"
      aria-keyshortcuts="m"
    />
  )
})

MuteControl.displayName = "MuteControl"
