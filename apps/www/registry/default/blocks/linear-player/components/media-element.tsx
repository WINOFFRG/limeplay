"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { Media } from "@/registry/default/ui/media"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function MediaElement() {
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const searchParams = useSearchParams()
  const playbackUrl = searchParams.get("playbackUrl")

  useEffect(() => {
    const mediaElement = mediaRef.current

    if (player && mediaElement) {
      let finalUrl =
        "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"

      if (playbackUrl) {
        try {
          const parsedUrl = new URL(playbackUrl)

          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Invalid URL protocol")
          }

          finalUrl = parsedUrl.toString()
        } catch (error) {
          console.error(
            "Invalid playback URL:",
            error instanceof Error ? error.message : "Unknown error"
          )
        }
      }

      const config = {
        streaming: {
          // DEV: To debug the buffer values in timeline slider
          bufferingGoal: 100,
        },
      } as shaka.extern.PlayerConfiguration

      player.configure(config)

      void player
        .load(finalUrl)
        .then(() => {
          console.debug("[limeplayer] media loaded")
        })
        .catch((error: unknown) => {
          console.error("[limeplayer] error loading media:", error)
        })
    }
  }, [player, mediaRef, playbackUrl])

  return (
    <Media
      as="video"
      className="size-full bg-black object-cover"
      autoPlay={true}
      muted
      loop
    />
  )
}
