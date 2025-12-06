import { create } from "zustand"

import type { PlayerStore } from "@/registry/default/hooks/use-player"

import { createPlayerStore } from "@/registry/default/hooks/use-player"

export interface CreateMediaStoreProps {
  debug?: boolean
}

export type TypeMediaStore = PlayerStore & {}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
