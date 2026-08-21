"use client"

import * as React from "react"

import type { VideoPlayerAsset } from "@/registry/default/blocks/video-player/player"

import { useMediaApi } from "@/registry/default/blocks/video-player/lib/media-kit"
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
import { usePictureInPictureStore } from "@/registry/default/hooks/use-picture-in-picture"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { usePlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"
import { useTimelineStore } from "@/registry/default/hooks/use-timeline"

export function VideoMediaSessionController() {
  const mediaApi = useMediaApi()
  const { currentItem } = useAsset<VideoPlayerAsset>()
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
  const playlistSource = isMediaSessionPlaylistSource(sourceType)

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
    onEnterPictureInPicture: () => {
      void mediaApi.getState().pictureInPicture.enter()
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

function getVideoMediaSessionMetadata(
  asset: VideoPlayerAsset
): MediaMetadataInit | null {
  const title = getMediaSessionMetadataValue(asset.title)
  const artist = getMediaSessionMetadataValue(asset.description, asset.year)
  const poster = getMediaSessionMetadataValue(asset.poster)

  if (!title && !artist && !poster) return null

  return {
    artist,
    artwork: poster ? [{ sizes: "512x512", src: poster }] : [],
    title,
  }
}
