"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  MediaReadyState,
  usePlaybackStore,
} from "@/registry/default/hooks/use-playback"
import { useSeek } from "@/registry/default/hooks/use-seek"
import { Slot } from "@/registry/default/lib/slot"

export interface SeekControlProps extends React.ComponentProps<typeof Button> {
  asChild?: boolean
  /**
   * The amount of time (in seconds) to seek.
   * Positive values seek forward, negative values seek backward.
   * @example 10 for forward 10s, -10 for backward 10s
   */
  offset: number
  render?: React.ReactElement
  shortcut?: string
}

export const SeekControl = React.forwardRef<
  HTMLButtonElement,
  SeekControlProps
>((props, forwardedRef) => {
  const readyState = usePlaybackStore((state) => state.readyState)
  const { seek } = useSeek()

  const {
    "aria-label": ariaLabelProp,
    asChild = false,
    children,
    disabled: userDisabled,
    offset,
    onClick,
    render,
    shortcut,
    ...restProps
  } = props

  const Comp = render ? Slot : asChild ? Slot : Button

  // Typed from the Button's own onClick, so this works with Radix and Base UI buttons.
  const handleClick: NonNullable<SeekControlProps["onClick"]> = (event) => {
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
      {render ? React.cloneElement(render, undefined, children) : children}
    </Comp>
  )
})

SeekControl.displayName = "SeekControl"
