import { cn } from "@/lib/utils"
import * as VolumeSlider from "@/registry/default/ui/volume-control"

export function HorizontalVolumeSliderControl() {
  return (
    <VolumeSliderControlRoot
      className="
        hit-area-x-[12px] hit-area-y-[2px] relative h-1 w-14 opacity-100
        @3xl/root:hidden
      "
      orientation="horizontal"
    />
  )
}

export function VerticalVolumeSliderControl() {
  return (
    <VolumeSliderControlRoot
      className="
        hit-area-x-[8px] hit-area-y-[12px] absolute bottom-full left-1/2 mb-2 hidden h-16 w-1 -translate-x-1/2 pb-1 opacity-0
        @3xl/root:flex
        @3xl/root:group-focus-within:opacity-100
        @3xl/root:group-hover:opacity-100
      "
      orientation="vertical"
    />
  )
}

function VolumeSliderControlRoot({
  className,
  orientation,
}: {
  className?: string
  orientation: "horizontal" | "vertical"
}) {
  return (
    <VolumeSlider.Root
      className={cn(
        `hit-area z-10 cursor-crosshair rounded-md transition-opacity duration-300 ease-in-out`,
        className
      )}
      orientation={orientation}
    >
      <VolumeSlider.Track>
        <VolumeSlider.Progress />
      </VolumeSlider.Track>
      <VolumeSlider.Thumb className="size-2.5" />
    </VolumeSlider.Root>
  )
}
