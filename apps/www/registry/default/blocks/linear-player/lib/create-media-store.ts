import { create } from "zustand"

import type { CaptionsStore } from "@/registry/default/hooks/use-captions"
import type { PlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"
import type { PlayerStore } from "@/registry/default/hooks/use-player"
import type { TimelineStore } from "@/registry/default/hooks/use-timeline"
import type { VolumeStore } from "@/registry/default/hooks/use-volume"

import { createCaptionsStore } from "@/registry/default/hooks/use-captions"
import { createPlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"
import { createPlayerStore } from "@/registry/default/hooks/use-player"
import { createTimelineStore } from "@/registry/default/hooks/use-timeline"
import { createVolumeStore } from "@/registry/default/hooks/use-volume"

export interface CreateMediaStoreProps {
  debug?: boolean
}

export type TypeMediaStore = CaptionsStore &
  PlaybackRateStore &
  PlayerStore &
  TimelineStore &
  VolumeStore

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerStore(...etc),
    ...createVolumeStore(...etc),
    ...createTimelineStore(...etc),
    ...createCaptionsStore(...etc),
    ...createPlaybackRateStore(...etc),

    ...initProps,
  }))
  return mediaStore
}
