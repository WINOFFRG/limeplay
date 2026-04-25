"use client"

import type { StateCreator } from "zustand"

import clamp from "lodash.clamp"
import React from "react"

import type { PlaybackStore } from "@/registry/v3/hooks/use-playback"
import type { PlayerEventSlice } from "@/registry/v3/hooks/use-player-events"

import { usePlayerEvents } from "@/registry/v3/hooks/use-player-events"
import { useGetStore, useMediaStore } from "@/registry/v3/ui/media-provider"

export interface VolumeEvents {
  mutechange: { muted: boolean }
  volumechange: { muted: boolean; volume: number }
}

export interface VolumeStore extends PlayerEventSlice<VolumeEvents> {
  hasAudio: boolean
  muted: boolean
  volume: number
}

export const createVolumeStore: StateCreator<
  PlaybackStore & VolumeStore,
  [],
  [],
  VolumeStore
> = () => ({
  hasAudio: true,
  muted: false,
  volume: 1,
})

export function useVolumeStates() {
  const store = useGetStore()
  const events = usePlayerEvents()
  const mediaRef = useMediaStore((state) => state.mediaRef)

  React.useEffect(() => {
    const media = mediaRef.current

    if (!media) {
      return
    }

    const syncFromMedia = (options?: { emit?: boolean }) => {
      const previousMuted = store.getState().muted
      const muted = media.muted
      const volume = media.volume

      store.setState({ muted, volume })

      if (!options?.emit) {
        return
      }

      events.emit("volumechange", { muted, volume })

      if (muted !== previousMuted) {
        events.emit("mutechange", { muted })
      }
    }

    const volumeHandler = () => syncFromMedia({ emit: true })

    syncFromMedia()
    media.addEventListener("volumechange", volumeHandler)

    return () => {
      media.removeEventListener("volumechange", volumeHandler)
    }
  }, [store, events, mediaRef])
}

const BASE_RESET_VOLUME = 0.05

export function useVolume() {
  const store = useGetStore()

  function setVolume(volume: number) {
    const media = store.getState().mediaRef.current
    if (!media) return

    const clampedVolume = clamp(volume, 0, 1)

    media.volume = clampedVolume
    media.muted = clampedVolume === 0
    store.setState({ idle: false })
  }

  function toggleMute() {
    const media = store.getState().mediaRef.current
    if (!media) return

    media.muted = !media.muted

    if (!media.muted && media.volume === 0) {
      media.volume = BASE_RESET_VOLUME
    }

    store.setState({ idle: false })
  }

  return {
    setVolume,
    toggleMute,
  }
}
