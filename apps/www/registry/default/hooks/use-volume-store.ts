import clamp from "lodash.clamp"
import { StateCreator } from "zustand"

import { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"

export interface VolumeStore {
  volume: number
  setVolume: (volume: number, progress?: number, delta?: number) => void
  muted: boolean
  setMuted: (muted: boolean) => void
  toggleMute: () => void
  hasAudio: boolean
  setHasAudio: (hasAudio: boolean) => void
}

const BASE_RESET_VOLUME = 0.05

export const createVolumeStore: StateCreator<
  VolumeStore & PlayerRootStore,
  [],
  [],
  VolumeStore
> = (set) => ({
  volume: 1,
  muted: false,
  setMuted: (muted: boolean) => set({ muted }),
  toggleMute: () =>
    set((state) => ({
      muted: !state.muted,
      // DEV: Volume 0 and muted are equivalent, to prevent collision in UI
      // set to some small value to prevent stuck toggling state of UI.
      volume: state.volume === 0 ? BASE_RESET_VOLUME : state.volume,
      idle: false,
    })),
  setVolume: (volume: number, delta = 0, progress?: number) => {
    // DEV: Fix the self calling issue in case of delta useVolumeState listens
    // to the new updated value of volume and increases the volume until reaches
    // to 1
    const value = typeof delta === "number" ? volume + delta : progress

    if (value === undefined || Number.isNaN(value)) {
      return
    }

    const _volume = clamp(value, 0, 1)
    const _muted = _volume === 0

    set({ volume: _volume, muted: _muted })
  },
  hasAudio: true,
  setHasAudio: (hasAudio) => {
    set({ hasAudio: hasAudio })
  },
})
