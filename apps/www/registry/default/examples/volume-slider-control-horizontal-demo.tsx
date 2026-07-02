import { VolumeStateControlDemo } from "@/registry/default/examples/volume-state-control-demo"
import * as VolumeSlider from "@/registry/default/ui/volume-control"

export function VolumeSliderControlHorizontalDemo() {
  return (
    <div className="my-4 flex h-fit flex-row items-center gap-1 rounded-md border pe-3">
      <VolumeStateControlDemo />
      <VolumeSlider.Root
        className="hit-area-x-[12px] hit-area-y-[2px] relative h-1 w-16 cursor-crosshair rounded-md"
        orientation="horizontal"
      >
        <VolumeSlider.Track>
          <VolumeSlider.Progress />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="size-2" />
      </VolumeSlider.Root>
    </div>
  )
}
