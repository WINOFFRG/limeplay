"use client"

import React, { useEffect } from "react"
import { composeRefs } from "@radix-ui/react-compose-refs"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCaptions } from "@/registry/default/hooks/use-captions"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface CaptionsControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  shortcut?: string
}

export const CaptionsControl = React.forwardRef<
  HTMLButtonElement,
  CaptionsControlProps
>((props, forwardedRef) => {
  const textTracks = useMediaStore((state) => state.textTracks)
  const { toggleCaptionVisibility } = useCaptions()

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
      disabled={isDisabled}
      data-label="lp-captions-control"
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

CaptionsControl.displayName = "CaptionsControl"

interface CaptionsContainerProps extends React.ComponentPropsWithoutRef<"div"> {
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
      ref={composeRefs(ref, setContainerElement)}
      className={cn(
        "relative flex w-full grow flex-col justify-end text-lg",
        className
      )}
      {...etc}
    />
  )
})

CaptionsContainer.displayName = "CaptionsContainer"
