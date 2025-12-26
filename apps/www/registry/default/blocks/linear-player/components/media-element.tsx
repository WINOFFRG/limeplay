"use client"

import type shaka from "shaka-player"

import { useEffect } from "react"

import { Media } from "@/registry/default/ui/media"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export type MediaElementProps = {
  config?: shaka.extern.PlayerConfiguration
  src: string
}

export function MediaElement({ config, src }: MediaElementProps) {
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
      autoPlay={false}
      className="size-full object-cover"
      loop
      muted
    />
  )
}
