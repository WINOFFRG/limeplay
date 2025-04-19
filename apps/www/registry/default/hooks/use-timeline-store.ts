import clamp from "lodash.clamp"
import { StateCreator } from "zustand"

import { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import { toFixedNumber } from "@/registry/default/lib/utils"

export interface SeekToProps {
  progress?: number
}

export interface TimelineStore {
  duration: number
  setDuration: (value: number) => void
  currentTime: number
  setCurrentTime: (value: number) => void
  progress: number
  seekTo: ({ progress }: SeekToProps) => void
}

export const createTimelineStore: StateCreator<
  TimelineStore & PlayerRootStore,
  [],
  [],
  TimelineStore
> = (set, get) => ({
  duration: 0,
  setDuration: (value) => {
    set({ duration: value })
  },
  currentTime: 0,
  setCurrentTime: (value) => {
    const _currentTime = clamp(value, 0, get().duration)
    const _progress = toFixedNumber(get().currentTime / get().duration, 4)
    set({ currentTime: _currentTime, progress: _progress })
  },
  progress: 0,
  seekTo: ({ progress }) => {
    if (progress) {
      const newTime = progress * get().duration
      get().setCurrentTime(newTime)

      const mediaElement = get().mediaRef?.current

      mediaElement.currentTime = get().currentTime
    }
  },
})
