import { cn } from "@/lib/utils"
import {
  HorizontalVolumeSliderControl,
  VerticalVolumeSliderControl,
} from "@/registry/default/blocks/video-player/components/volume-slider-control"
import { VolumeStateControl } from "@/registry/default/blocks/video-player/components/volume-state-control"

export function VolumeGroupControl() {
  return (
    <div
      className={cn(`
        group relative isolate me-2 flex min-w-24 flex-row items-center gap-1.5 rounded-md pe-3 transition-all duration-300 ease-in-out
        @3xl/root:me-0 @3xl/root:min-w-0 @3xl/root:flex-col-reverse @3xl/root:gap-1 @3xl/root:pe-0
      `)}
    >
      <div
        aria-hidden
        className={cn(`
          pointer-events-none absolute inset-0 z-0 rounded-md opacity-0 transition-opacity duration-300 ease-in-out
          group-focus-within:bg-foreground/10 group-focus-within:opacity-100
          group-hover:bg-foreground/10 group-hover:opacity-100
          @3xl/root:-top-22
        `)}
      />
      <div className="relative z-10">
        <VolumeStateControl />
      </div>
      <HorizontalVolumeSliderControl />
      <VerticalVolumeSliderControl />
    </div>
  )
}
