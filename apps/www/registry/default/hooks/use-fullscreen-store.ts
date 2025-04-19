import { StateCreator } from "zustand"

import { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"

export interface FullscreenStore {
  fullscreen: boolean
}

export const createFullscreenStore: StateCreator<
  FullscreenStore & PlayerRootStore,
  [],
  [],
  FullscreenStore
> = (set, get) => ({
  fullscreen: false,
})
