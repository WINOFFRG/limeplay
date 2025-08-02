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
        "https://prod-live-ygx-s1-7k3m-stream-in-edge.ygxworld.in/hungama/rewind-86400.m3u8?token=65454d6347fa1c425fadb87786be5530961b5430-59a2c1fd-1754158821-1754153921"

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
          bufferingGoal: 120,
        },
      } as shaka.extern.PlayerConfiguration

      player.configure(config)

      void player
        .load(finalUrl)
        .then(() => {
          console.debug("[limeplay] media loaded")
        })
        .catch((error: unknown) => {
          console.error("[limeplay] error loading media:", error)
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
