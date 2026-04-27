"use client"

import { useState } from "react"

import { Button } from "@/registry/default/blocks/linear-player/ui/button"
import { usePlayerStore } from "@/registry/default/hooks/use-player"
import { useTimelineStore } from "@/registry/default/hooks/use-timeline"
import * as TimelineSlider from "@/registry/default/ui/timeline-control"
import {
  Duration,
  Elapsed,
  HoverTime,
  LiveLatency,
  Remaining,
} from "@/registry/default/ui/timeline-labels"

export function TimelineSliderControl() {
  const [showRemaining, setShowRemaining] = useState(false)
  const liveLatency = useTimelineStore((state) => state.liveLatency)
  const isLive = useTimelineStore((state) => state.isLive)
  const player = usePlayerStore((state) => state.instance)

  return (
    <div className="my-auto flex grow items-center gap-3 select-none">
      {!isLive && <Elapsed className="text-xs font-medium" />}
      <div className="group/timeline relative w-full grow">
        <TimelineSlider.Root
          className={`
            group focus-area h-1 cursor-crosshair rounded-full transition-[height] duration-150 ease-out-quad -focus-area-x-2 -focus-area-y-14
            active:data-[orientation=horizontal]:h-(--lp-timeline-track-height-active)
          `}
        >
          <TimelineSlider.Track className="overflow-hidden rounded-full">
            <TimelineSlider.Progress className="rounded-s-full" />
            <TimelineSlider.Buffered variant="combined" />
          </TimelineSlider.Track>
          <TimelineSlider.Thumb
            className={`
              absolute h-8 w-px rounded-full bg-primary/60 opacity-0 transition-opacity duration-300
              group-hover/timeline:opacity-100
              group-active/timeline:bg-white
            `}
            showWithHover
          />
          <TimelineSlider.Thumb
            className={`
              top-auto! bottom-[calc(100%+16px)] flex h-auto w-fit bg-transparent text-xs font-medium opacity-0 transition-opacity duration-300
              group-hover/timeline:opacity-100
            `}
            showWithHover
          >
            <HoverTime />
            {!isLive && (
              <>
                &nbsp;/&nbsp;
                <Duration className="text-primary/60" />
              </>
            )}
          </TimelineSlider.Thumb>
        </TimelineSlider.Root>
      </div>
      {!isLive && (
        <Button
          aria-label={
            showRemaining ? "Show total duration" : "Show remaining time"
          }
          aria-pressed={showRemaining}
          className={`
            h-6 w-14 cursor-pointer
            hover:bg-transparent
            focus-visible:bg-transparent
          `}
          onClick={() => {
            setShowRemaining(!showRemaining)
          }}
          size="sm"
          variant="glass"
        >
          {showRemaining ? (
            <Remaining className="text-xs font-medium" />
          ) : (
            <Duration className="text-xs font-medium" />
          )}
        </Button>
      )}
      {liveLatency && player && liveLatency > 1 && (
        <>
          <LiveLatency className="text-xs font-medium" />
          <Button
            aria-label="Go to live"
            className="h-6 w-fit cursor-pointer"
            onClick={() => void player.goToLive()}
            size="icon"
            variant="glass"
          >
            <span className="text-xs font-medium text-primary">Go to live</span>
          </Button>
        </>
      )}
      {liveLatency && liveLatency <= 1 && (
        <div className="flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold tracking-wide">
          <div className="mr-1 h-2 w-2 animate-caret-blink rounded-full bg-foreground" />
          <span className="tracking-widest">LIVE</span>
        </div>
      )}
    </div>
  )
}
