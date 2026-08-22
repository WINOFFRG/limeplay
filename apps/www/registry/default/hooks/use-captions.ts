"use client"

import type shaka from "shaka-player"

import { useEffect } from "react"

import type {
  MediaFeature,
  MediaStore,
} from "@/registry/default/ui/media-provider"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import {
  PLAYER_FEATURE_KEY,
  type PlayerStore,
  usePlayerStore,
} from "@/registry/default/hooks/use-player"
import { getDeviceLanguage, off, on } from "@/registry/default/lib/utils"
import {
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/registry/default/ui/media-provider"

export const CAPTIONS_FEATURE_KEY = "captions"

export interface CaptionsStore {
  [CAPTIONS_FEATURE_KEY]: {
    activeTrack: null | shaka.extern.TextTrack
    containerElement: HTMLDivElement | null
    setContainerElement: (ref: HTMLDivElement | null) => void
    toggleVisibility: () => void
    tracks?: shaka.extern.TextTrack[]
    visible: boolean
  }
}

export function captionsFeature(): MediaFeature<
  CaptionsStore,
  CaptionsStore & MediaStore & PlayerStore
> {
  return {
    createSlice: (set, get) => ({
      [CAPTIONS_FEATURE_KEY]: {
        activeTrack: null,
        containerElement: null,
        setContainerElement: (element) => {
          set(({ captions }) => {
            captions.containerElement = element
          })
        },
        toggleVisibility: () => {
          const player = get().player.instance
          if (!player) {
            return
          }

          const captions = get().captions

          if (captions.visible) {
            player.selectTextTrack(null)
            return
          }

          const track =
            captions.activeTrack ?? findDefaultTrack(captions.tracks)
          if (track) {
            player.selectTextTrack(track)
          }
        },
        tracks: undefined,
        visible: false,
      },
    }),
    key: CAPTIONS_FEATURE_KEY,
    Setup: CaptionsSetup,
  }
}

export function useCaptions() {
  return useCaptionsStore((state) => state)
}

export function useCaptionsStore<TSelected>(
  selector: (state: CaptionsStore["captions"]) => TSelected
): TSelected {
  return useMediaFeatureStore<CaptionsStore, TSelected>(
    CAPTIONS_FEATURE_KEY,
    (state) => selector(state.captions)
  )
}

function CaptionsSetup() {
  const store = useMediaFeatureApi<CaptionsStore>(CAPTIONS_FEATURE_KEY)
  const playerStore = useMediaFeatureApi<PlayerStore>(PLAYER_FEATURE_KEY)
  const player = usePlayerStore((state) => state.instance)
  const containerElement = useCaptionsStore((state) => state.containerElement)
  const mediaElement = useMediaStore((state) => state.mediaElement)
  const canPlay = usePlaybackStore((state) => state.canPlay)

  const syncTextTrackState = () => {
    const player = playerStore.getState().player.instance
    if (!player) {
      return
    }

    const tracks = player.getTextTracks()
    const activeTrack = tracks.find(
      (track: shaka.extern.TextTrack) => track.active
    )

    store.setState(({ captions }) => {
      captions.activeTrack = activeTrack ?? null
      captions.tracks = tracks
      captions.visible = Boolean(activeTrack)
    })
  }

  useEffect(() => {
    if (!player || !containerElement) {
      return
    }

    player.setVideoContainer(containerElement)
  }, [containerElement, player])

  useEffect(() => {
    if (!mediaElement || !player) return

    if (canPlay) {
      syncTextTrackState()
    }

    on(player, ["textchanged", "trackschanged", "loading"], syncTextTrackState)

    return () => {
      off(
        player,
        ["textchanged", "trackschanged", "loading"],
        syncTextTrackState
      )
    }
  }, [canPlay, mediaElement, player])

  return null
}

function findDefaultTrack(tracks?: shaka.extern.TextTrack[]) {
  if (!tracks || tracks.length === 0) {
    console.warn("No text tracks found")
    return
  }

  if (tracks.length === 1) {
    return tracks[0]
  }

  const deviceLanguage = getDeviceLanguage()

  return tracks.find((track) => track.language === deviceLanguage) ?? tracks[0]
}
