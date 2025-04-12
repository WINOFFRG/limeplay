import { create } from "zustand"

import {
  createPlayerRootStore,
  PlayerRootStore,
} from "@/registry/default/hooks/use-player-root-store"
import {
  createVolumeStore,
  VolumeStore,
} from "@/registry/default/hooks/use-volume-store"

import {
  createMediaStateStore,
  MediaStateStore,
} from "../hooks/use-media-state-store"

export type TypeMediaStore = PlayerRootStore &
  VolumeStore &
  MediaStateStore & {}

export interface CreateMediaStoreProps {}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerRootStore(...etc),
    ...createVolumeStore(...etc),
    ...createMediaStateStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
