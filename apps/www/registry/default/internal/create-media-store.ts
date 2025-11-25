import { create } from "zustand";
import type { CaptionsStore } from "@/registry/default/hooks/use-captions";
import { createCaptionsStore } from "@/registry/default/hooks/use-captions";
import type { PlaybackRateStore } from "@/registry/default/hooks/use-playback-rate";
import { createPlaybackRateStore } from "@/registry/default/hooks/use-playback-rate";
import type { PlayerStore } from "@/registry/default/hooks/use-player";
import { createPlayerStore } from "@/registry/default/hooks/use-player";
import type { TimelineStore } from "@/registry/default/hooks/use-timeline";
import { createTimelineStore } from "@/registry/default/hooks/use-timeline";
import type { VolumeStore } from "@/registry/default/hooks/use-volume";
import { createVolumeStore } from "@/registry/default/hooks/use-volume";

export type TypeMediaStore = PlayerStore &
  VolumeStore &
  TimelineStore &
  CaptionsStore &
  PlaybackRateStore;

export type CreateMediaStoreProps = {
  debug?: boolean;
};

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerStore(...etc),
    ...createVolumeStore(...etc),
    ...createTimelineStore(...etc),
    ...createCaptionsStore(...etc),
    ...createPlaybackRateStore(...etc),
    ...initProps,
  }));
  return mediaStore;
}
