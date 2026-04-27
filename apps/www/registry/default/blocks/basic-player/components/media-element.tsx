"use client"

import { useEffect } from "react"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import { usePlayerStore } from "@/registry/default/hooks/use-player"
import { Media } from "@/registry/default/ui/media"

export function MediaElement({ src }: { src: string }) {
  const player = usePlayerStore((state) => state.instance)
  const mediaElement = useMediaStore((state) => state.mediaElement)

  useEffect(() => {
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

      void player
        .load(src)
        .then(() => {
          console.debug("[limeplay] media loaded")
        })
        .catch((error: unknown) => {
          console.error("[limeplay] error loading media:", error)
        })
    }
  }, [player, mediaElement, src])

  return (
    <Media
      as="video"
      autoPlay={false}
      className="size-full bg-background object-cover"
      loop
      muted
    />
  )
}
