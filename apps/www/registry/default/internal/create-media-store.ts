import { create } from "zustand"

import {
  createMediaStateStore,
  MediaStateStore,
} from "@/registry/default/hooks/use-media-state"
import {
  createPlayerRootStore,
  PlayerRootStore,
} from "@/registry/default/hooks/use-player-root-store"
import {
  createTimelineStore,
  TimelineStore,
} from "@/registry/default/hooks/use-timeline"
import {
  createVolumeStore,
  VolumeStore,
} from "@/registry/default/hooks/use-volume"

export type TypeMediaStore = PlayerRootStore &
  VolumeStore &
  MediaStateStore &
  TimelineStore
// & {}

export interface CreateMediaStoreProps {
  debug?: boolean
}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerRootStore(...etc),
    ...createVolumeStore(...etc),
    ...createMediaStateStore(...etc),
    ...createTimelineStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
