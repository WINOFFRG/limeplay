"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

export interface ExclusivePlaybackProviderProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

export const ExclusivePlaybackProvider = React.forwardRef<
  HTMLDivElement,
  ExclusivePlaybackProviderProps
>(function ExclusivePlaybackProvider(
  { asChild, onEndedCapture, onPauseCapture, onPlayCapture, ...props },
  forwardedRef
) {
  const activeMediaRef = React.useRef<HTMLMediaElement | null>(null)
  const Component = asChild ? Slot : "div"

  const handlePlayCapture = (event: React.SyntheticEvent<HTMLDivElement>) => {
    onPlayCapture?.(event)
    if (event.defaultPrevented) return

    const mediaElement = getMediaElement(event)
    if (!mediaElement || activeMediaRef.current === mediaElement) return

    activeMediaRef.current?.pause()
    activeMediaRef.current = mediaElement
  }

  const releaseMedia = (event: React.SyntheticEvent<HTMLDivElement>) => {
    const mediaElement = getMediaElement(event)
    if (activeMediaRef.current === mediaElement) {
      activeMediaRef.current = null
    }
  }

  const handlePauseCapture = (event: React.SyntheticEvent<HTMLDivElement>) => {
    onPauseCapture?.(event)
    if (!event.defaultPrevented) releaseMedia(event)
  }

  const handleEndedCapture = (event: React.SyntheticEvent<HTMLDivElement>) => {
    onEndedCapture?.(event)
    if (!event.defaultPrevented) releaseMedia(event)
  }

  return (
    <Component
      {...props}
      onEndedCapture={handleEndedCapture}
      onPauseCapture={handlePauseCapture}
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
