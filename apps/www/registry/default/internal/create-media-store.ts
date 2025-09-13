import { create } from "zustand"

import { createCaptionsStore } from "@/registry/default/hooks/use-captions"
import type { CaptionsStore } from "@/registry/default/hooks/use-captions"
import type { PlayerStore } from "@/registry/default/hooks/use-player"
import { createPlayerStore } from "@/registry/default/hooks/use-player"
import type { TimelineStore } from "@/registry/default/hooks/use-timeline"
import { createTimelineStore } from "@/registry/default/hooks/use-timeline"
import type { VolumeStore } from "@/registry/default/hooks/use-volume"
import { createVolumeStore } from "@/registry/default/hooks/use-volume"

export type TypeMediaStore = PlayerStore &
  VolumeStore &
  TimelineStore &
  CaptionsStore

export interface CreateMediaStoreProps {
  debug?: boolean
}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerStore(...etc),
    ...createVolumeStore(...etc),
    ...createTimelineStore(...etc),
    ...createCaptionsStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
