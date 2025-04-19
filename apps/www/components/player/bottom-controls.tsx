import { PlaybackStateControl } from "@/components/player/playback-state-control";
import { VolumeSliderControlHorizontal } from "@/components/player/volume-slider-control";
import { VolumeStateControl } from "@/components/player/volume-state-control";
import { TimelineSliderControl } from "@/components/player/timeline-slider-control";

export function BottomControls() {
  return (
    <div
      id="controls_container"
      className="absolute inset-x-0 bottom-8 mx-auto flex items-end gap-2 px-[min(80px,10%)]"
    >
      <PlaybackStateControl />
      <div className="bg-secondary/10 flex h-fit flex-row gap-1 rounded-md pe-4">
        <VolumeStateControl />
        <VolumeSliderControlHorizontal />
      </div>
      <TimelineSliderControl />
    </div>
  );
}
