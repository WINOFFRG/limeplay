import { create } from "zustand"

import type { PlaybackStore } from "@/registry/default/hooks/use-playback"
import type { PlayerStore } from "@/registry/default/hooks/use-player"

import { createPlaybackStore } from "@/registry/default/hooks/use-playback"
import { createPlayerStore } from "@/registry/default/hooks/use-player"

export interface CreateMediaStoreProps {
  debug?: boolean
}

export type TypeMediaStore = PlaybackStore & PlayerStore & {}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlaybackStore(...etc),
    ...createPlayerStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
