import { useTimelineStates } from "@/registry/default/hooks/use-timeline-states"
import * as TimelineSlider from "@/registry/default/ui/timeline-control"

export function TimelineSliderControl() {
  useTimelineStates()

  return (
    <div className="my-auto w-full">
      <TimelineSlider.Root
        className="focus-area -focus-area-x-2 -focus-area-y-12 h-1 w-full grow cursor-crosshair rounded-md"
        orientation="horizontal"
      >
        <TimelineSlider.Track />
        <TimelineSlider.Range />
        {/* <TimelineSlider.Thumb /> */}
      </TimelineSlider.Root>
    </div>
  )
}
