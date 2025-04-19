import { create } from "zustand"

import {
  MediaStateStore,
  createMediaStateStore,
} from "@/registry/default/hooks/use-media-state-store"
import {
  PlayerRootStore,
  createPlayerRootStore,
} from "@/registry/default/hooks/use-player-root-store"
import {
  TimelineStore,
  createTimelineStore,
} from "@/registry/default/hooks/use-timeline-store"
import {
  VolumeStore,
  createVolumeStore,
} from "@/registry/default/hooks/use-volume-store"

export type TypeMediaStore = PlayerRootStore &
  VolumeStore &
  MediaStateStore &
  TimelineStore & {}

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
