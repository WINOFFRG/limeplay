import { create } from "zustand"

import type { PlayerStore } from "@/registry/default/hooks/use-player"
import { createPlayerStore } from "@/registry/default/hooks/use-player"

export type TypeMediaStore = PlayerStore & {}

export interface CreateMediaStoreProps {
  debug?: boolean
}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
