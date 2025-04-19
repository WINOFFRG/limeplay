import * as VolumeSlider from "@/registry/default/ui/volume-control"

export function VolumeSliderControlHorizontal() {
  return (
    <div className="flex min-w-10 grow items-center">
      <VolumeSlider.Root
        className="focus-area -focus-area-x-2 -focus-area-y-12 relative h-1 grow cursor-crosshair rounded-md"
        orientation="horizontal"
      >
        <VolumeSlider.Track />
        <VolumeSlider.Range />
        <VolumeSlider.Thumb />
      </VolumeSlider.Root>
    </div>
  )
}
