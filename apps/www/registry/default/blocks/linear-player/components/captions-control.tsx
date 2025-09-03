"use client"

import React, { useEffect, useImperativeHandle, useRef } from "react"
import { ClosedCaptioningIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/blocks/linear-player/components/button"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export const Root = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    containerRef?: React.RefObject<HTMLDivElement | null>
  }
>((props, ref) => {
  const internalRef = useRef<HTMLButtonElement>(null)
  const { className, disabled, containerRef, ...etc } = props

  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)

  useEffect(() => {
    if (!mediaRef.current || !containerRef?.current || !player) {
      console.log("[marker445] not configuring text display factory", {
        mediaRef,
        containerRef,
        player,
      })
      return
    }

    console.log("[marker445] setting video container", {
      containerRef: containerRef.current,
    })

    player.setVideoContainer(containerRef.current)

    // const textTracks = player.getTextTracks()

    const addTextTrack = () => {
      player
        .addTextTrackAsync(
          "/assets/all_variants.vtt",
          "en",
          "subtitle",
          "text/vtt",
          undefined,
          "custom"
        )
        .then((track) => {
          console.log("[marker445] added text track", track)
          player.selectTextTrack(track)
          player.setTextTrackVisibility(true)
        })
        .catch((error) => {
          console.error("[marker445] error adding text track", error)
        })
    }

    player.addEventListener("loaded", addTextTrack)

    return () => {
      player.removeEventListener("loaded", addTextTrack)
    }
    // player.selectTextTrack(textTracks[1])
    // player.setTextTrackVisibility(true)
    // mediaRef.current.currentTime = 120
  }, [containerRef, mediaRef, player])

  useImperativeHandle(ref, () => internalRef.current!)

  return (
    <Button
      ref={internalRef}
      type="button"
      className={cn(
        `
          relative inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors
          hover:bg-accent hover:text-accent-foreground
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
          disabled:pointer-events-none disabled:opacity-50
        `,
        className
      )}
      disabled={disabled}
      {...etc}
    >
      <ClosedCaptioningIcon weight="fill" />
    </Button>
  )
})

Root.displayName = "CaptionsControlRoot"
