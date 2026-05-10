"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  MediaReadyState,
  usePlaybackStore,
} from "@/registry/default/hooks/use-playback"
import { useVolumeStore } from "@/registry/default/hooks/use-volume"

export interface MuteControlProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  render?: React.ReactElement
  shortcut?: string
}

export type MuteControlPropsDocs = Pick<
  MuteControlProps,
  "asChild" | "render" | "shortcut"
>

export const MuteControl = React.forwardRef<
  HTMLButtonElement,
  MuteControlProps
>((props, forwardedRef) => {
  const readyState = usePlaybackStore((state) => state.readyState)
  const muted = useVolumeStore((state) => state.muted)
  const toggleMute = useVolumeStore((state) => state.toggleMute)

  const {
    "aria-label": ariaLabelProp,
    asChild = false,
    children,
    disabled: userDisabled,
    onClick,
    render,
    shortcut,
    ...restProps
  } = props

  const Comp = render ? Slot : asChild ? Slot : Button

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
      {render ? React.cloneElement(render, undefined, children) : children}
    </Comp>
  )
})

MuteControl.displayName = "MuteControl"
