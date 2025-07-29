"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import * as TimelineSlider from "@/registry/default/ui/timeline-control"
import {
  Duration,
  Elapsed,
  HoverTime,
  Remaining,
} from "@/registry/default/ui/timeline-labels"

export function TimelineSliderControl() {
  const [showRemaining, setShowRemaining] = useState(false)

  return (
    <div className="my-auto flex grow items-center gap-3 select-none">
      <Elapsed className="text-xs font-medium text-white tabular-nums" />
      <div className="group/timeline relative w-full grow">
        <TimelineSlider.Root className="focus-area -focus-area-x-2 -focus-area-y-14 group cursor-crosshair">
          <TimelineSlider.Track className="overflow-hidden">
            <TimelineSlider.Progress />
            <TimelineSlider.Buffered variant="from-zero" />
          </TimelineSlider.Track>
          <TimelineSlider.Thumb
            showWithHover
            className="absolute h-8 w-px rounded-full bg-white/60 opacity-0 transition-opacity duration-[var(--lp-transition-speed-regular)] group-hover/timeline:opacity-100 group-active/timeline:bg-white"
          />
          <TimelineSlider.Thumb
            showWithHover
            className="top-auto! bottom-[calc(100%+16px)]! flex size-0 h-auto w-fit items-center bg-transparent text-xs font-medium tabular-nums opacity-0 transition-opacity duration-[var(--lp-transition-speed-regular)] group-hover/timeline:opacity-100"
          >
            <HoverTime />
            &nbsp;/&nbsp;
            <Duration className="text-gray-400" />
          </TimelineSlider.Thumb>
        </TimelineSlider.Root>
      </div>
      <Button
        variant="glass"
        size="icon"
        className="h-6 w-14 cursor-pointer"
        onClick={() => {
          setShowRemaining(!showRemaining)
        }}
        aria-label={
          showRemaining ? "Show total duration" : "Show remaining time"
        }
        aria-pressed={showRemaining}
      >
        {showRemaining ? (
          <Remaining className="text-xs font-medium text-white tabular-nums" />
        ) : (
          <Duration className="text-xs font-medium text-white tabular-nums" />
        )}
      </Button>
    </div>
  )
}
