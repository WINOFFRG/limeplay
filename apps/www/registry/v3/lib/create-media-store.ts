import { create } from "zustand"

import type { PlaybackStore } from "@/registry/v3/hooks/use-playback"
import type { VolumeStore } from "@/registry/v3/hooks/use-volume"

import { createPlaybackStore } from "@/registry/v3/hooks/use-playback"
import { createVolumeStore } from "@/registry/v3/hooks/use-volume"

export interface CreateMediaStoreProps {
  debug?: boolean
}

export type TypeMediaStore = PlaybackStore & VolumeStore

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlaybackStore(...etc),
    ...createVolumeStore(...etc),
    ...initProps,
  }))

  return mediaStore
}
