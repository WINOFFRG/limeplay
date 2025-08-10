import { PlaybackStateControl } from "@/registry/default/blocks/linear-player/components/playback-state-control"
import { TimelineSliderControl } from "@/registry/default/blocks/linear-player/components/timeline-slider-control"
import { VolumeSliderControl } from "@/registry/default/blocks/linear-player/components/volume-slider-control"
import { VolumeStateControl } from "@/registry/default/blocks/linear-player/components/volume-state-control"

export function BottomControls() {
  return (
    <div
      className={`
        pointer-events-auto absolute inset-x-0 bottom-8 mx-auto flex items-end gap-2 px-[min(80px,10%)] transition-all duration-300 ease-out-quad
        group-data-[idle=false]/root:translate-y-0 group-data-[idle=false]/root:opacity-100
        group-data-[idle=true]/root:translate-y-4 group-data-[idle=true]/root:opacity-0
        group-data-[status=buffering]/root:translate-y-0 group-data-[status=buffering]/root:opacity-100
        group-data-[status=paused]/root:translate-y-0 group-data-[status=paused]/root:opacity-100
      `}
    >
      <PlaybackStateControl />
      <div
        className={`
          group me-2 flex min-w-22 items-center gap-2 rounded-md pe-2 transition-all duration-300 ease-in-out
          hover:bg-primary/10 hover:backdrop-blur-md
          focus-visible:bg-primary/10 focus-visible:ring-primary/50
        `}
      >
        <VolumeStateControl />
        <VolumeSliderControl />
      </div>
      <TimelineSliderControl />
    </div>
  )
}
