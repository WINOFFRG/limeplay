import { VolumeSliderControl } from "@/registry/default/blocks/linear-player/components/volume-slider-control"
import { VolumeStateControl } from "@/registry/default/blocks/linear-player/components/volume-state-control"

export function VolumeControl() {
  return (
    <div
      className={`
        group me-2 flex min-w-22 items-center gap-2 rounded-md pe-2 transition-all duration-300 ease-in-out
        hover:bg-primary/10
        focus-visible:bg-primary/10 focus-visible:ring-primary/50
      `}
    >
      <VolumeStateControl />
      <VolumeSliderControl />
    </div>
  )
}
