"use client"

import type shaka from "shaka-player"

import React, { useRef } from "react"

import { useMediaStore } from "@/registry/default/ui/media-provider"

declare global {
  interface HTMLMediaElement {
    player: null | shaka.Player
  }
  interface Window {
    shaka: {
      Player: typeof shaka.Player
    }
  }
}

export function useShakaPlayer() {
  const setPlayer = useMediaStore((state) => state.setPlayer)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const debug = useMediaStore((state) => state.debug)
  const isServer = typeof window === "undefined"
  const playerInstance = useRef<null | shaka.Player>(null)

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

      playerInstance.current = new shakaLib.default.Player() as shaka.Player
      setPlayer(playerInstance.current)

      await playerInstance.current.attach(mediaElement)

      mediaElement.player = playerInstance.current
      window.shaka = shakaLib.default as unknown as Window["shaka"]
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
