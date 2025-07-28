"use client"

import React, { useRef } from "react"

import { useMediaStore } from "@/registry/default/ui/media-provider"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseShakaPlayerProps {}

declare global {
  interface Window {
    shaka_player: shaka.Player
  }
}

export function useShakaPlayer({ ...props }: UseShakaPlayerProps = {}) {
  const setPlayer = useMediaStore((state) => state.setPlayer)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const debug = useMediaStore((state) => state.debug)
  const isServer = typeof window === undefined
  const playerInstance = useRef<shaka.Player | null>(null)

  React.useEffect(() => {
    if (isServer) {
      console.warn("skipping shaka load on server")
      return
    }

    // Capture current media element to use in cleanup
    const mediaElement = mediaRef?.current

    async function loadPlayer() {
      const shakaLib = debug
        ? await import("shaka-player/dist/shaka-player.compiled.debug")
        : await import("shaka-player")

      if (!mediaElement) {
        return
      }

      playerInstance.current = new shakaLib.Player()
      playerInstance.current.attach(mediaElement)
      setPlayer(playerInstance.current)

      if (debug) {
        window.shaka_player = playerInstance.current
      }
    }

    loadPlayer()

    return () => {
      if (playerInstance.current) {
        if (mediaElement) {
          mediaElement.pause()
        }
        playerInstance.current.destroy()
      }
    }
  }, [mediaRef, debug, setPlayer])

  return playerInstance.current
}
