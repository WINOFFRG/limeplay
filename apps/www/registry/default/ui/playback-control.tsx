"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  MediaReadyState,
  usePlaybackStore,
} from "@/registry/default/hooks/use-playback"

interface PlaybackControlProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Render as child component using Radix Slot
   * @default false
   */
  asChild?: boolean
  render?: React.ReactElement
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
  const status = usePlaybackStore((state) => state.status)
  const readyState = usePlaybackStore((state) => state.readyState)
  const togglePaused = usePlaybackStore((state) => state.togglePaused)

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
      togglePaused()
    }
  }

  const isDisabled =
    readyState < MediaReadyState.HAVE_CURRENT_DATA || userDisabled

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
      {render ? React.cloneElement(render, undefined, children) : children}
    </Comp>
  )
})

PlaybackControl.displayName = "PlaybackControl"
