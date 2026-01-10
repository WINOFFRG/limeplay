"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { MediaReadyState } from "@/registry/default/hooks/use-playback"
import { useVolume } from "@/registry/default/hooks/use-volume"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface MuteControlProps extends React.ComponentProps<typeof Button> {
  asChild?: boolean
  shortcut?: string
}

export type MuteControlPropsDocs = Pick<
  MuteControlProps,
  "asChild" | "shortcut"
>

export const MuteControl = React.forwardRef<
  HTMLButtonElement,
  MuteControlProps
>((props, forwardedRef) => {
  const readyState = useMediaStore((state) => state.readyState)
  const muted = useMediaStore((state) => state.muted)
  const { toggleMute } = useVolume()

  const {
    "aria-label": ariaLabelProp,
    asChild = false,
    children,
    disabled: userDisabled,
    onClick,
    shortcut,
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
      aria-keyshortcuts={shortcut}
      aria-label={ariaLabelProp ?? getDefaultAriaLabel()}
      data-label="lp-mute-control"
      disabled={isDisabled}
      {...restProps}
      onClick={handleClick}
      ref={forwardedRef}
    >
      {children}
    </Comp>
  )
})

MuteControl.displayName = "MuteControl"
