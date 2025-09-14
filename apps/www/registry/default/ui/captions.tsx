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
}

export const CaptionsControl = React.forwardRef<
  HTMLButtonElement,
  CaptionsControlProps
>((props, forwardedRef) => {
  const Comp = props.asChild ? Slot : Button
  const textTracks = useMediaStore((state) => state.textTracks)

  const { toggleCaptionVisibility } = useCaptions()

  return (
    <Comp
      disabled={!textTracks || textTracks.length === 0}
      data-slot="captions-control"
      {...props}
      ref={forwardedRef}
      onClick={toggleCaptionVisibility}
      aria-label="Captions (keyboard shortcut c)"
      aria-keyshortcuts="c"
    />
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
        "relative flex w-full grow flex-col justify-end",
        className
      )}
      {...etc}
    />
  )
})
