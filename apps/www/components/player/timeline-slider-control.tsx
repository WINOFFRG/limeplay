import { useState } from "react"

import { useTimelineStates } from "@/registry/default/hooks/use-timeline"
import {
  Duration,
  Elapsed,
  Remaining,
} from "@/registry/default/ui/timeline-labels"
import * as TimelineSlider from "@/registry/default/ui/timeline-slider"

import { Button } from "../ui/button"

export function TimelineSliderControl() {
  useTimelineStates()
  const [showRemaining, setShowRemaining] = useState(false)

  return (
    <div className="my-auto flex select-none items-center gap-3 grow">
      <Elapsed className="text-xs font-medium tabular-nums text-white" />
      <div className="group/timeline relative w-full grow">
        <TimelineSlider.Root className="focus-area -focus-area-x-2 -focus-area-y-14 group">
          <TimelineSlider.Track className="overflow-hidden">
            <TimelineSlider.Progress />
            <TimelineSlider.Buffered variant="from-zero" />
          </TimelineSlider.Track>
          <TimelineSlider.Thumb
            showWithHover
            className="absolute cursor-crosshair h-8 w-px rounded-full bg-white/60 opacity-0 transition-opacity duration-[var(--lp-transition-speed-regular)] group-hover/timeline:opacity-100 group-active/timeline:bg-white"
          />
        </TimelineSlider.Root>
      </div>
      <Button
        variant="glass"
        size="icon"
        className="h-6 w-14 cursor-default"
        onClick={() => setShowRemaining(!showRemaining)}
      >
        {showRemaining ? (
          <Remaining className="text-xs font-medium tabular-nums text-white" />
        ) : (
          <Duration className="text-xs font-medium tabular-nums text-white" />
        )}
      </Button>
    </div>
  )
}
