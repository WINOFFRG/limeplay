import { VolumeStateControl } from "@/registry/default/examples/volume-state-control"
import * as VolumeSlider from "@/registry/default/ui/volume-control"

export function VolumeSliderControlHorizontal() {
  return (
    <div className="bg-primary/10 my-4 flex h-fit flex-row items-center gap-1 rounded-md pe-2">
      <VolumeStateControl />
      <VolumeSlider.Root
        className="focus-area -focus-area-x-12 -focus-area-y-2 relative h-1 w-16 cursor-crosshair rounded-md"
        orientation="horizontal"
      >
        <VolumeSlider.Track />
        <VolumeSlider.Range />
        <VolumeSlider.Thumb className="size-3" />
      </VolumeSlider.Root>
    </div>
  )
}
