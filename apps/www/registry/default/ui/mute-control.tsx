import React from "react"
import { Slot } from "@radix-ui/react-slot"

import { Button } from "@/components/ui/button"
import { useVolumeStates } from "@/registry/default/hooks/use-volume-states"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface MuteControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const MuteControl = React.forwardRef<
  HTMLButtonElement,
  MuteControlProps
>((props, forwardedRef) => {
  useVolumeStates()
  const Comp = props.asChild ? Slot : Button
  const toggleMute = useMediaStore((state) => state.toggleMute)

  return (
    <Comp
      data-slot="mute-control"
      {...props}
      ref={forwardedRef}
      onClick={toggleMute}
    />
  )
})
