"use client"

import * as React from "react"

import type { AudioPlayerAsset } from "@/registry/default/blocks/audio-player/player"
import type { PlaylistStore } from "@/registry/default/hooks/use-playlist"

import { getAudioAssetMetadata } from "@/registry/default/blocks/audio-player/components/audio-source"
import { useMediaApi } from "@/registry/default/blocks/audio-player/lib/media-kit"
import {
  AssetSourceType,
  useAsset,
  useAssetStore,
} from "@/registry/default/hooks/use-asset"
import {
  getMediaSessionPlaybackState,
  getMediaSessionPositionState,
  useMediaSessionActionHandlers,
  useMediaSessionSync,
} from "@/registry/default/hooks/use-media-session"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { useTimelineStore } from "@/registry/default/hooks/use-timeline"

export function AudioMediaSessionController() {
  const mediaApi = useMediaApi()
  const { currentItem, hasNext, hasPrevious } = useAsset<AudioPlayerAsset>()
  const currentTime = useTimelineStore((state) => state.currentTime)
  const duration = useTimelineStore((state) => state.duration)
  const sourceType = useAssetStore((state) => state.sourceType)
  const status = usePlaybackStore((state) => state.status)
  const asset = currentItem?.properties ?? null
  const active = asset !== null
  const playlistSource = isPlaylistSource(sourceType)

  const metadata = React.useMemo(
    () => (asset ? getAudioMediaSessionMetadata(asset) : null),
    [asset]
  )
  const position = React.useMemo(
    () =>
      getMediaSessionPositionState({
        active,
        currentTime,
        duration,
      }),
    [active, currentTime, duration]
  )
  const actions = useMediaSessionActionHandlers({
    canGoNext: playlistSource && hasNext,
    canGoPrevious: playlistSource && hasPrevious,
    getCurrentTime: () => {
      const state = mediaApi.getState()

      return getCurrentTimelineTime({
        currentTime: state.timeline.currentTime,
        isLive: state.timeline.isLive,
        mediaElement: state.media.mediaElement,
      })
    },
    getSeekRange: () => {
      const state = mediaApi.getState()

      return state.timeline.isLive ? state.player.instance?.seekRange() : null
    },
    onNextTrack: () => {
      const state = mediaApi.getState()
      if (canMoveToNextTrack(state.asset.sourceType, state.playlist)) {
        state.playlist.next()
      }
    },
    onPause: () => {
      mediaApi.getState().playback.pause()
    },
    onPlay: () => mediaApi.getState().playback.play(),
    onPreviousTrack: () => {
      const state = mediaApi.getState()
      if (canMoveToPreviousTrack(state.asset.sourceType, state.playlist)) {
        state.playlist.previous()
      }
    },
    onSeek: (time) => {
      mediaApi.getState().timeline.seek(time)
    },
  })

  useMediaSessionSync({
    actions,
    active,
    metadata,
    playbackState: getMediaSessionPlaybackState({ active, status }),
    position,
  })

  return null
}

function canMoveToNextTrack(
  sourceType: AssetSourceType | null,
  playlist: PlaylistStore["playlist"]
): boolean {
  return isPlaylistSource(sourceType) && hasNextPlaylistItem(playlist)
}

function canMoveToPreviousTrack(
  sourceType: AssetSourceType | null,
  playlist: PlaylistStore["playlist"]
): boolean {
  return isPlaylistSource(sourceType) && hasPreviousPlaylistItem(playlist)
}

function firstNonEmpty(
  ...values: (null | number | string | undefined)[]
): string | undefined {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value)
    }

    if (typeof value !== "string") continue

    const trimmed = value.trim()
    if (trimmed) return trimmed
  }

  return undefined
}

function getAudioMediaSessionMetadata(
  asset: AudioPlayerAsset
): MediaMetadataInit {
  const metadata = getAudioAssetMetadata(asset)
  const poster = firstNonEmpty(metadata.poster, asset.poster)

  return {
    album: firstNonEmpty(asset.albumName),
    artist: firstNonEmpty(asset.artistName, metadata.subtitle),
    artwork: poster ? [{ sizes: "512x512", src: poster }] : [],
    title: metadata.title,
  }
}

function getCurrentTimelineTime({
  currentTime,
  isLive,
  mediaElement,
}: {
  currentTime: number
  isLive: boolean
  mediaElement: HTMLMediaElement | null
}): number {
  return isLive && mediaElement ? mediaElement.currentTime : currentTime
}

function hasNextPlaylistItem(playlist: PlaylistStore["playlist"]): boolean {
  if (playlist.repeatMode === "all" && playlist.queue.length > 0) return true

  return playlist.getNextIndex() !== -1
}

function hasPreviousPlaylistItem(playlist: PlaylistStore["playlist"]): boolean {
  if (playlist.repeatMode === "all" && playlist.queue.length > 0) return true

  return playlist.getPreviousIndex() !== -1
}

function isPlaylistSource(sourceType: AssetSourceType | null): boolean {
  return sourceType === AssetSourceType.Playlist
}
