"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useMediaStore } from "@/registry/default/ui/media-provider"
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
  const liveLatency = useMediaStore((state) => state.liveLatency)
  const isLive = useMediaStore((state) => state.isLive)
  const player = useMediaStore((state) => state.player)

  return (
    <div className="my-auto flex grow items-center gap-3 select-none">
      {!isLive && <Elapsed className="text-xs font-medium" />}
      <div className="group/timeline relative w-full grow">
        <TimelineSlider.Root className="group focus-area cursor-crosshair -focus-area-x-2 -focus-area-y-14">
          <TimelineSlider.Track className="overflow-hidden">
            <TimelineSlider.Progress />
            <TimelineSlider.Buffered variant="combined" />
          </TimelineSlider.Track>
          <TimelineSlider.Thumb
            showWithHover
            className={`
              absolute h-8 w-px rounded-full bg-lp-accent/60 opacity-0 transition-opacity duration-[var(--lp-transition-speed-regular)]
              group-hover/timeline:opacity-100
              group-active/timeline:bg-white
            `}
          />
          <TimelineSlider.Thumb
            showWithHover
            className={`
              top-auto! bottom-[calc(100%+16px)] flex h-auto w-fit bg-transparent text-xs font-medium opacity-0 transition-opacity
              duration-[var(--lp-transition-speed-regular)]
              group-hover/timeline:opacity-100
            `}
          >
            <HoverTime />
            {!isLive && (
              <>
                &nbsp;/&nbsp;
                <Duration className="text-lp-accent/60" />
              </>
            )}
          </TimelineSlider.Thumb>
        </TimelineSlider.Root>
      </div>
      {!isLive && (
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
            variant="glass"
            size="icon"
            className="h-6 w-fit cursor-pointer"
            onClick={() => void player.goToLive()}
            aria-label="Go to live"
          >
            <span className="text-xs font-medium text-lp-accent">
              Go to live
            </span>
          </Button>
        </>
      )}
      {liveLatency && liveLatency <= 1 && (
        <div className="flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold tracking-wide text-white">
          <div className="mr-1 h-2 w-2 animate-caret-blink rounded-full bg-foreground" />
          <span className="tracking-widest">LIVE</span>
        </div>
      )}
    </div>
  )
}
