import * as VolumeSlider from "@/registry/default/ui/volume-control";

export function VolumeSliderControl() {
  return (
    // For now max-w- later make to min-w and rely on flex grow
    <div className="flex min-w-8 grow items-center">
      <VolumeSlider.Root
        className="focus-area -focus-area-x-2 -focus-area-y-12 relative h-1 grow cursor-crosshair rounded-md bg-white/10"
        orientation="horizontal"
      >
        <VolumeSlider.Track />
        <VolumeSlider.Range />
        <VolumeSlider.Thumb />
      </VolumeSlider.Root>
    </div>
  );
}
