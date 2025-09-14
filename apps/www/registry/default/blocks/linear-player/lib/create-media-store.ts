import { create } from "zustand"

import type { PlayerStore } from "@/registry/default/hooks/use-player"
import { createPlayerStore } from "@/registry/default/hooks/use-player"
import type { TimelineStore } from "@/registry/default/hooks/use-timeline"
import { createTimelineStore } from "@/registry/default/hooks/use-timeline"
import type { VolumeStore } from "@/registry/default/hooks/use-volume"
import { createVolumeStore } from "@/registry/default/hooks/use-volume"

export type TypeMediaStore = PlayerStore & VolumeStore & TimelineStore

export interface CreateMediaStoreProps {
  debug?: boolean
}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerStore(...etc),
    ...createVolumeStore(...etc),
    ...createTimelineStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
