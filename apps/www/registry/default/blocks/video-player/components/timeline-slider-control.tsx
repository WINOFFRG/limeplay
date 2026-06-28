"use client"

import { useState } from "react"

import { Button } from "@/registry/default/blocks/video-player/components/button"
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

const LIVE_DELAY_VISIBLE_SEC = 3

export function TimelineSliderControl() {
  const [showRemaining, setShowRemaining] = useState(false)
  const liveLatency = useTimelineStore((state) => state.liveLatency)
  const isLive = useTimelineStore((state) => state.isLive)
  const player = usePlayerStore((state) => state.instance)

  return (
    <div
      className="
        me-auto flex grow items-center gap-1.5 select-none
        @3xl/root:gap-3
      "
    >
      {!isLive && <Elapsed className="px-2 text-xs font-medium" />}
      <div className="group/timeline relative w-full grow">
        <TimelineSlider.Root
          className={`
            group hit-area-x-[2px] hit-area-y-[14px] hit-area h-1 cursor-crosshair rounded-full transition-[height] duration-150 ease-in-out
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
            {isLive && <>&minus;</>}
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
        <button
          aria-label={
            showRemaining ? "Show total duration" : "Show remaining time"
          }
          aria-pressed={showRemaining}
          className="
            inline-flex h-7 w-[6ch] cursor-pointer items-center justify-center rounded-sm
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50 focus-visible:outline-solid
          "
          onClick={() => {
            setShowRemaining(!showRemaining)
          }}
          tabIndex={0}
          type="button"
        >
          {showRemaining ? (
            <Remaining className="text-xs font-medium" />
          ) : (
            <Duration className="text-xs font-medium" />
          )}
        </button>
      )}
      {isLive && (
        <>
          {liveLatency && player && liveLatency >= LIVE_DELAY_VISIBLE_SEC && (
            <>
              <LiveLatency className="text-xs font-medium" />
              <Button
                aria-label="Go to live"
                className="
                  cursor-pointer px-2
                  @md/root:px-2.5
                  @3xl/root:px-3
                "
                onClick={() => void player.goToLive()}
                size="sm"
                variant="glass"
              >
                <span className="text-xs font-medium text-primary">
                  Go to live
                </span>
              </Button>
            </>
          )}
          {liveLatency && liveLatency < LIVE_DELAY_VISIBLE_SEC && (
            <div className="flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold tracking-wide">
              <span className="tracking-widest">LIVE</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
