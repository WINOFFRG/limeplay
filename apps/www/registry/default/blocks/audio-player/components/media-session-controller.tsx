"use client"

import * as React from "react"

import type { AudioPlayerAsset } from "@/registry/default/blocks/audio-player/player"

import { getAudioAssetMetadata } from "@/registry/default/blocks/audio-player/components/audio-source"
import { useMediaApi } from "@/registry/default/blocks/audio-player/lib/media-kit"
import { useAsset, useAssetStore } from "@/registry/default/hooks/use-asset"
import {
  canMoveToNextMediaSessionTrack,
  canMoveToPreviousMediaSessionTrack,
  canStartMediaSessionPlayback,
  getMediaSessionCurrentTime,
  getMediaSessionMetadataValue,
  getMediaSessionPlaybackState,
  getMediaSessionPositionState,
  isMediaSessionPlaylistSource,
  useMediaSessionActionHandlers,
  useMediaSessionSync,
} from "@/registry/default/hooks/use-media-session"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { useTimelineStore } from "@/registry/default/hooks/use-timeline"

export function AudioMediaSessionController() {
  const mediaApi = useMediaApi()
  const { currentItem } = useAsset<AudioPlayerAsset>()
  const currentTime = useTimelineStore((state) => state.currentTime)
  const duration = useTimelineStore((state) => state.duration)
  const sourceType = useAssetStore((state) => state.sourceType)
  const status = usePlaybackStore((state) => state.status)
  const asset = currentItem?.properties ?? null
  const active = asset !== null
  const playlistSource = isMediaSessionPlaylistSource(sourceType)

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
    canGoNext: playlistSource,
    canGoPrevious: playlistSource,
    getCurrentTime: () => {
      const state = mediaApi.getState()

      return getMediaSessionCurrentTime({
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
      if (
        canMoveToNextMediaSessionTrack(state.asset.sourceType, state.playlist)
      ) {
        state.playlist.next()
      }
    },
    onPause: () => {
      mediaApi.getState().playback.pause()
    },
    onPlay: () => {
      const state = mediaApi.getState()
      if (!canStartMediaSessionPlayback(state.playback.status)) return

      return state.playback.play()
    },
    onPreviousTrack: () => {
      const state = mediaApi.getState()
      if (
        canMoveToPreviousMediaSessionTrack(
          state.asset.sourceType,
          state.playlist
        )
      ) {
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

function getAudioMediaSessionMetadata(
  asset: AudioPlayerAsset
): MediaMetadataInit {
  const metadata = getAudioAssetMetadata(asset)
  const poster = getMediaSessionMetadataValue(metadata.poster, asset.poster)

  return {
    album: getMediaSessionMetadataValue(asset.albumName),
    artist: getMediaSessionMetadataValue(asset.artistName),
    artwork: poster ? [{ sizes: "512x512", src: poster }] : [],
    title: metadata.title,
  }
}
