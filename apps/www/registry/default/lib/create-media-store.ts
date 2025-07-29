import { create } from "zustand"

import type { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import { createPlayerRootStore } from "@/registry/default/hooks/use-player-root-store"

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
