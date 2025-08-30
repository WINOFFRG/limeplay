"use client"

import React, { useRef } from "react"

import { useMediaStore } from "@/registry/default/ui/media-provider"

declare global {
  interface HTMLMediaElement {
    player: shaka.Player | null
  }
}

export function useShakaPlayer() {
  const setPlayer = useMediaStore((state) => state.setPlayer)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const debug = useMediaStore((state) => state.debug)
  const isServer = typeof window === "undefined"
  const playerInstance = useRef<shaka.Player | null>(null)

  React.useEffect(() => {
    if (isServer) {
      console.warn("skipping shaka load on server")
      return
    }

    const mediaElement = mediaRef.current

    async function loadPlayer() {
      const shakaLib = debug
        ? await import("shaka-player/dist/shaka-player.compiled.debug")
        : await import("shaka-player")

      if (!mediaElement) {
        return
      }

      playerInstance.current = new shakaLib.Player()
      setPlayer(playerInstance.current)

      await playerInstance.current.attach(mediaElement)

      mediaElement.player = playerInstance.current
    }

    void loadPlayer()

    return () => {
      if (playerInstance.current) {
        if (mediaElement) {
          mediaElement.pause()
        }
        void playerInstance.current.destroy()
      }
    }
  }, [isServer, mediaRef, debug, setPlayer])

  return playerInstance.current
}
