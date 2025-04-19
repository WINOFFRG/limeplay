import * as VolumeSlider from "@/registry/default/ui/volume-control";
import { VolumeStateControl } from "@/registry/default/examples/volume-state-control";

export function VolumeSliderControlVertical() {
  return (
    <div className="bg-primary/10 my-4 flex h-fit flex-col items-center gap-1 rounded-md pt-2">
      <VolumeSlider.Root
        className="focus-area -focus-area-x-12 -focus-area-y-2 relative h-16 w-1 cursor-crosshair rounded-md"
        orientation="vertical"
      >
        <VolumeSlider.Track />
        <VolumeSlider.Range />
        <VolumeSlider.Thumb className="size-3" />
      </VolumeSlider.Root>
      <VolumeStateControl />
    </div>
  );
}
