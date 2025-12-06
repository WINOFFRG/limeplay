"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { MediaReadyState, usePlayer } from "@/registry/default/hooks/use-player"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export type PlaybackControlPropsDocs = Pick<
  PlaybackControlProps,
  "asChild" | "shortcut"
>

interface PlaybackControlProps extends React.ComponentProps<typeof Button> {
  /**
   * Render as child component using Radix Slot
   * @default false
   */
  asChild?: boolean
  /**
   * Keyboard shortcut hint displayed in aria-label
   * @example "Space"
   */
  shortcut?: string
}

export const PlaybackControl = React.forwardRef<
  HTMLButtonElement,
  PlaybackControlProps
>((props, forwardedRef) => {
  const status = useMediaStore((state) => state.status)
  const readyState = useMediaStore((state) => state.readyState)
  const { togglePaused } = usePlayer()

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
      togglePaused()
    }
  }

  const isDisabled =
    readyState < MediaReadyState.HAVE_CURRENT_DATA ||
    status === "buffering" ||
    userDisabled

  const getDefaultAriaLabel = () => {
    const shortcutText = shortcut ? ` (keyboard shortcut ${shortcut})` : ""
    const labels = {
      default: "Play",
      ended: "Replay",
      playing: "Pause",
    }

    const label =
      status === "ended"
        ? labels.ended
        : status === "playing"
          ? labels.playing
          : labels.default
    return `${label}${shortcutText}`
  }

  return (
    <Comp
      aria-keyshortcuts={shortcut}
      aria-label={ariaLabelProp ?? getDefaultAriaLabel()}
      data-label="lp-playback-control"
      disabled={isDisabled}
      {...restProps}
      onClick={handleClick}
      ref={forwardedRef}
    >
      {children}
    </Comp>
  )
})

PlaybackControl.displayName = "PlaybackControl"
