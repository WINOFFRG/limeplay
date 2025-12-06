"use client"

import { composeRefs } from "@radix-ui/react-compose-refs"
import { Slot } from "@radix-ui/react-slot"
import React, { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCaptions } from "@/registry/default/hooks/use-captions"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface CaptionsControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Render as child component using Radix Slot
   * @default false
   */
  asChild?: boolean
  /**
   * Keyboard shortcut hint displayed in aria-label
   * @example "C"
   */
  shortcut?: string
}

export type CaptionsControlPropsDocs = Pick<
  CaptionsControlProps,
  "asChild" | "shortcut"
>

export const CaptionsControl = React.forwardRef<
  HTMLButtonElement,
  CaptionsControlProps
>((props, forwardedRef) => {
  const textTracks = useMediaStore((state) => state.textTracks)
  const { toggleCaptionVisibility } = useCaptions()

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
      toggleCaptionVisibility()
    }
  }

  const isDisabled = !textTracks || textTracks.length === 0 || userDisabled

  const getDefaultAriaLabel = () => {
    const shortcutText = shortcut ? ` (keyboard shortcut ${shortcut})` : ""
    return `Captions${shortcutText}`
  }

  return (
    <Comp
      aria-keyshortcuts={shortcut}
      aria-label={ariaLabelProp ?? getDefaultAriaLabel()}
      data-label="lp-captions-control"
      disabled={isDisabled}
      {...restProps}
      onClick={handleClick}
      ref={forwardedRef}
    >
      {children}
    </Comp>
  )
})

CaptionsControl.displayName = "CaptionsControl"

export type CaptionsContainerPropsDocs = Pick<
  CaptionsContainerProps,
  "fontScale"
>

interface CaptionsContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Font scale factor for caption text size
   * @default 1
   */
  fontScale?: number
}

export const CaptionsContainer = React.forwardRef<
  HTMLDivElement,
  CaptionsContainerProps
>((props, ref) => {
  const { className, fontScale, ...etc } = props
  const player = useMediaStore((state) => state.player)
  const setContainerElement = useMediaStore(
    (state) => state.setTextTrackContainerElement
  )

  useEffect(() => {
    if (player && fontScale) {
      player.configure({
        textDisplayer: {
          fontScaleFactor: fontScale,
        },
      })
    }
  }, [player, fontScale])

  return (
    <div
      className={cn(
        "relative flex w-full grow flex-col justify-end text-lg",
        className
      )}
      ref={composeRefs(ref, setContainerElement)}
      {...etc}
    />
  )
})

CaptionsContainer.displayName = "CaptionsContainer"
