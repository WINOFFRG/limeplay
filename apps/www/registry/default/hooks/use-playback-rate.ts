"use client"

import { useEffect } from "react"

import type {
  MediaEventSlice,
  MediaFeature,
  MediaStore,
} from "@/registry/default/ui/media-provider"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import {
  usePlaybackStore,
} from "@/registry/default/hooks/use-playback"
import {
  type PlayerStore,
  usePlayerStore,
} from "@/registry/default/hooks/use-player"
import { off, on } from "@/registry/default/lib/utils"
import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/registry/default/ui/media-provider"

export const PLAYBACK_RATE_FEATURE_KEY = "playbackRate"

export interface PlaybackRateEvents {
  ratechange: { rate: number }
}

export interface PlaybackRateStore extends MediaEventSlice<PlaybackRateEvents> {
  [PLAYBACK_RATE_FEATURE_KEY]: {
    rates: number[]
    setPlaybackRate: (playbackRate: number) => void
    setTrickplayRate: (playbackRate: number, forced?: boolean) => void
    value: number
  }
}

export function playbackRateFeature(): MediaFeature<
  PlaybackRateStore,
  MediaStore & PlaybackRateStore & PlayerStore
> {
  return {
    createSlice: (_set, get) => ({
      [PLAYBACK_RATE_FEATURE_KEY]: {
        rates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        setPlaybackRate: (playbackRate) => {
          const media = get().media.mediaElement
          if (!media) return

          media.playbackRate = playbackRate
        },
        setTrickplayRate: (playbackRate, forced = false) => {
          const player = get().player.instance
          if (!player) return

          player.trickPlay(playbackRate, forced)
        },
        value: 1,
      },
    }),
    key: PLAYBACK_RATE_FEATURE_KEY,
    Setup: PlaybackRateSetup,
  }
}

export function usePlaybackRateStore<TSelected>(
  selector: (state: PlaybackRateStore["playbackRate"]) => TSelected
): TSelected {
  return useMediaFeatureStore<PlaybackRateStore, TSelected>(
    PLAYBACK_RATE_FEATURE_KEY,
    (state) => selector(state.playbackRate)
  )
}

function PlaybackRateSetup() {
  const store = useMediaFeatureApi<PlaybackRateStore>(PLAYBACK_RATE_FEATURE_KEY)
  const events = useMediaEvents<PlaybackRateEvents>()
  const player = usePlayerStore((state) => state.instance)
  const mediaElement = useMediaStore((state) => state.mediaElement)
  const canPlay = usePlaybackStore((state) => state.canPlay)

  const onPlaybackRateChange = () => {
    if (!player) return

    const rate = player.getPlaybackRate()
    const normalizedRate = rate === 0 ? 1 : rate

    store.setState(({ playbackRate }) => {
      playbackRate.value = normalizedRate
    })

    events.emit("ratechange", { rate: normalizedRate })
  }

  useEffect(() => {
    if (!mediaElement || !player) return

    const media = mediaElement

    if (canPlay) {
      onPlaybackRateChange()
    }

    on(player, "loading", onPlaybackRateChange)
    on(player, "ratechange", onPlaybackRateChange)
    on(media, "ratechange", onPlaybackRateChange)

    return () => {
      off(player, "loading", onPlaybackRateChange)
      off(player, "ratechange", onPlaybackRateChange)
      off(media, "ratechange", onPlaybackRateChange)
    }
  }, [canPlay, mediaElement, player])

  return null
}
