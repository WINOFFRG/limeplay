import { create } from "zustand"

import {
  createPlayerRootStore,
  PlayerRootStore,
} from "@/registry/default/hooks/use-player-root-store"

export type TypeMediaStore = PlayerRootStore & {}

export interface CreateMediaStoreProps {
  debug?: boolean
}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerRootStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
