"use client"

import { cn } from "@/lib/utils"
import * as TimelineSlider from "@/registry/default/ui/timeline-control"
import {
  Duration,
  Elapsed,
  HoverTime,
} from "@/registry/default/ui/timeline-labels"

export function TimeLabels() {
  return (
    <div className="flex items-center gap-1 text-xs text-secondary">
      <Elapsed />
      <span>/</span>
      <Duration />
    </div>
  )
}

export function TimelineControl() {
  return (
    <div className="group/timeline absolute -top-2 flex h-4 w-full items-center pr-2">
      <TimelineSlider.Root
        className={cn(
          `
            flex w-full cursor-pointer touch-none items-center transition-[height] duration-150 select-none
            group-hover/timeline:data-[orientation=horizontal]:h-1
          `,
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "focus-area -focus-area-x-0 -focus-area-y-12"
        )}
      >
        <TimelineSlider.Track className={`overflow-hidden bg-[#383838]`}>
          <TimelineSlider.Buffered
            className="absolute h-full bg-[#4C4C4C]"
            variant="combined"
          />
          <TimelineSlider.Progress className="absolute h-full bg-linear-to-r from-rose-600 from-80% to-pink-500" />
        </TimelineSlider.Track>

        <TimelineSlider.Thumb
          className={cn(
            "absolute top-1/2 size-0 -translate-y-1/2 rounded-full bg-rose-600!",
            `
              transition-[height,width]
              group-hover/timeline:size-4
            `
          )}
        />

        <TimelineSlider.Thumb
          className={`
            pointer-events-none top-auto! bottom-2 flex h-auto w-fit rounded-sm bg-background/90! px-2 py-1 text-xs text-foreground opacity-0
            transition-opacity duration-200
            group-hover/timeline:opacity-100
          `}
          showWithHover
        >
          <HoverTime />
        </TimelineSlider.Thumb>
      </TimelineSlider.Root>
    </div>
  )
}
