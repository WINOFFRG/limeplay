"use client"

import { useEffect } from "react"

import { Media } from "@/registry/default/ui/media"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function MediaElement({ src }: { src: string }) {
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)

  useEffect(() => {
    const mediaElement = mediaRef.current

    if (player && mediaElement) {
      if (src) {
        try {
          const parsedUrl = new URL(src)

          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Invalid URL protocol")
          }
        } catch (error) {
          console.error(
            "Invalid playback URL:",
            error instanceof Error ? error.message : "Unknown error"
          )
        }
      }

      // const config = {
      //   streaming: {
      //     // DEV: To debug the buffer values in timeline slider
      //     bufferingGoal: 120,
      //   },
      //   manifest: {
      //     // availabilityWindowOverride: 600,
      //   },
      // } as shaka.extern.PlayerConfiguration

      // player.configure(config)

      void player
        .load(src)
        .then(() => {
          console.debug("[limeplay] media loaded")
        })
        .catch((error: unknown) => {
          console.error("[limeplay] error loading media:", error)
        })
    }
  }, [player, mediaRef, src])

  return (
    <Media
      as="video"
      className="size-full bg-background object-cover"
      autoPlay={false}
      muted
      loop
    />
  )
}
