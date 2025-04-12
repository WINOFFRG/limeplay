import { StateCreator } from "zustand"

import { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"

export interface MediaStateStore {
  paused: boolean
  setPaused: (paused: boolean) => void
  togglePaused: () => void
  ended: boolean
  setEnded: (ended: boolean) => void
  loop: boolean
  setLoop: (loop: boolean) => void
}

export const createMediaStateStore: StateCreator<
  MediaStateStore & PlayerRootStore,
  [],
  [],
  MediaStateStore
> = (set, get) => ({
  paused: false,
  setPaused: (paused: boolean) => {
    const _status = get().status
    if (paused) {
      set({
        paused: true,
        status: _status === "playing" ? "paused" : _status,
        idle: false,
      })
    } else {
      set({
        paused: false,
        status: ["buffering", "error", "ended", "stopped"].includes(_status)
          ? "playing"
          : _status,
      })
    }
  },
  togglePaused: () => {
    const _status = get().status
    let newStatus = _status

    if (["ended", "stopped", "paused", "error"].includes(_status)) {
      newStatus = "playing"
    } else if (_status === "playing") {
      newStatus = "paused"
    }
    set({
      status: newStatus,
    })
  },
  ended: false,
  setEnded: (ended: boolean) => set({ ended }),
  loop: false,
  setLoop: (loop: boolean) => set({ loop }),
})
