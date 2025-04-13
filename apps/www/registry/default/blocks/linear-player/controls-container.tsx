import { PlaybackStateControl } from "@/registry/default/blocks/linear-player/playback-state-control";
import { VolumeSliderControlHorizontal } from "@/registry/default/blocks/linear-player/volume-slider-control";
import { VolumeStateControl } from "@/registry/default/blocks/linear-player/volume-state-control";

export function ControlsContainer() {
  return (
    <div
      id="controls_wrapper"
      className="z-100 absolute inset-0 isolate contain-strict"
    >
      <div
        id="controls_container"
        className="absolute inset-x-0 bottom-8 flex max-w-6xl items-end gap-2 px-[min(80px,10%)]"
      >
        <PlaybackStateControl />
        <div className="flex h-fit flex-row gap-1 rounded-md bg-white/10 pe-4">
          <VolumeStateControl />
          <VolumeSliderControlHorizontal />
        </div>
      </div>
    </div>
  );
}
