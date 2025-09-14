"use client"

import { useEffect } from "react"

import { ASSETS } from "@/registry/default/blocks/linear-player/lib/playlist"
import { Media } from "@/registry/default/ui/media"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function MediaElement({
  src,
  config,
}: {
  src?: string
  config?: shaka.extern.PlayerConfiguration
}) {
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)

  useEffect(() => {
    const mediaElement = mediaRef.current

    if (!src || !config) {
      src = ASSETS[0].src
      config = ASSETS[0].config
    }

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

      if (config) {
        player.configure(config)
      }

      if (src) {
        void player
          .load(src)
          .then(() => {
            console.debug("[limeplay] media loaded")
          })
          .catch((error: unknown) => {
            console.error("[limeplay] error loading media:", error)
          })
      }
    }
  }, [player, mediaRef, src, config])

  return (
    <Media
      as="video"
      className="size-full object-cover"
      autoPlay={false}
      muted
      loop
    />
  )
}
