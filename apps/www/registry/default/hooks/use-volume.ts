import clamp from "lodash.clamp"
import React from "react"

import type {
  MediaEventSlice,
  MediaFeature,
} from "@/registry/default/ui/media-provider"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import { usePlayerStore } from "@/registry/default/hooks/use-player"
import { noop, off, on } from "@/registry/default/lib/utils"
import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/registry/default/ui/media-provider"

export const VOLUME_FEATURE_KEY = "volume"

export interface VolumeEvents {
  mute: { muted: boolean }
  volumechange: { muted: boolean; volume: number }
}

export interface VolumeStore extends MediaEventSlice<VolumeEvents> {
  [VOLUME_FEATURE_KEY]: {
    hasAudio: boolean
    level: number
    muted: boolean
    setMuted: (muted: boolean) => void
    setVolume: (volume: number, progress?: number, delta?: number) => void
    toggleMute: () => void
  }
}

const BASE_RESET_VOLUME = 0.05

export function useVolumeStore<TSelected>(
  selector: (state: VolumeStore["volume"]) => TSelected
): TSelected {
  return useMediaFeatureStore<VolumeStore, TSelected>(
    VOLUME_FEATURE_KEY,
    (state) => selector(state.volume)
  )
}

export function volumeFeature(): MediaFeature<VolumeStore> {
  return {
    createSlice: (set, get) => ({
      [VOLUME_FEATURE_KEY]: {
        hasAudio: true,
        level: 1,
        muted: false,
        setMuted: (muted) => {
          const media = get().media.mediaElement
          if (!media) return

          media.muted = muted
          if (!muted) {
            media.volume = media.volume === 0 ? BASE_RESET_VOLUME : media.volume
          }

          set(({ media: mediaState }) => {
            mediaState.idle = false
          })
        },
        setVolume: (volume, progress?, delta?) => {
          const media = get().media.mediaElement
          if (!media) return

          let value: number
          if (typeof delta === "number") {
            value = volume + delta
          } else if (typeof progress === "number") {
            value = progress
          } else {
            value = volume
          }

          if (Number.isNaN(value)) {
            return
          }

          const clampedVolume = clamp(value, 0, 1)
          const muted = clampedVolume === 0

          media.volume = clampedVolume
          media.muted = muted

          set(({ media: mediaState }) => {
            mediaState.idle = false
          })
        },
        toggleMute: () => {
          const media = get().media.mediaElement
          if (!media) return

          media.muted = !media.muted
          if (!media.muted) {
            media.volume = media.volume === 0 ? BASE_RESET_VOLUME : media.volume
          }

          set(({ media: mediaState }) => {
            mediaState.idle = false
          })
        },
      },
    }),
    key: VOLUME_FEATURE_KEY,
    Setup: VolumeSetup,
  }
}

function VolumeSetup() {
  const store = useMediaFeatureApi<VolumeStore>(VOLUME_FEATURE_KEY)
  const events = useMediaEvents<VolumeEvents>()
  const mediaElement = useMediaStore((state) => state.mediaElement)
  const playerInstance = usePlayerStore((state) => state.instance)

  const getHasAudio = React.useCallback(() => {
    if (!playerInstance) {
      return true
    }

    return playerInstance.getAudioTracks().length > 0
  }, [playerInstance])

  React.useEffect(() => {
    if (!mediaElement) return noop

    const media = mediaElement

    const volumeHandler = () => {
      const level = media.volume
      const muted = media.muted

      store.setState(({ volume }) => {
        volume.level = level
        volume.muted = muted
      })

      events.emit("volumechange", { muted, volume: level })
      events.emit("mute", { muted })
    }

    const audioTracksChangedHandler = () => {
      store.setState(({ volume }) => {
        volume.hasAudio = getHasAudio()
      })
    }

    on(media, "volumechange", volumeHandler)
    on(media, "audiotrackschanged", audioTracksChangedHandler)

    volumeHandler()
    audioTracksChangedHandler()

    return () => {
      off(media, "volumechange", volumeHandler)
      off(media, "audiotrackschanged", audioTracksChangedHandler)
    }
  }, [mediaElement, getHasAudio, store])

  return null
}
