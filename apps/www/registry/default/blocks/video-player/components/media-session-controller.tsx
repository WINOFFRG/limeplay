"use client"

import * as React from "react"

import type { VideoPlayerAsset } from "@/registry/default/blocks/video-player/player"
import type { PlaylistStore } from "@/registry/default/hooks/use-playlist"

import { useMediaApi } from "@/registry/default/blocks/video-player/lib/media-kit"
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
import { usePictureInPictureStore } from "@/registry/default/hooks/use-picture-in-picture"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { usePlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"
import { useTimelineStore } from "@/registry/default/hooks/use-timeline"

export function VideoMediaSessionController() {
  const mediaApi = useMediaApi()
  const { currentItem, hasNext, hasPrevious } = useAsset<VideoPlayerAsset>()
  const currentTime = useTimelineStore((state) => state.currentTime)
  const duration = useTimelineStore((state) => state.duration)
  const pictureInPictureSupported = usePictureInPictureStore(
    (state) => state.supported
  )
  const playbackRate = usePlaybackRateStore((state) => state.value)
  const sourceType = useAssetStore((state) => state.sourceType)
  const status = usePlaybackStore((state) => state.status)
  const asset = currentItem?.properties ?? null
  const active = asset !== null
  const playlistSource = isPlaylistSource(sourceType)

  const metadata = React.useMemo(
    () => (asset ? getVideoMediaSessionMetadata(asset) : null),
    [asset]
  )
  const position = React.useMemo(
    () =>
      getMediaSessionPositionState({
        active,
        currentTime,
        duration,
        playbackRate,
      }),
    [active, currentTime, duration, playbackRate]
  )

  const actions = useMediaSessionActionHandlers({
    canEnterPictureInPicture: active && pictureInPictureSupported,
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
    onEnterPictureInPicture: () => {
      void mediaApi.getState().pictureInPicture.enter()
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

function getVideoMediaSessionMetadata(
  asset: VideoPlayerAsset
): MediaMetadataInit | null {
  const title = firstNonEmpty(asset.title)
  const artist = firstNonEmpty(asset.description, asset.year)
  const poster = firstNonEmpty(asset.poster)

  if (!title && !artist && !poster) return null

  return {
    artist,
    artwork: poster ? [{ sizes: "512x512", src: poster }] : [],
    title,
  }
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
