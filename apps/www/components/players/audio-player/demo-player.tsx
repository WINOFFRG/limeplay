"use client"

import type { ReactNode } from "react"

import { useEffect, useState } from "react"

import type { AudioPlayerAsset } from "@/registry/default/blocks/audio-player/components/media-player"

import {
  useStreamPanelStore,
  useStreamPanelStoreHydrated,
} from "@/components/stream-panel/use-stream-panel"
import { AudioPlayer } from "@/registry/default/blocks/audio-player/components/media-player"

import {
  AUDIO_PLAYER_DEMO_PLAYLIST_ID,
  fetchAudioPlayerDemoPlaylist,
} from "./demo"

export interface AudioPlayerDemoProps {
  children?: ReactNode
  playlistId?: string
}

export function AudioPlayerDemo({
  children,
  playlistId = AUDIO_PLAYER_DEMO_PLAYLIST_ID,
}: AudioPlayerDemoProps) {
  const [playlist, setPlaylist] = useState<AudioPlayerAsset[]>([])
  const storeHydrated = useStreamPanelStoreHydrated()
  const hasPersistedAudioSelection = useStreamPanelStore((s) =>
    Boolean(s.contentSelections.audio)
  )

  useEffect(() => {
    const abortController = new AbortController()

    void fetchAudioPlayerDemoPlaylist(playlistId, abortController.signal)
      .then((items) => {
        if (!abortController.signal.aborted) {
          setPlaylist(items)
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        console.error("Failed to load audio player demo playlist:", error)
      })

    return () => {
      abortController.abort()
    }
  }, [playlistId])

  return (
    <AudioPlayer
      autoLoad={storeHydrated ? !hasPersistedAudioSelection : false}
      playlist={playlist}
    >
      {children}
    </AudioPlayer>
  )
}
