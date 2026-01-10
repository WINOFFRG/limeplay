"use client"

import type { StateCreator } from "zustand"

import { useEffect } from "react"

import { type PlaybackStore } from "@/registry/default/hooks/use-playback"
import { off, on } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export interface PlaybackRateStore {
  onRateChange?: (payload: { rate: number }) => void
  playbackRate: number

  playbackRates: number[]
}

export function usePlaybackRateStates() {
  const store = useGetStore()
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const canPlay = useMediaStore((state) => state.canPlay)

  const onPlaybackRateChange = () => {
    if (!player) return

    const rate = player.getPlaybackRate()
    const normalizedRate = rate === 0 ? 1 : rate

    store.setState({
      playbackRate: normalizedRate,
    })

    store.getState().onRateChange?.({ rate: normalizedRate })
  }

  useEffect(() => {
    if (!mediaRef.current || !player) return

    const media = mediaRef.current

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
  }, [player, mediaRef, canPlay])
}

export const createPlaybackRateStore: StateCreator<
  PlaybackRateStore & PlaybackStore,
  [],
  [],
  PlaybackRateStore
> = () => ({
  onRateChange: undefined,
  playbackRate: 1,

  playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
})

export interface UsePlaybackRateReturn {
  setPlaybackRate: (playbackRate: number) => void
  setTrickplayRate: (playbackRate: number, forced?: boolean) => void
}

export function usePlaybackRate(): UsePlaybackRateReturn {
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const player = useMediaStore((state) => state.player)

  function setPlaybackRate(playbackRate: number) {
    if (!mediaRef.current) return

    const media = mediaRef.current
    media.playbackRate = playbackRate
  }

  function setTrickplayRate(playbackRate: number, forced: boolean = false) {
    if (!player) return

    player.trickPlay(playbackRate, forced)
  }

  return {
    setPlaybackRate,
    setTrickplayRate,
  }
}
