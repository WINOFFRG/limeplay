"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { MediaReadyState } from "@/registry/default/hooks/use-playback"
import { useSeek } from "@/registry/default/hooks/use-seek"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface SeekControlProps extends React.ComponentProps<typeof Button> {
  asChild?: boolean
  /**
   * The amount of time (in seconds) to seek.
   * Positive values seek forward, negative values seek backward.
   * @example 10 for forward 10s, -10 for backward 10s
   */
  offset: number
  shortcut?: string
}

export const SeekControl = React.forwardRef<
  HTMLButtonElement,
  SeekControlProps
>((props, forwardedRef) => {
  const readyState = useMediaStore((state) => state.readyState)
  const { seek } = useSeek()

  const {
    "aria-label": ariaLabelProp,
    asChild = false,
    children,
    disabled: userDisabled,
    offset,
    onClick,
    shortcut,
    ...restProps
  } = props

  const Comp = asChild ? Slot : Button

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) {
      seek(offset)
    }
  }

  const isDisabled = readyState < MediaReadyState.HAVE_METADATA || userDisabled

  const getDefaultAriaLabel = () => {
    const shortcutText = shortcut ? ` (keyboard shortcut ${shortcut})` : ""
    const direction = offset >= 0 ? "Forward" : "Backward"
    const absOffset = Math.abs(offset)
    return `${direction} ${absOffset} seconds${shortcutText}`
  }

  return (
    <Comp
      aria-keyshortcuts={shortcut}
      aria-label={ariaLabelProp ?? getDefaultAriaLabel()}
      data-label="lp-seek-control"
      disabled={isDisabled}
      {...restProps}
      onClick={handleClick}
      ref={forwardedRef}
    >
      {children}
    </Comp>
  )
})

SeekControl.displayName = "SeekControl"
