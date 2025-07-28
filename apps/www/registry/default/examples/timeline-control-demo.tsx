"use client"

import { useState } from "react"

import * as TimelineControlPrimitive from "@/registry/default/ui/timeline-control"
import {
  Duration,
  Elapsed,
  Remaining,
} from "@/registry/default/ui/timeline-labels"

export function TimelineControlDemo() {
  const [showRemaining, setShowRemaining] = useState(false)

  return (
    <div className="bg-primary/10 my-4 flex h-fit w-full flex-row items-center gap-3 rounded-md p-3">
      <Elapsed className="text-xs font-medium text-white tabular-nums" />
      <div className="group/timeline relative w-full grow">
        <TimelineControlPrimitive.Root
          className="group focus-area -focus-area-x-2 -focus-area-y-14 cursor-crosshair"
          orientation="horizontal"
        >
          <TimelineControlPrimitive.Track className="overflow-hidden">
            <TimelineControlPrimitive.Progress />
            <TimelineControlPrimitive.Buffered variant="from-zero" />
          </TimelineControlPrimitive.Track>
          <TimelineControlPrimitive.Thumb
            showWithHover
            className={`absolute h-8 w-px rounded-full bg-white/60 opacity-0 transition-opacity duration-[var(--lp-transition-speed-regular)] group-hover/timeline:opacity-100 group-active/timeline:bg-white`}
          />
        </TimelineControlPrimitive.Root>
      </div>
      <button
        className={`text-xs font-medium text-white tabular-nums transition-colors hover:text-white/80`}
        onClick={() => setShowRemaining(!showRemaining)}
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
      </button>
    </div>
  )
}
