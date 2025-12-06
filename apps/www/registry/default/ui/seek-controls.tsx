"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { Button } from "@/components/ui/button"
import { MediaReadyState } from "@/registry/default/hooks/use-player"
import { useSeek } from "@/registry/default/hooks/use-seek"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export type SeekControlPropsDocs = Pick<
  SeekControlProps,
  "offset" | "shortcut" | "asChild"
>

export interface SeekControlProps extends React.ComponentProps<typeof Button> {
  /**
   * The amount of time (in seconds) to seek.
   * Positive values seek forward, negative values seek backward.
   * @example 10 for forward 10s, -10 for backward 10s
   */
  offset: number
  shortcut?: string
  asChild?: boolean
}

export const SeekControl = React.forwardRef<
  HTMLButtonElement,
  SeekControlProps
>((props, forwardedRef) => {
  const readyState = useMediaStore((state) => state.readyState)
  const { seek } = useSeek()

  const {
    children,
    onClick,
    disabled: userDisabled,
    "aria-label": ariaLabelProp,
    offset,
    shortcut,
    asChild = false,
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
      data-label="lp-seek-control"
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

SeekControl.displayName = "SeekControl"
