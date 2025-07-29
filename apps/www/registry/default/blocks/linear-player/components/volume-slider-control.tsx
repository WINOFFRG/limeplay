import * as VolumeSlider from "@/registry/default/ui/volume-control"

export function VolumeSliderControl() {
  return (
    <div className="flex min-w-10 grow items-center">
      <VolumeSlider.Root
        className="focus-area relative h-1 grow cursor-crosshair rounded-md -focus-area-x-2 -focus-area-y-12"
        orientation="horizontal"
      >
        <VolumeSlider.Track>
          <VolumeSlider.Progress />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb />
      </VolumeSlider.Root>
    </div>
  )
}
