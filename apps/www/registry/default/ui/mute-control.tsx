"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { Button } from "@/components/ui/button"
import { MediaReadyState } from "@/registry/default/hooks/use-player"
import { useVolume } from "@/registry/default/hooks/use-volume"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface MuteControlProps extends React.ComponentProps<typeof Button> {
  shortcut?: string
  asChild?: boolean
}

export const MuteControl = React.forwardRef<
  HTMLButtonElement,
  MuteControlProps
>((props, forwardedRef) => {
  const readyState = useMediaStore((state) => state.readyState)
  const muted = useMediaStore((state) => state.muted)
  const { toggleMute } = useVolume()

  const {
    children,
    onClick,
    disabled: userDisabled,
    "aria-label": ariaLabelProp,
    shortcut,
    asChild = false,
    ...restProps
  } = props

  const Comp = asChild ? Slot : Button

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) {
      toggleMute()
    }
  }

  const isDisabled = readyState < MediaReadyState.HAVE_METADATA || userDisabled

  const getDefaultAriaLabel = () => {
    const shortcutText = shortcut ? ` (keyboard shortcut ${shortcut})` : ""
    const label = muted ? "Unmute" : "Mute"
    return `${label}${shortcutText}`
  }

  return (
    <Comp
      data-label="lp-mute-control"
      disabled={isDisabled}
      aria-label={ariaLabelProp ?? getDefaultAriaLabel()}
      aria-keyshortcuts={shortcut}
      {...restProps}
      ref={forwardedRef}
      onClick={handleClick}
    >
      {children}
    </Comp>
  )
})

MuteControl.displayName = "MuteControl"
