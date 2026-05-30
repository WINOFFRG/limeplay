"use client"

import { useEffect, useState } from "react"

import type { AudioPlayerAsset } from "@/registry/default/blocks/audio-player/components/media-player"

import { AudioPlayer } from "@/registry/default/blocks/audio-player/components/media-player"

import {
  AUDIO_PLAYER_DEMO_PLAYLIST_ID,
  fetchAudioPlayerDemoPlaylist,
} from "./demo"

export interface AudioPlayerDemoProps {
  playlistId?: string
}

export function AudioPlayerDemo({
  playlistId = AUDIO_PLAYER_DEMO_PLAYLIST_ID,
}: AudioPlayerDemoProps) {
  const [playlist, setPlaylist] = useState<AudioPlayerAsset[]>([])

  useEffect(() => {
    const abortController = new AbortController()

    void fetchAudioPlayerDemoPlaylist(playlistId, abortController.signal).then(
      (items) => {
        if (!abortController.signal.aborted) {
          setPlaylist(items)
        }
      }
    )

    return () => {
      abortController.abort()
    }
  }, [playlistId])

  return <AudioPlayer playlist={playlist} />
}
