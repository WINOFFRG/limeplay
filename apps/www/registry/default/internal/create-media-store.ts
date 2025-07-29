import { create } from "zustand"

import type { MediaStateStore } from "@/registry/default/hooks/use-media-state"
import { createMediaStateStore } from "@/registry/default/hooks/use-media-state"
import type { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import { createPlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import type { TimelineStore } from "@/registry/default/hooks/use-timeline"
import { createTimelineStore } from "@/registry/default/hooks/use-timeline"
import type { VolumeStore } from "@/registry/default/hooks/use-volume"
import { createVolumeStore } from "@/registry/default/hooks/use-volume"

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
