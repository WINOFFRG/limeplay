import { PlaybackStateControl } from "@/registry/default/blocks/linear-player/components/playback-state-control"
import { TimelineSliderControl } from "@/registry/default/blocks/linear-player/components/timeline-slider-control"
import { VolumeSliderControl } from "@/registry/default/blocks/linear-player/components/volume-slider-control"
import { VolumeStateControl } from "@/registry/default/blocks/linear-player/components/volume-state-control"

export function BottomControls() {
  return (
    <div className="absolute inset-x-0 bottom-8 mx-auto flex items-end gap-2 px-[min(80px,10%)]">
      <PlaybackStateControl />
      <div className="me-4 flex gap-1 rounded-md">
        <VolumeStateControl />
        <VolumeSliderControl />
      </div>
      <TimelineSliderControl />
    </div>
  )
}
