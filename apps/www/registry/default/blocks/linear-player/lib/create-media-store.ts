import { create } from "zustand"

import type { CaptionsStore } from "@/registry/default/hooks/use-captions"
import type { PlaybackStore } from "@/registry/default/hooks/use-playback"
import type { PlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"
import type { TimelineStore } from "@/registry/default/hooks/use-timeline"
import type { VolumeStore } from "@/registry/default/hooks/use-volume"

import { createCaptionsStore } from "@/registry/default/hooks/use-captions"
import { createPlaybackStore } from "@/registry/default/hooks/use-playback"
import { createPlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"
import {
  createPlayerStore,
  type PlayerStore,
} from "@/registry/default/hooks/use-player"
import { createTimelineStore } from "@/registry/default/hooks/use-timeline"
import { createVolumeStore } from "@/registry/default/hooks/use-volume"

export interface CreateMediaStoreProps {
  debug?: boolean
}

export type TypeMediaStore = CaptionsStore &
  PlaybackRateStore &
  PlaybackStore &
  PlayerStore &
  TimelineStore &
  VolumeStore

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlaybackStore(...etc),
    ...createPlayerStore(...etc),
    ...createVolumeStore(...etc),
    ...createTimelineStore(...etc),
    ...createCaptionsStore(...etc),
    ...createPlaybackRateStore(...etc),

    ...initProps,
  }))
  return mediaStore
}
