import React from "react"
import { Slot } from "@radix-ui/react-slot"

import { Button } from "@/components/ui/button"
import { useVolume } from "@/registry/default/hooks/use-volume"

export interface MuteControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const MuteControl = React.forwardRef<
  HTMLButtonElement,
  MuteControlProps
>((props, forwardedRef) => {
  const Comp = props.asChild ? Slot : Button
  const { toggleMute } = useVolume()

  return (
    <Comp
      data-slot="mute-control"
      {...props}
      ref={forwardedRef}
      onClick={toggleMute}
    />
  )
})

MuteControl.displayName = "MuteControl"
