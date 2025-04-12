"use client"

import React, { useEffect } from "react"

// import shaka from "shaka-player"

import { useMediaStore } from "@/registry/default/ui/media-provider"

interface ShakaProviderProps extends React.PropsWithChildren {
  // Loads shaka-player debug version
  debug?: boolean
}

export function ShakaProvider({ children, debug = false }: ShakaProviderProps) {
  const setPlayer = useMediaStore((state) => state.setPlayer)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const isServer = typeof window === undefined

  useEffect(() => {
    if (isServer) {
      console.warn("skipping shaka load on server")
      return
    }

    async function loadPlayer() {
      const shakaLib = debug
        ? await import("shaka-player/dist/shaka-player.compiled.debug")
        : await import("shaka-player")

      if (!mediaRef?.current) {
        return
      }

      const _player = new shakaLib.Player(mediaRef.current)
      setPlayer(_player)

      if (debug) {
        // @ts-expect-error DEV only
        window.player = _player
      }
    }

    loadPlayer()
  }, [mediaRef, debug, setPlayer])

  return <div>{children}</div>
}
