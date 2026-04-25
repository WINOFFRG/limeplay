"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { usePictureInPictureStore } from "@/registry/default/hooks/use-picture-in-picture"
import {
  MediaReadyState,
  usePlaybackStore,
} from "@/registry/default/hooks/use-playback"

export interface PictureInPictureControlProps extends React.ComponentProps<
  typeof Button
> {
  /**
   * Render as child component using Radix Slot
   * @default false
   */
  asChild?: boolean
  /**
   * Keyboard shortcut hint displayed in aria-label
   * @example "P"
   */
  shortcut?: string
}

export type PictureInPictureControlPropsDocs = Pick<
  PictureInPictureControlProps,
  "asChild" | "shortcut"
>

export const PictureInPictureControl = React.forwardRef<
  HTMLButtonElement,
  PictureInPictureControlProps
>((props, forwardedRef) => {
  const readyState = usePlaybackStore((state) => state.readyState)
  const isPictureInPictureActive = usePictureInPictureStore(
    (state) => state.active
  )
  const isPictureInPictureSupported = usePictureInPictureStore(
    (state) => state.supported
  )
  const toggle = usePictureInPictureStore((state) => state.toggle)

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

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) {
      await toggle()
    }
  }

  const isDisabled =
    readyState < MediaReadyState.HAVE_METADATA ||
    !isPictureInPictureSupported ||
    userDisabled

  const getDefaultAriaLabel = () => {
    const shortcutText = shortcut ? ` (keyboard shortcut ${shortcut})` : ""
    const label = isPictureInPictureActive
      ? "Exit Picture-in-Picture"
      : "Enter Picture-in-Picture"
    return `${label}${shortcutText}`
  }

  return (
    <Comp
      aria-keyshortcuts={shortcut}
      aria-label={ariaLabelProp ?? getDefaultAriaLabel()}
      data-label="lp-picture-in-picture-control"
      disabled={isDisabled}
      {...restProps}
      onClick={handleClick}
      ref={forwardedRef}
    >
      {children}
    </Comp>
  )
})

PictureInPictureControl.displayName = "PictureInPictureControl"
