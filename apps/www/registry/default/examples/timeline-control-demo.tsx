"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import * as TimelineControlPrimitive from "@/registry/default/ui/timeline-control"
import {
  Duration,
  Elapsed,
  Remaining,
} from "@/registry/default/ui/timeline-labels"

export function TimelineControlDemo() {
  const [showRemaining, setShowRemaining] = useState(false)

  return (
    <div className="my-4 flex h-fit w-full flex-row items-center gap-3 rounded-md border p-3">
      <Elapsed className="text-xs font-medium" />
      <div className="group/timeline relative w-full grow">
        <TimelineControlPrimitive.Root
          className="group focus-area cursor-crosshair -focus-area-x-2 -focus-area-y-14"
          orientation="horizontal"
        >
          <TimelineControlPrimitive.Track className="overflow-hidden">
            <TimelineControlPrimitive.Progress />
            <TimelineControlPrimitive.Buffered variant="combined" />
          </TimelineControlPrimitive.Track>
          <TimelineControlPrimitive.Thumb
            className={`
              absolute h-8 w-px rounded-full bg-primary/60 opacity-0 transition-opacity duration-300
              group-hover/timeline:opacity-100
              group-active/timeline:bg-primary
            `}
            showWithHover
          />
        </TimelineControlPrimitive.Root>
      </div>
      <Button
        aria-label={
          showRemaining ? "Show total duration" : "Show remaining time"
        }
        aria-pressed={showRemaining}
        onClick={() => {
          setShowRemaining(!showRemaining)
        }}
        size="sm"
        variant="ghost"
      >
        {showRemaining ? (
          <Remaining className="text-xs font-medium" />
        ) : (
          <Duration className="text-xs font-medium" />
        )}
      </Button>
    </div>
  )
}
