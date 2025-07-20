import { PlaybackStateControl } from "@/components/player/playback-state-control"
import { TimelineSliderControl } from "@/components/player/timeline-slider-control"
import { VolumeSliderControl } from "@/components/player/volume-slider-control"
import { VolumeStateControl } from "@/components/player/volume-state-control"

export function BottomControls() {
  return (
    <div className="absolute inset-x-0 bottom-8 mx-auto flex items-end gap-2 px-[min(80px,10%)]">
      <PlaybackStateControl />
      <div className="flex gap-1 rounded-md me-4">
        <VolumeStateControl />
        <VolumeSliderControl />
      </div>
      <TimelineSliderControl />
    </div>
  )
}
