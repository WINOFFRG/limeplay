import { PlaybackStateControl } from "@/registry/default/examples/playback-state-control";
import { VolumeSliderControl } from "@/registry/default/examples/volume-slider-control";
import { VolumeStateControl } from "@/registry/default/examples/volume-state-control";

export function ControlsContainer() {
  return (
    <div
      id="controls_wrapper"
      className="z-100 absolute inset-0 isolate contain-strict"
    >
      {/* <div
        id="scrim_container"
        className="absolute inset-0 bg-black/30 bg-[linear-gradient(to_top,_rgba(0,0,0,0.3)_0,transparent_120px)]"
      /> */}
      <div
        id="controls_container"
        className="absolute inset-x-0 bottom-8 flex max-w-6xl gap-2 px-[min(80px,10%)]"
      >
        <PlaybackStateControl />
        <div className="relative flex flex-row gap-1 rounded-md pe-4 hover:bg-white/10">
          <VolumeStateControl />
          <VolumeSliderControl />
        </div>
      </div>
    </div>
  );
}
