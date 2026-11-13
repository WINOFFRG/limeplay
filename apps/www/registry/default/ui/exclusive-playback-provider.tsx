"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

export interface ExclusivePlaybackProviderProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

export type ExclusivePlaybackProviderPropsDocs = Pick<
  ExclusivePlaybackProviderProps,
  "asChild"
>

export const ExclusivePlaybackProvider = React.forwardRef<
  HTMLDivElement,
  ExclusivePlaybackProviderProps
>(function ExclusivePlaybackProvider(
  { asChild, onPlayCapture, ...props },
  forwardedRef
) {
  const Component = asChild ? Slot : "div"

  const handlePlayCapture = (event: React.SyntheticEvent<HTMLDivElement>) => {
    onPlayCapture?.(event)
    if (event.defaultPrevented) return

    const startedElement = getMediaElement(event)
    if (!startedElement || startedElement.paused) return

    const descendants =
      event.currentTarget.querySelectorAll<HTMLMediaElement>("audio, video")

    for (const mediaElement of descendants) {
      if (mediaElement !== startedElement && !mediaElement.paused) {
        mediaElement.pause()
      }
    }
  }

  return (
    <Component
      {...props}
      onPlayCapture={handlePlayCapture}
      ref={forwardedRef}
    />
  )
})

ExclusivePlaybackProvider.displayName = "ExclusivePlaybackProvider"

function getMediaElement(
  event: React.SyntheticEvent<HTMLDivElement>
): HTMLMediaElement | null {
  return event.target instanceof HTMLMediaElement ? event.target : null
}
