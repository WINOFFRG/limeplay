import { VolumeStateControlDemo } from "@/registry/default/examples/volume-state-control-demo"
import * as VolumeSlider from "@/registry/default/ui/volume-control"

export function VolumeSliderControlHorizontalDemo() {
  return (
    <div className="my-4 flex h-fit flex-row items-center gap-1 rounded-md bg-primary/10 pe-3">
      <VolumeStateControlDemo />
      <VolumeSlider.Root
        className={`focus-area relative h-1 w-16 cursor-crosshair rounded-md -focus-area-x-12 -focus-area-y-2`}
        orientation="horizontal"
      >
        <VolumeSlider.Track>
          <VolumeSlider.Progress />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="size-3" />
      </VolumeSlider.Root>
    </div>
  )
}
