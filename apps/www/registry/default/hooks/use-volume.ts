import React from "react"
import clamp from "lodash.clamp"
import { StateCreator } from "zustand"

import { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import { off, on } from "@/registry/default/lib/utils"
import { useGetStore } from "@/registry/default/ui/media-provider"

export function useVolumeStates() {
  const store = useGetStore()

  React.useEffect(() => {
    const mediaElement = store.getState().mediaRef.current

    const volumeHandler = () => {
      store.setState({
        volume: mediaElement.volume,
        muted: mediaElement.muted,
      })
    }

    const audioTracksChangedHandler = () => {
      const player = store.getState().player

      if (player) {
        const hasAudioTracks = player.getAudioTracks().length > 0

        store.setState({
          hasAudio: hasAudioTracks,
        })
      }
    }

    on(mediaElement, "volumechange", volumeHandler)
    on(mediaElement, "audiotrackschanged", audioTracksChangedHandler)

    return () => {
      off(mediaElement, "volumechange", volumeHandler)
      off(mediaElement, "audiotrackschanged", audioTracksChangedHandler)
    }
  }, [store])
}

export interface VolumeStore {
  volume: number
  muted: boolean
  hasAudio: boolean
}

const BASE_RESET_VOLUME = 0.05

export const createVolumeStore: StateCreator<
  VolumeStore & PlayerRootStore,
  [],
  [],
  VolumeStore
> = () => ({
  volume: 1,
  muted: false,
  hasAudio: true,
})

export function useVolume() {
  const store = useGetStore()

  function setVolume(volume: number, progress = 0, delta = 0) {
    const value = typeof delta === "number" ? volume + delta : progress

    if (value === undefined || Number.isNaN(value)) {
      return
    }

    const clampedVolume = clamp(value, 0, 1)
    const muted = clampedVolume === 0

    const media = store.getState().mediaRef.current
    media.volume = clampedVolume
    media.muted = muted

    store.setState({
      idle: false,
    })
  }

  function toggleMute() {
    const media = store.getState().mediaRef.current

    media.muted = !media.muted
    // DEV: Volume 0 and muted are equivalent, to prevent collision in UI
    // set to some small value to prevent stuck toggling state of UI.
    if (!media.muted) {
      media.volume = media.volume === 0 ? BASE_RESET_VOLUME : media.volume
    }

    store.setState({
      idle: false,
    })
  }

  function setMuted(muted: boolean) {
    const media = store.getState().mediaRef.current

    media.muted = muted
    media.volume = muted ? BASE_RESET_VOLUME : media.volume

    store.setState({
      idle: false,
    })
  }

  return {
    setVolume,
    toggleMute,
    setMuted,
  }
}
