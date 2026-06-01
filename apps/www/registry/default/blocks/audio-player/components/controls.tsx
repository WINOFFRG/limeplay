import { ActionControls } from "@/registry/default/blocks/audio-player/components/action-controls"
import { TimeLabels } from "@/registry/default/blocks/audio-player/components/fixed-timeline-control"
import { PlaybackControls } from "@/registry/default/blocks/audio-player/components/playback-controls"
import {
  RepeatControl,
  ShuffleControl,
} from "@/registry/default/blocks/audio-player/components/playback-mode-controls"
import { Playlist } from "@/registry/default/blocks/audio-player/components/playlist"
import { TrackInfo } from "@/registry/default/blocks/audio-player/components/track-info"
import { VolumeControl } from "@/registry/default/blocks/audio-player/components/volume-group-control"

export function PlayerControls() {
  return (
    <div className="grid h-full grid-cols-3 items-center px-4">
      <div className="flex items-center justify-start gap-4">
        <PlaybackControls />
        <TimeLabels />
      </div>
      <div className="flex items-center justify-center gap-2">
        <TrackInfo />
        <ActionControls />
      </div>
      <div className="flex items-center justify-end gap-2">
        <VolumeControl />
        <RepeatControl />
        <ShuffleControl />
        <Playlist />
      </div>
    </div>
  )
}
